import express from "express";
import prisma from "../../lib/prisma.js";
import { z } from "zod";
import { NotFoundError, success, failure } from "../../utils/response.js";

const router = express.Router();

// 公共方法：查询当前用户
async function getUser(req) {
  // 获取用户 ID
  const { id } = req.params;

  // 查询当前用户
  const user = await prisma.users.findUnique({
    where: {
      id: Number(id),
    },
  });

  // 如果没有找到，就抛出异常
  if (!user) {
    throw new NotFoundError(`ID: ${id}的用户未找到。`);
  }

  return user;
}
// 白名单过滤
function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  };
}
// 定义验证 schema
const updateUserSchema = z.object({
  email: z.string().min(1, "email不能为空"),
});
// 查询用户列表
router.get("/", async (req, res) => {
  try {
    const {
      email,
      username,
      nickname,
      role,
      currentPage = 1,
      pageSize = 10,
    } = req.query;
    // 将 currentPage 和 pageSize 转换为数字
    const page = parseInt(currentPage, 10);
    const size = parseInt(pageSize, 10);
    // 计算offset
    const offset = (page - 1) * size;

    const where = {};
    if (email || username || nickname || role) {
      where.OR = [];
    }
    email && where.OR.push({ email: { contains: email } });
    username && where.OR.push({ username: { contains: username } });
    nickname && where.OR.push({ nickname: { contains: nickname } });
    role && where.OR.push({ role: { contains: role } });
    const users = await prisma.users.findMany({
      where, // 应用条件查询
      skip: offset, // 跳过的记录数,
      take: size, // 返回的记录数
      orderBy: {
        id: "asc",
      },
    });
    // 查询总记录数
    const total = await prisma.users.count({ where });

    // 查询用户列表
    success(res, "查询用户列表成功。", {
      users,
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

// 查询用户详情
router.get("/:id", async (req, res) => {
  try {
    const user = await getUser(req);
    success(res, "查询用户成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});

// 创建用户
router.post("/", async (req, res) => {
  try {
    const { title, content } = filterBody(req);

    const validationResult = updateUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const user = await prisma.users.create({
      data: {
        title,
        content,
      },
    });

    success(res, "创建用户成功。", { user }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除用户
router.delete("/:id", async (req, res) => {
  try {
    const user = await getUser(req);
    await prisma.users.delete({
      where: {
        id: Number(user?.id),
      },
    });
    success(res, "删除用户成功。");
  } catch (error) {
    failure(res, error);
  }
});

// 更新用户
router.put("/:id", async (req, res) => {
  try {
    const user = await getUser(req);
    const body = filterBody(req);

    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: user?.id,
      },
      data: body,
    });
    success(res, "更新用户成功。", { user: updatedUser });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
