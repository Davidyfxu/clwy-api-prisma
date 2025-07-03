import express from "express";
import { Chapter, Course } from "../../models/index.js";
import { failure, success } from "../../utils/responses.js";
import { updateChapterSchema } from "../../utils/schemas.js";
import { NotFoundError } from "../../utils/errors.js";
import { delKey } from "../../utils/redis.js";

const router = express.Router();
async function clearCache(chapter) {
  await delKey(`chapters:${chapter.courseId}`);
  await delKey(`chapter:${chapter.id}`);
}
// 公共方法：查询当前章节
async function getChapter(req) {
  // 获取章节 ID
  const { id } = req.params;

  // 查询当前章节
  const chapter = await Chapter.findOne({
    where: {
      id: Number(id),
    },
    include: [{ model: Course }],
  });

  // 如果没有找到，就抛出异常
  if (!chapter) {
    throw new NotFoundError(`ID: ${id}的章节未找到。`);
  }

  return chapter;
}
// 白名单过滤
function filterBody(req) {
  return {
    courseId: req.body.courseId,
    title: req.body.title,
    content: req.body.content,
    video: req.body.video,
    rank: req.body.rank,
  };
}
// 公共查询
function getCondition() {
  return {
    include: {
      course: true,
    },
  };
}

// 查询章节列表
router.get("/", async (req, res) => {
  try {
    const { courseId, title, currentPage = 1, pageSize = 10 } = req.query;
    // 将 currentPage 和 pageSize 转换为数字
    const page = parseInt(currentPage, 10);
    const size = parseInt(pageSize, 10);
    // 计算offset
    const offset = (page - 1) * size;

    if (!courseId) {
      throw new Error("获取章节列表失败，课程ID不能为空。");
    }
    const where = {};
    courseId && (where.courseId = Number(courseId));
    title && (where.title = { contains: title });

    const chapters = await Chapter.findAll({
      where,
      offset,
      limit: size,
      order: [
        ["rank", "asc"],
        ["id", "asc"],
      ],
      include: [{ model: Course }],
    });
    const total = await Chapter.count({ where });

    // 查询章节列表
    success(res, "查询章节列表成功。", {
      chapters,
      pagination: {
        total,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

// 查询章节详情
router.get("/:id", async (req, res) => {
  try {
    const chapter = await getChapter(req);
    success(res, "查询章节成功。", { chapter });
  } catch (error) {
    failure(res, error);
  }
});

// 创建章节
router.post("/", async (req, res) => {
  try {
    const body = filterBody(req);

    const validationResult = updateChapterSchema.safeParse(body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const chapter = await Chapter.create(body);
    await Course.update(
      { chaptersCount: Course.sequelize.literal("chaptersCount + 1") },
      {
        where: {
          id: chapter.courseId,
        },
      },
    );
    await clearCache(chapter);
    success(res, "创建章节成功。", { chapter }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除章节
router.delete("/:id", async (req, res) => {
  try {
    const chapter = await getChapter(req);
    await Chapter.destroy({
      where: {
        id: Number(chapter?.id),
      },
    });
    await Course.update(
      { chaptersCount: Course.sequelize.literal("chaptersCount - 1") },
      {
        where: {
          id: chapter.courseId,
        },
      },
    );
    await clearCache(chapter);
    success(res, "删除章节成功。");
  } catch (error) {
    failure(res, error);
  }
});

// 更新章节
router.put("/:id", async (req, res) => {
  try {
    const chapter = await getChapter(req);
    const body = filterBody(req);

    const validationResult = updateChapterSchema.safeParse(body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const updatedChapterArr = await Chapter.update(body, {
      where: {
        id: chapter?.id,
      },
      returning: true,
    });
    const updatedChapter = updatedChapterArr[1][0];
    await clearCache(chapter);
    success(res, "更新章节成功。", { chapter: updatedChapter });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
