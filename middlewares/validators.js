import { body, param, query, validationResult } from "express-validator";
import { failure } from "../utils/responses.js";
import { StatusCodes } from "http-status-codes";

// 通用验证结果处理中间件
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 直接返回验证错误响应，不使用 failure 函数
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: "参数验证失败",
      errors: errors.array(),
    });
  }
  next();
};

// 用户注册验证
export const validateSignUp = [
  body("email").isEmail().withMessage("邮箱格式不正确").normalizeEmail(),
  body("username")
    .isLength({ min: 3, max: 20 })
    .withMessage("用户名长度必须在3-20个字符之间")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("用户名只能包含字母、数字和下划线"),
  body("nickname")
    .isLength({ min: 2, max: 20 })
    .withMessage("昵称长度必须在2-20个字符之间"),
  body("password")
    .isLength({ min: 6, max: 50 })
    .withMessage("密码长度必须在6-50个字符之间")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("密码必须包含至少一个大写字母、一个小写字母和一个数字"),
  body("captchaKey").notEmpty().withMessage("验证码key不能为空"),
  body("captcha").notEmpty().withMessage("验证码不能为空"),
  handleValidationErrors,
];

// 用户登录验证
export const validateSignIn = [
  body("login").notEmpty().withMessage("邮箱/用户名不能为空"),
  body("password").notEmpty().withMessage("密码不能为空"),
  handleValidationErrors,
];

// 用户信息更新验证
export const validateUpdateUserInfo = [
  body("nickname")
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage("昵称长度必须在2-20个字符之间"),
  body("sex")
    .optional()
    .isIn(["MALE", "FEMALE", "UNKNOWN"])
    .withMessage("性别只能是 MALE、FEMALE 或 UNKNOWN"),
  body("company")
    .optional()
    .isLength({ max: 100 })
    .withMessage("公司名称不能超过100个字符"),
  body("introduce")
    .optional()
    .isLength({ max: 500 })
    .withMessage("个人介绍不能超过500个字符"),
  body("avatar").optional().isURL().withMessage("头像必须是有效的URL"),
  handleValidationErrors,
];

// 用户账户信息更新验证
export const validateUpdateUserAccount = [
  body("email").isEmail().withMessage("邮箱格式不正确").normalizeEmail(),
  body("username")
    .isLength({ min: 3, max: 20 })
    .withMessage("用户名长度必须在3-20个字符之间")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("用户名只能包含字母、数字和下划线"),
  body("currentPassword").notEmpty().withMessage("当前密码不能为空"),
  body("password")
    .isLength({ min: 6, max: 50 })
    .withMessage("新密码长度必须在6-50个字符之间")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("新密码必须包含至少一个大写字母、一个小写字母和一个数字"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("两次输入的密码不一致");
    }
    return true;
  }),
  handleValidationErrors,
];

// ID参数验证
export const validateId = [
  param("id").isInt({ min: 1 }).withMessage("ID必须是正整数"),
  handleValidationErrors,
];

// 分页参数验证
export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("页码必须是正整数"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("每页数量必须在1-100之间"),
  handleValidationErrors,
];

// 搜索参数验证
export const validateSearch = [
  query("q")
    .notEmpty()
    .withMessage("搜索关键词不能为空")
    .isLength({ min: 1, max: 100 })
    .withMessage("搜索关键词长度必须在1-100个字符之间"),
  handleValidationErrors,
];

// 课程相关验证
export const validateCreateCourse = [
  body("title")
    .isLength({ min: 1, max: 100 })
    .withMessage("课程标题长度必须在1-100个字符之间"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("课程描述不能超过1000个字符"),
  body("categoryId").isInt({ min: 1 }).withMessage("分类ID必须是正整数"),
  body("price").optional().isFloat({ min: 0 }).withMessage("价格必须是非负数"),
  body("status")
    .optional()
    .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .withMessage("状态只能是 DRAFT、PUBLISHED 或 ARCHIVED"),
  handleValidationErrors,
];

// 文章相关验证
export const validateCreateArticle = [
  body("title")
    .isLength({ min: 1, max: 200 })
    .withMessage("文章标题长度必须在1-200个字符之间"),
  body("content").isLength({ min: 1 }).withMessage("文章内容不能为空"),
  body("categoryId").isInt({ min: 1 }).withMessage("分类ID必须是正整数"),
  body("status")
    .optional()
    .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .withMessage("状态只能是 DRAFT、PUBLISHED 或 ARCHIVED"),
  handleValidationErrors,
];

// 章节相关验证
export const validateCreateChapter = [
  body("title")
    .isLength({ min: 1, max: 100 })
    .withMessage("章节标题长度必须在1-100个字符之间"),
  body("content")
    .optional()
    .isLength({ max: 10000 })
    .withMessage("章节内容不能超过10000个字符"),
  body("courseId").isInt({ min: 1 }).withMessage("课程ID必须是正整数"),
  body("order").optional().isInt({ min: 1 }).withMessage("排序必须是正整数"),
  handleValidationErrors,
];

// 分类相关验证
export const validateCreateCategory = [
  body("name")
    .isLength({ min: 1, max: 50 })
    .withMessage("分类名称长度必须在1-50个字符之间"),
  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("分类描述不能超过200个字符"),
  body("parentId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("父分类ID必须是正整数"),
  handleValidationErrors,
];

// 点赞相关验证
export const validateCreateLike = [
  body("targetType")
    .isIn(["ARTICLE", "COURSE", "CHAPTER"])
    .withMessage("目标类型只能是 ARTICLE、COURSE 或 CHAPTER"),
  body("targetId").isInt({ min: 1 }).withMessage("目标ID必须是正整数"),
  handleValidationErrors,
];

// 设置相关验证
export const validateUpdateSetting = [
  body("key")
    .isLength({ min: 1, max: 50 })
    .withMessage("设置键长度必须在1-50个字符之间"),
  body("value").notEmpty().withMessage("设置值不能为空"),
  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("设置描述不能超过200个字符"),
  handleValidationErrors,
];

// 管理员用户创建验证
export const validateCreateUser = [
  body("email").isEmail().withMessage("邮箱格式不正确").normalizeEmail(),
  body("username")
    .isLength({ min: 3, max: 20 })
    .withMessage("用户名长度必须在3-20个字符之间")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("用户名只能包含字母、数字和下划线"),
  body("nickname")
    .isLength({ min: 2, max: 20 })
    .withMessage("昵称长度必须在2-20个字符之间"),
  body("password")
    .isLength({ min: 6, max: 50 })
    .withMessage("密码长度必须在6-50个字符之间"),
  body("role")
    .optional()
    .isIn(["NORMAL", "ADMIN"])
    .withMessage("角色只能是 NORMAL 或 ADMIN"),
  body("sex")
    .optional()
    .isIn(["MALE", "FEMALE", "UNKNOWN"])
    .withMessage("性别只能是 MALE、FEMALE 或 UNKNOWN"),
  handleValidationErrors,
];

// 通用更新验证（部分字段可选）
export const validatePartialUpdate = (requiredFields = []) => {
  const validators = [];

  // 添加通用字段验证
  validators.push(
    body("title")
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage("标题长度必须在1-200个字符之间"),
    body("description")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("描述不能超过1000个字符"),
    body("status")
      .optional()
      .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
      .withMessage("状态只能是 DRAFT、PUBLISHED 或 ARCHIVED"),
  );

  // 添加必需字段验证
  requiredFields.forEach((field) => {
    validators.push(body(field).notEmpty().withMessage(`${field}不能为空`));
  });

  validators.push(handleValidationErrors);
  return validators;
};
