import express from "express";
import { Chapter, Course, Setting } from "../../models/index.js";
import { failure, success } from "../../utils/responses.js";
import { NotFoundError } from "../../utils/errors.js";
import { flushAll } from "../../utils/redis.js";
import { chaptersIndex, coursesIndex } from "../../utils/meilisearch.js";

const router = express.Router();

// 公共方法：查询当前系统设置
async function getSetting() {
  // 查询当前系统设置
  const setting = await Setting.findOne();

  // 如果没有找到，就抛出异常
  if (!setting) {
    throw new NotFoundError(`系统设置未找到。`);
  }
  return setting;
}
// 白名单过滤
function filterBody(req) {
  return {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright,
  };
}

// 查询系统设置列表
router.get("/", async (req, res) => {
  try {
    const setting = await getSetting();
    success(res, "查询系统设置成功。", { setting });
  } catch (error) {
    failure(res, error);
  }
});
// 更新系统设置
router.put("/", async (req, res) => {
  try {
    const setting = await getSetting();
    const body = filterBody(req);

    const updatedSettingArr = await Setting.update(body, {
      where: {
        id: setting?.id,
      },
      returning: true,
    });
    const updatedSetting = updatedSettingArr[1][0];
    success(res, "更新系统设置成功。", { setting: updatedSetting });
  } catch (error) {
    failure(res, error);
  }
});
/**
 * 清除所有缓存
 */
router.get("/flush-all", async function (req, res) {
  try {
    await flushAll();
    success(res, "清除所有缓存成功。");
  } catch (error) {
    failure(res, error);
  }
});

// 重建meilisearch索引
router.get("/meilisearch_reindex", async (req, res) => {
  try {
    // 课程
    const courses = await Course.findAll({
      attributes: ["id", "name", "image", "content", "likesCount", "updatedAt"],
    });
    await coursesIndex.addDocuments(courses);

    // 章节
    const chapters = await Chapter.findAll({
      attributes: ["id", "title", "content", "updatedAt"],
      include: [
        {
          model: Course,
          as: "Course",
          attributes: ["id", "name", "image"],
        },
      ],
    });
    await chaptersIndex.addDocuments(chapters);

    success(res, "重建索引成功。");
  } catch (error) {
    failure(res, error);
  }
});
export default router;
