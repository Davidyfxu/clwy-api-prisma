import express from "express";
import prisma from "../../lib/prisma.js";
import { failure, success } from "../../utils/responses.js";
import { updateCategorySchema } from "../../utils/schemas.js";
import { NotFoundError } from "../../utils/errors.js";
import { StatusCodes } from "http-status-codes";
import { delKey } from "../../utils/redis.js";

const router = express.Router();
// 清除缓存
async function clearCache(category = null) {
  await delKey("categories");
  if (category) {
    await delKey(`category:${category.id}`);
  }
}
// 公共方法：查询当前分类
async function getCategory(req) {
  // 获取分类 ID
  const { id } = req.params;

  // 查询当前分类
  const category = await prisma.categories.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      courses: true,
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
      orderBy: [{ rank: "asc" }, { id: "asc" }],
      include: {
        courses: true,
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
    await clearCache();
    success(res, "创建分类成功。", { category }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除分类
router.delete("/:id", async (req, res) => {
  try {
    const category = await getCategory(req);
    // 孤儿记录：如果有对应使用该分类的记录，则不能删除此分类
    const count = await prisma.courses.count({
      where: {
        categoryId: Number(category?.id),
      },
    });
    if (count > 0) {
      return failure(
        res,
        new Error("该分类下有课程，不能删除。"),
        StatusCodes.CONFLICT,
      );
    }

    await prisma.categories.delete({
      where: {
        id: Number(category?.id),
      },
    });
    await clearCache(category);
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
    await clearCache(category);
    success(res, "更新分类成功。", { category: updatedCategory });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
