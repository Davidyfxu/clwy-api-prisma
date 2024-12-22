import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// 创建用户前加密密码
prisma.$use(async (params, next) => {
  if (params.model === "Users" && params.action === "create") {
    const user = params.args.data;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    params.args.data = user;
  }
  return next(params);
});

// 更新密码时加密
prisma.$use(async (params, next) => {
  if (params.model === "Users" && params.action === "update") {
    const user = params.args.data;
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      params.args.data = user;
    }
  }
  return next(params);
});
export default prisma;
