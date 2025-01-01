import jwt from "jsonwebtoken";
import { failure } from "../utils/responses.js";
import { UnauthorizedError } from "../utils/errors.js";
import prisma from "../lib/prisma.js";

const middleware = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("当前接口需要认证才能访问。");
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const { userId } = decoded;
    const user = await prisma.users.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (!user) {
      throw new UnauthorizedError("用户不存在，无法访问。");
    }
    if (user.role !== "ADMIN") {
      throw new UnauthorizedError("您没有权限访问管理员后台。");
    }
    req.user = user;
    next();
  } catch (error) {
    failure(res, error);
  }
};

export default middleware;
