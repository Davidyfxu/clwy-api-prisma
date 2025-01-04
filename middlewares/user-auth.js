import jwt from "jsonwebtoken";
import { failure } from "../utils/responses.js";
import { UnauthorizedError } from "../utils/errors.js";

const middleware = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("当前接口需要认证才能访问。");
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const { userId } = decoded;
    req.userId = userId;
    next();
  } catch (error) {
    failure(res, error);
  }
};

export default middleware;
