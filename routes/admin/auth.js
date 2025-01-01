import express from "express";
import { failure, success } from "../../utils/responses.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errors.js";
import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post("/sign_in", async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login) {
      throw new BadRequestError("邮箱/用户名必须填写。");
    }
    if (!password) {
      throw new BadRequestError("密码必须填写。");
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });
    if (!user) {
      throw new NotFoundError("用户不存在，无法登录。");
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("密码错误。");
    }
    // 验证是否管理员
    // if (user.role !== 100) {
    //   throw new UnauthorizedError("您没有权限登录管理员后台。");
    // }
    // 生成身份验证令牌
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.SECRET,
      { expiresIn: "60d" },
    );

    success(res, "登录成功。", { token });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
