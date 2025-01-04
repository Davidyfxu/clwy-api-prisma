import { failure, success } from "../utils/responses.js";
import express from "express";
import prisma from "../lib/prisma.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();
/**
 * 查询文章详情
 * GET /:id
 */
router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const article = await prisma.articles.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!article) {
      throw new NotFoundError(`ID: ${id}的文章未找到。`);
    }
    success(res, "查询文章详情成功。", { article });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询文章列表
 * GET /
 */
router.get("/", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const articles = await prisma.articles.findMany({
      omit: {
        content: true,
      },
      skip: offset, // 跳过的记录数,
      take: pageSize, // 返回的记录数
      orderBy: {
        id: "desc",
      },
    });
    // 查询总记录数
    const total = await prisma.articles.count({});

    success(res, "查询文章数据成功。", {
      articles,
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

export default router;
