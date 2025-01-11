import { failure, success } from "../utils/responses.js";
import express from "express";
import prisma from "../lib/prisma.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/sign_up", async function (req, res) {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      nickname: req.body.nickname,
      password: req.body.password,
      sex: "UNKNOWN",
      role: "NORMAL",
    };
    const user = await prisma.users.create({
      data: body,
    });
    delete user.password;
    success(res, "创建用户成功。", { user }, 201);
  } catch (error) {
    failure(res, error);
  }
});

router.post("/sign_in", async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login) {
      throw new BadRequestError("邮箱/用户名必须填写。");
    }

    if (!password) {
      throw new BadRequestError("密码必须填写。");
    }
    console.log("===hello===");
    const user = await prisma.users.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });
    console.log("===hello===222222", user);
    if (!user) {
      throw new NotFoundError("用户不存在，无法登录。");
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("密码错误。");
    }
    const token = jwt.sign({ userId: user?.id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    success(res, "登录成功", { token });
  } catch (error) {
    console.log("===hello===failure", error?.name);
    failure(res, error);
  }
});

export default router;
