import { failure, success } from "../utils/responses.js";
import express from "express";
import prisma from "../lib/prisma.js";
import { NotFoundError } from "../utils/errors.js";
import { getKey, setKey } from "../utils/redis.js";

const router = express.Router();

/**
 * 查询文章详情
 * GET /:id
 */
router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    let article = await getKey(`article:${id}`);
    if (!article) {
      article = await prisma.articles.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!article) {
        throw new NotFoundError(`ID: ${id}的文章未找到。`);
      }
      await setKey(`article:${id}`, article);
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

    // 定义带有「当前页码」和「每页条数」的 cacheKey 作为缓存的键
    const cacheKey = `articles:${currentPage}:${pageSize}`;
    let data = await getKey(cacheKey);
    if (data) {
      return success(res, "查询文章列表成功。", data);
    }

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

    data = {
      articles,
      pagination: {
        total,
        currentPage,
        pageSize,
      },
    };
    await setKey(cacheKey, data);
    success(res, "查询文章数据成功。", data);
  } catch (error) {
    failure(res, error);
  }
});

export default router;
