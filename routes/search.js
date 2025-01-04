import { failure, success } from "../utils/responses.js";
import express from "express";
import prisma from "../lib/prisma.js";

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
    const condition = {
      omit: { categoryId: true, userId: true, content: true },
      orderBy: { id: "desc" },
      skip: offset,
      take: pageSize,
    };
    if (query.name) {
      condition.where = {
        name: {
          contains: query.name,
        },
      };
    }
    const courses = await prisma.courses.findMany({ ...condition });
    const count = await prisma.courses.count({});

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
