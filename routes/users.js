import { failure, success } from "../utils/responses.js";
import express from "express";
import prisma from "../lib/prisma.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

const router = express.Router();

/**
 * 查询登录用户详细数据
 * GET /me
 */
router.get("/me", async function (req, res) {
  try {
    const user = await getUser(req);
    success(res, "查询当前用户信息成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});

// 公共方法：查询当前用户
async function getUser(req, showPassword = false) {
  const id = req.userId;
  let condition = {};
  if (!showPassword) {
    condition.omit = {
      password: true,
    };
  }
  // 查询当前用户
  const user = await prisma.users.findUnique({
    where: {
      id: Number(id),
    },
    ...condition,
  });

  // 如果没有找到，就抛出异常
  if (!user) {
    throw new NotFoundError(`ID: ${id}的用户未找到。`);
  }

  return user;
}
// 更新用户信息
router.put("/info", async function (req, res) {
  try {
    const body = {
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      avatar: req.body.avatar,
    };

    const user = await prisma.users.update({
      where: {
        id: Number(req.userId),
      },
      data: body,
    });
    delete user.password;
    success(res, "更新用户信息成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});
// 更新用户登录信息
router.put("/account", async function (req, res) {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      currentPassword: req.body.currentPassword,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    };

    if (!body.currentPassword) {
      throw new BadRequestError("当前密码必须填写。");
    }

    if (body.password !== body.passwordConfirmation) {
      throw new BadRequestError("两次输入的密码不一致。");
    }

    const user = await getUser(req, true);
    const isPasswordValid = bcrypt.compareSync(
      body.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestError("当前密码不正确。");
    }

    await prisma.users.update({
      where: {
        id: Number(req.userId),
      },
      data: body,
    });
    delete user.password;
    success(res, "更新用户信息成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
