import { failure, success } from "../utils/responses.js";
import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

/**
 * 查询首页数据
 * GET /
 */
router.get("/", async function (req, res) {
  try {
    const recommendedCourses = await prisma.courses.findMany({
      where: {
        recommended: true,
      },
      orderBy: {
        id: "desc",
      },
      take: 10,
      select: {
        ...Object.fromEntries(
          Object.entries(prisma.courses.fields)
            .filter(
              ([key]) => !["categoryId", "userId", "content"].includes(key),
            )
            .map(([key]) => [key, true]),
        ),
        categoryId: false,
        userId: false,
        content: false,
        category: {
          // 选择关联的 Categories 表的字段
          select: {
            id: true, // 选择 Categories 表的 id
            name: true, // 选择 Categories 表的 name
          },
        },
        user: {
          // 选择关联的 Categories 表的字段
          select: {
            id: true, // 选择 Categories 表的 id
            username: true, // 选择 Categories 表的 name
            nickname: true,
            avatar: true,
            company: true,
          },
        },
      },
    });
    const likesCourses = await prisma.courses.findMany({
      take: 10,
      orderBy: [{ likesCount: "desc" }, { id: "desc" }],
      omit: {
        categoryId: true,
        userId: true,
        content: true,
      },
    });
    const introductoryCourses = await prisma.courses.findMany({
      take: 10,
      orderBy: {
        id: "desc",
      },
      omit: {
        categoryId: true,
        userId: true,
        content: true,
      },
      where: {
        introductory: true,
      },
    });
    success(res, "获取首页数据成功。", {
      recommendedCourses,
      likesCourses,
      introductoryCourses,
    });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
