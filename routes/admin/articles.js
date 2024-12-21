import express from "express";
import prisma from "../../lib/prisma.js";
import { z } from "zod";
import { NotFoundError, success, failure } from "../../utils/response.js";

const router = express.Router();

// 公共方法：查询当前文章
async function getArticle(req) {
  // 获取文章 ID
  const { id } = req.params;

  // 查询当前文章
  const article = await prisma.articles.findUnique({
    where: {
      id: Number(id),
    },
  });

  // 如果没有找到，就抛出异常
  if (!article) {
    throw new NotFoundError(`ID: ${id}的文章未找到。`);
  }

  return article;
}
// 白名单过滤
function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content,
  };
}
// 定义验证 schema
const updateArticleSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
});
// 查询文章列表
router.get("/", async (req, res) => {
  try {
    const { title, currentPage = 1, pageSize = 10 } = req.query;
    // 将 currentPage 和 pageSize 转换为数字
    const page = parseInt(currentPage, 10);
    const size = parseInt(pageSize, 10);
    // 计算offset
    const offset = (page - 1) * size;

    const where = {};
    if (title) {
      where.title = { contains: title };
    }
    const articles = await prisma.articles.findMany({
      where, // 应用条件查询
      skip: offset, // 跳过的记录数,
      take: size, // 返回的记录数
      orderBy: {
        id: "asc",
      },
    });
    // 查询总记录数
    const total = await prisma.articles.count({ where });

    // 查询文章列表
    success(res, "查询文章列表成功。", {
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

// 查询文章详情
router.get("/:id", async (req, res) => {
  try {
    const article = await getArticle(req);
    success(res, "查询文章成功。", { article });
  } catch (error) {
    failure(res, error);
  }
});

// 创建文章
router.post("/", async (req, res) => {
  try {
    const { title, content } = filterBody(req);

    const validationResult = updateArticleSchema.safeParse(req.body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const article = await prisma.articles.create({
      data: {
        title,
        content,
      },
    });

    success(res, "创建文章成功。", { article }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除文章
router.delete("/:id", async (req, res) => {
  try {
    const article = await getArticle(req);
    await prisma.articles.delete({
      where: {
        id: Number(article?.id),
      },
    });
    success(res, "删除文章成功。");
  } catch (error) {
    failure(res, error);
  }
});

// 更新文章
router.put("/:id", async (req, res) => {
  try {
    const article = await getArticle(req);
    const body = filterBody(req);

    const validationResult = updateArticleSchema.safeParse(body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const updatedArticle = await prisma.articles.update({
      where: {
        id: article?.id,
      },
      data: body,
    });
    success(res, "更新文章成功。", { article: updatedArticle });
  } catch (error) {
    failure(res, error);
  }
});

export default router;