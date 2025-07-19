import express from "express";
import { failure, success } from "../../utils/responses.js";
import { NotFoundError } from "../../utils/errors.js";
import { delKey, getKeysByPattern } from "../../utils/redis.js";
import { Article } from "../../models/index.js";
import { Op } from "sequelize";

const router = express.Router();
/**
 * 清除缓存
 * @returns {Promise<void>}
 */
async function clearCache(id = null) {
  // 清除所有文章列表缓存
  const keys = await getKeysByPattern("articles:*");
  if (keys.length !== 0) {
    await delKey(keys);
  }

  // 如果传递了id，则通过id清除文章详情缓存
  if (id) {
    // 如果是数组，则遍历
    const keys = Array.isArray(id)
      ? id.map((item) => `article:${item}`)
      : `article:${id}`;
    await delKey(keys);
  }
}
// 公共方法：查询当前文章
async function getArticle(req) {
  // 获取文章 ID
  const { id } = req.params;
  // 查询当前文章
  const article = await Article.findOne({
    where: {
      deletedAt: null,
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

// 查询文章列表
router.get("/", async (req, res) => {
  try {
    const { title, currentPage = 1, pageSize = 10 } = req.query;
    // 将 currentPage 和 pageSize 转换为数字
    const page = Math.abs(Number(currentPage)) || 1;
    const size = Math.abs(Number(pageSize)) || 10;
    // 计算offset
    const offset = (page - 1) * size;

    const where = {
      deletedAt: null,
    };

    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }
    const articles = await Article.findAll({
      where, // 应用条件查询
      offset, // 跳过的记录数,
      limit: size, // 返回的记录数
      order: [["id", "ASC"]],
    });
    // 查询总记录数
    const total = await Article.count({ where });

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
    const article = await Article.create({ title, content });
    await clearCache();
    success(res, "创建文章成功。", { article }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除文章
router.delete("/:id", async (req, res) => {
  try {
    const article = await getArticle(req);
    await Article.destroy({ where: { id: Number(article?.id) } });
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
    await Article.update(body, { where: { id: article?.id } });
    await clearCache(article.id);
    success(res, "更新文章成功。", {
      article: { ...article.toJSON(), ...body },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除到回收站
 * POST /admin/articles/delete
 */
router.post("/delete", async function (req, res) {
  try {
    const { ids } = req.body;

    await Article.update(
      { deletedAt: new Date() },
      {
        where: {
          id: Array.isArray(ids) ? ids.map((v) => Number(v)) : [Number(ids)],
        },
      },
    );
    await clearCache(ids);
    success(res, "已删除到回收站。");
  } catch (error) {
    failure(res, error);
  }
});
/**
 * 从回收站回复
 * POST /admin/articles/restore
 */
router.post("/restore", async function (req, res) {
  try {
    const { ids } = req.body;
    await Article.update(
      { deletedAt: null },
      {
        where: {
          id: Array.isArray(ids) ? ids.map((v) => Number(v)) : [Number(ids)],
        },
      },
    );
    await clearCache(ids);
    success(res, "已从回收站恢复。");
  } catch (error) {
    failure(res, error);
  }
});
/**
 * 强制删除文章
 * POST /admin/articles/force_delete
 */
router.post("/force_delete", async function (req, res) {
  try {
    const { ids } = req.body;
    await Article.destroy({
      where: {
        id: Array.isArray(ids) ? ids.map((v) => Number(v)) : [Number(ids)],
      },
    });
    await clearCache();
    success(res, "已彻底删除。");
  } catch (error) {
    failure(res, error);
  }
});

export default router;
