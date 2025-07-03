import { failure, success } from "../utils/responses.js";
import express from "express";
import { getKey, setKey } from "../utils/redis.js";
import logger from "../utils/logger.js";
import { Course, Category, User } from "../models/index.js";

const router = express.Router();

/**
 * 查询首页数据
 * GET /
 */
router.get("/", async function (req, res) {
  try {
    throw new Error("error");
    // 如果有缓存，直接返回缓存数据
    let data = await getKey("index");
    if (data) {
      return success(res, "获取首页数据成功。", data);
    }
    const recommendedCourses = await Course.findAll({
      where: { recommended: true },
      order: [["id", "DESC"]],
      limit: 10,
      include: [
        { model: Category, attributes: ["id", "name"] },
        {
          model: User,
          attributes: ["id", "username", "nickname", "avatar", "company"],
        },
      ],
      attributes: { exclude: ["categoryId", "userId", "content"] },
    });
    const likesCourses = await Course.findAll({
      order: [
        ["likesCount", "DESC"],
        ["id", "DESC"],
      ],
      limit: 10,
      attributes: { exclude: ["categoryId", "userId", "content"] },
    });
    const introductoryCourses = await Course.findAll({
      where: { introductory: true },
      order: [["id", "DESC"]],
      limit: 10,
      attributes: { exclude: ["categoryId", "userId", "content"] },
    });

    // 组装数据
    data = {
      recommendedCourses,
      likesCourses,
      introductoryCourses,
    };
    // 设置缓存过期时间，为10秒钟
    await setKey("index", data, 30 * 60);
    success(res, "获取首页数据成功。", data);
  } catch (error) {
    logger.error(error);
    failure(res, error);
  }
});

export default router;
