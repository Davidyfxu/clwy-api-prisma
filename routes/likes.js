import { failure, success } from "../utils/responses.js";
import express from "express";
import prisma from "../lib/prisma.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

/**
 * 点赞
 * POST /
 */
router.post("/", async function (req, res) {
  try {
    const userId = req.userId;
    const { courseId } = req.body;
    const course = await prisma.courses.findUnique({
      where: {
        id: Number(courseId),
      },
    });
    if (!course) {
      throw new NotFoundError("课程不存在。");
    }
    // 检查课程之前是否已经点赞
    const like = await prisma.likes.findFirst({
      where: {
        courseId: Number(courseId),
        userId: userId,
      },
    });
    // 无点赞，则新增关联记录
    if (!like) {
      await prisma.likes.create({
        data: {
          courseId: Number(courseId),
          userId: userId,
        },
      });
      await prisma.courses.update({
        where: {
          id: Number(courseId),
        },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });
      success(res, "点赞成功");
    } else {
      // 如果点赞过了，那就删除。并且课程的 likesCount - 1
      await prisma.likes.delete({
        where: {
          id: like.id,
        },
      });
      await prisma.courses.update({
        where: {
          id: Number(courseId),
        },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });
      success(res, "取消成功");
    }
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询用户点赞的课程
 * GET /likes
 */
router.get("/", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const courses = await prisma.likes.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            image: true,
            recommended: true,
            introductory: true,
            likesCount: true,
            chaptersCount: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      take: pageSize,
      skip: offset,
    });
    // 查询当前用户点赞过的课程总数
    const count = await prisma.likes.count({
      where: {
        userId: req.userId,
      },
    });
    // 格式化返回的课程数据
    const formattedCourses = courses.map((like) => like.course);

    success(res, "查询用户点赞的课程成功。", {
      courses: formattedCourses,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
