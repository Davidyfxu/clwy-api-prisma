import { failure, success } from "../utils/responses.js";
import express from "express";
import { Article, Course, User } from "../models/index.js";

const router = express.Router();

/**
 * 查询搜索数据
 * GET /search
 */
router.get("/", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;
    const where = {};
    if (query.name) {
      where.name = { [Course.sequelize.Op.like]: `%${query.name}%` };
    }
    const courses = await Course.findAll({
      attributes: { exclude: ["categoryId", "userId", "content"] },
      where,
      order: [["id", "DESC"]],
      offset,
      limit: pageSize,
    });
    const count = await Course.count({ where });
    success(res, "获取搜索数据成功。", {
      courses,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
