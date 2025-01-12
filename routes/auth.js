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
import { delKey } from "../utils/redis.js";
import { validateCaptcha } from "../middlewares/index.js";
import { mailProducer } from "../utils/rabbit-mq.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

// 用户注册需要验证码
router.post("/sign_up", validateCaptcha, async function (req, res) {
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
    // 请求成功，删除验证码，防止重复使用
    await delKey(req.body.captchaKey);

    // 将邮件发送请求放入队列
    const msg = {
      to: user.email,
      subject: "「长乐未央」的注册成功通知",
      html: `
          您好，<span style="color: red">${user.nickname}。</span><br/><br/>
          恭喜，您已成功注册会员！<br/><br/>
          请访问<a href="https://clwy.cn">「长乐未央」</a>官网，了解更多。<br/><br/>
          ━━━━━━━━━━━━━━━━<br/>
          长乐未央
          `,
    };
    await mailProducer(msg);
    success(res, "创建用户成功。", { user }, StatusCodes.CREATED);
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
    const token = jwt.sign({ userId: user?.id }, process.env.SECRET, {
      expiresIn: "30d",
    });
    success(res, "登录成功", { token });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
