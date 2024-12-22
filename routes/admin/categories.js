import express from "express";
import prisma from "../../lib/prisma.js";
import { z } from "zod";
import { NotFoundError, success, failure } from "../../utils/response.js";

const router = express.Router();

// 公共方法：查询当前分类
async function getCategory(req) {
  // 获取分类 ID
  const { id } = req.params;

  // 查询当前分类
  const category = await prisma.categories.findUnique({
    where: {
      id: Number(id),
    },
  });

  // 如果没有找到，就抛出异常
  if (!category) {
    throw new NotFoundError(`ID: ${id}的分类未找到。`);
  }

  return category;
}
// 白名单过滤
function filterBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank,
  };
}
// 定义验证 schema
const updateCategorySchema = z.object({
  name: z.string().min(1, "标题不能为空"),
});
// 查询分类列表
router.get("/", async (req, res) => {
  try {
    const { name, currentPage = 1, pageSize = 10 } = req.query;
    // 将 currentPage 和 pageSize 转换为数字
    const page = Number(currentPage);
    const size = Number(pageSize);
    // 计算offset
    const offset = (page - 1) * size;

    const where = {};
    if (name) {
      where.name = { contains: name };
    }
    const categories = await prisma.categories.findMany({
      where, // 应用条件查询
      skip: offset, // 跳过的记录数,
      take: size, // 返回的记录数
      orderBy: {
        id: "asc",
      },
    });
    // 查询总记录数
    const total = await prisma.categories.count({ where });

    // 查询分类列表
    success(res, "查询分类列表成功。", {
      categories,
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

// 查询分类详情
router.get("/:id", async (req, res) => {
  try {
    const category = await getCategory(req);
    success(res, "查询分类成功。", { category });
  } catch (error) {
    failure(res, error);
  }
});

// 创建分类
router.post("/", async (req, res) => {
  try {
    const { name, rank } = filterBody(req);

    const validationResult = updateCategorySchema.safeParse(req.body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const category = await prisma.categories.create({
      data: {
        name,
        rank,
      },
    });

    success(res, "创建分类成功。", { category }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除分类
router.delete("/:id", async (req, res) => {
  try {
    const category = await getCategory(req);
    await prisma.categories.delete({
      where: {
        id: Number(category?.id),
      },
    });
    success(res, "删除分类成功。");
  } catch (error) {
    failure(res, error);
  }
});

// 更新分类
router.put("/:id", async (req, res) => {
  try {
    const category = await getCategory(req);
    const body = filterBody(req);

    const validationResult = updateCategorySchema.safeParse(body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const updatedCategory = await prisma.categories.update({
      where: {
        id: category?.id,
      },
      data: body,
    });
    success(res, "更新分类成功。", { category: updatedCategory });
  } catch (error) {
    failure(res, error);
  }
});

export default router;