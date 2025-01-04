import { ReasonPhrases, StatusCodes } from "http-status-codes";

/**
 * 请求成功
 * @param res
 * @param message
 * @param data
 * @param code
 */
function success(res, message, data = {}, code = 200) {
  res.status(code).json({
    status: true,
    message,
    data,
  });
}

/**
 * 请求失败
 * @param res
 * @param error
 */
function failure(res, error) {
  // 默认响应为 500，服务器错误
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let errors = ReasonPhrases.INTERNAL_SERVER_ERROR;
  // Zod验证错误
  if (error.name === "ZodError") {
    statusCode = StatusCodes.BAD_REQUEST;
    errors = Object.values(error?.formErrors?.fieldErrors).flat();
  } else if (["JsonWebTokenError", "TokenExpiredError"].includes(error.name)) {
    // Token 验证错误
    statusCode = StatusCodes.UNAUTHORIZED;
    errors = "您提交的 token 错误或已过期。";
  } else if (error instanceof Error) {
    // http-errors 库创建的错误
    statusCode = error?.status;
    errors = error?.message;
  }
  res.status(statusCode).json({
    status: false,
    message: `请求失败: ${error.name}`,
    errors: Array.isArray(errors) ? errors : [errors],
  });
}

export { success, failure };
