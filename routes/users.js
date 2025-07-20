import { failure, success } from "../utils/responses.js";
import express from "express";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { delKey, getKey, setKey } from "../utils/redis.js";
import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import {
  validateUpdateUserInfo,
  validateUpdateUserAccount,
} from "../middlewares/index.js";

const router = express.Router();
// 清除缓存
async function clearCache(user) {
  await delKey(`user:${user.id}`);
}

/**
 * 查询登录用户详细数据
 * GET /me
 */
router.get("/me", async function (req, res) {
  try {
    let user = await getKey(`user:${req.userId}`);
    if (!user) {
      const user = await getUser(req);
      await setKey(`user:${req.userId}`, user);
    }
    success(res, "查询当前用户信息成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});

// 公共方法：查询当前用户
async function getUser(req, showPassword = false) {
  const id = req.userId;
  let attributes = { exclude: [] };
  if (!showPassword) {
    attributes.exclude.push("password");
  }
  // 查询当前用户
  const user = await User.findByPk(Number(id), { attributes });
  if (!user) {
    throw new NotFoundError(`ID: ${id}的用户未找到。`);
  }
  return user.toJSON();
}
// 更新用户信息
router.put("/info", validateUpdateUserInfo, async function (req, res) {
  try {
    const body = {
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      avatar: req.body.avatar,
    };
    const [count, [user]] = await User.update(body, {
      where: { id: Number(req.userId) },
      returning: true,
      individualHooks: true,
    });
    if (!user) throw new NotFoundError("用户未找到");
    delete user.password;
    await clearCache(user);
    success(res, "更新用户信息成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});
// 更新用户登录信息
router.put("/account", validateUpdateUserAccount, async function (req, res) {
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
      user.password
    );
    if (!isPasswordValid) {
      throw new BadRequestError("当前密码不正确。");
    }
    const updateData = {
      email: body.email,
      username: body.username,
      password: body.password,
    };
    const [count, [updatedUser]] = await User.update(updateData, {
      where: { id: Number(req.userId) },
      returning: true,
      individualHooks: true,
    });
    if (!updatedUser) throw new NotFoundError("用户未找到");
    delete updatedUser.password;
    await clearCache(updatedUser);
    success(res, "更新用户信息成功。", { user: updatedUser });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
