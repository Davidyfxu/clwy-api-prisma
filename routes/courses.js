import { failure, success } from "../utils/responses.js";
import express from "express";
import { NotFoundError } from "../utils/errors.js";
import { getKey, setKey } from "../utils/redis.js";
import { Course, Category, Chapter, User } from "../models/index.js";

const router = express.Router();

/**
 * 查询课程列表
 * GET /
 */
router.get("/", async function (req, res) {
  try {
    const query = req.query;
    const categoryId = query.categoryId;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;
    if (!categoryId) {
      throw new Error("获取课程列表失败，分类ID不能为空。");
    }
    const cacheKey = `courses:${categoryId}:${currentPage}:${pageSize}`;
    let data = await getKey(cacheKey);
    if (data) {
      return success(res, "查询文章列表成功。", data);
    }
    const courses = await Course.findAll({
      attributes: { exclude: ["categoryId", "userId", "content"] },
      where: { categoryId: Number(categoryId) },
      offset,
      limit: pageSize,
      order: [["id", "DESC"]],
    });
    const total = await Course.count({
      where: { categoryId: Number(categoryId) },
    });
    data = {
      courses,
      pagination: {
        total,
        currentPage,
        pageSize,
      },
    };
    await setKey(cacheKey, data);
    success(res, "查询课程数据成功。", data);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询课程详情
 * GET /:id
 */
router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(Number(id), {
      attributes: { exclude: ["categoryId", "userId"] },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: Chapter,
          attributes: ["id", "title", "rank", "createdAt"],
          order: [
            ["rank", "ASC"],
            ["id", "DESC"],
          ],
        },
        {
          model: User,
          attributes: ["id", "username", "nickname", "avatar", "company"],
        },
      ],
    });
    if (!course) {
      throw new NotFoundError(`ID: ${id}的课程未找到。`);
    }
    success(res, "查询课程详情成功。", { course });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
