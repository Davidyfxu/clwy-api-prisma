import express from "express";
import prisma from "../../lib/prisma.js";
import { failure, NotFoundError, success } from "../../utils/response.js";
import { updateCourseSchema } from "../../utils/schemas.js";

const router = express.Router();

// 公共方法：查询当前课程
async function getCourse(req) {
  // 获取课程 ID
  const { id } = req.params;

  // 查询当前课程
  const course = await prisma.courses.findUnique({
    where: {
      id: Number(id),
    },
    ...getCondition(),
  });

  // 如果没有找到，就抛出异常
  if (!course) {
    throw new NotFoundError(`ID: ${id}的课程未找到。`);
  }

  return course;
}
// 白名单过滤
function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    userId: req.body.userId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content,
  };
}
// 公共方法：关联分类、用户数据
function getCondition() {
  return {
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  };
}
// 查询课程列表
router.get("/", async (req, res) => {
  try {
    const {
      categoryId,
      userId,
      name,
      recommended,
      introductory,
      currentPage = 1,
      pageSize = 10,
    } = req.query;
    // 将 currentPage 和 pageSize 转换为数字
    const page = parseInt(currentPage, 10);
    const size = parseInt(pageSize, 10);
    // 计算offset
    const offset = (page - 1) * size;

    const where = {};
    categoryId && (where.categoryId = parseInt(categoryId, 10));
    userId && (where.userId = parseInt(userId, 10));
    name && (where.name = { contains: name });
    recommended && (where.recommended = recommended === "true");
    introductory && (where.introductory = introductory === "true");

    const courses = await prisma.courses.findMany({
      ...getCondition(),
      where, // 应用条件查询
      skip: offset, // 跳过的记录数,
      take: size, // 返回的记录数
      orderBy: {
        id: "asc",
      },
    });
    // 查询总记录数
    const total = await prisma.courses.count({ where });

    // 查询课程列表
    success(res, "查询课程列表成功。", {
      courses,
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

// 查询课程详情
router.get("/:id", async (req, res) => {
  try {
    const course = await getCourse(req);
    success(res, "查询课程成功。", { course });
  } catch (error) {
    failure(res, error);
  }
});

// 创建课程
router.post("/", async (req, res) => {
  try {
    const { title, content } = filterBody(req);

    const validationResult = updateCourseSchema.safeParse(req.body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const course = await prisma.courses.create({
      data: {
        title,
        content,
      },
    });

    success(res, "创建课程成功。", { course }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除课程
router.delete("/:id", async (req, res) => {
  try {
    const course = await getCourse(req);
    const count = await prisma.chapters.count({
      where: { courseId: course?.id },
    });
    if (count > 0) {
      return failure(res, new Error("该课程下有章节，无法删除。"));
    }
    await prisma.courses.delete({
      where: {
        id: Number(course?.id),
      },
    });
    success(res, "删除课程成功。");
  } catch (error) {
    failure(res, error);
  }
});

// 更新课程
router.put("/:id", async (req, res) => {
  try {
    const course = await getCourse(req);
    const body = filterBody(req);

    const validationResult = updateCourseSchema.safeParse(body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const updatedCourse = await prisma.courses.update({
      where: {
        id: course?.id,
      },
      data: body,
    });
    success(res, "更新课程成功。", { course: updatedCourse });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
