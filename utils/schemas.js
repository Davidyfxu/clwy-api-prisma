import { z } from "zod";

// 定义验证 schema，用于更新课程信息
const updateCourseSchema = z.object({
  name: z.string().min(1, "课程名称不能为空"),
  categoryId: z.number().int().positive("请选择分类"), // 分类ID，必须是正整数
  image: z.string().url().nullable().optional(), // 课程封面图片，必须是有效的URL
  recommended: z.boolean().optional(), // 是否推荐课程
  introductory: z.boolean().optional(), // 是否为入门课程
  content: z.string().nullable().optional(), // 课程内容，可选
  likesCount: z.number().int().nonnegative().optional(), // 点赞数，必须是非负整数
  chaptersCount: z.number().int().nonnegative().optional(), // 章节数，必须是非负整数
});

// 定义验证 schema，用于更新文章信息
const updateArticleSchema = z.object({
  title: z.string().min(1, "文章标题不能为空"),
  content: z.string().nullable().optional(), // 文章内容，可选
});

// 定义验证 schema，用于更新分类信息
const updateCategorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空"),
  rank: z.number().int().nonnegative().optional(), // 分类排序权重，必须是非负整数
});

// 定义性别枚举，与 Prisma 模型中的 Gender 枚举一致
const GenderEnum = z.enum(["UNKNOWN", "MALE", "FEMALE"]);

// 定义角色枚举，与 Prisma 模型中的 Role 枚举一致
const RoleEnum = z.enum(["NORMAL", "ADMIN"]);

// 定义验证 schema，用于更新用户信息
const updateUserSchema = z.object({
  id: z.number().int().optional(), // 用户ID，可选
  email: z.string().email("无效的邮箱地址"), // 用户邮箱，必须是有效的邮箱
  username: z.string().min(1, "用户名不能为空"), // 用户名，不能为空
  nickname: z.string().min(1, "昵称不能为空"), // 昵称，不能为空
  password: z.string().min(6, "密码至少需要6个字符"), // 密码，至少6个字符
  avatar: z.string().url().nullable().optional(), // 用户头像，必须是有效的URL，可选
  sex: GenderEnum.default("UNKNOWN"), // 性别，默认为 UNKNOWN
  company: z.string().nullable().optional(), // 公司信息，可选
  introduce: z.string().nullable().optional(), // 个人介绍，可选
  role: RoleEnum.default("NORMAL"), // 用户角色，默认为 NORMAL
});

// 定义验证 schema，用于更新设置信息
const updateSettingSchema = z.object({
  name: z.string().min(1, "设置名称不能为空"),
  icp: z.string().nullable().optional(), // ICP备案信息，可选
});

// 定义验证 schema，用于更新章节信息
const updateChapterSchema = z.object({
  title: z.string().min(1, "章节标题不能为空"),
  content: z.string().nullable().optional(), // 章节内容，可选
  video: z.string().url().nullable().optional(), // 章节视频，必须是有效的URL，可选
  rank: z.number().int().nonnegative().optional(), // 章节排序权重，必须是非负整数
});

export {
  updateCourseSchema,
  updateArticleSchema,
  updateCategorySchema,
  updateUserSchema,
  updateSettingSchema,
  updateChapterSchema,
};
