import { failure, success } from "../utils/responses.js";
import express from "express";
import { NotFoundError } from "../utils/errors.js";
import { Like, Course } from "../models/index.js";

const router = express.Router();

/**
 * 点赞
 * POST /
 */
router.post("/", async function (req, res) {
  try {
    const userId = req.userId;
    const { courseId } = req.body;
    const course = await Course.findByPk(Number(courseId));
    if (!course) {
      throw new NotFoundError("课程不存在。");
    }
    // 检查课程之前是否已经点赞
    const like = await Like.findOne({
      where: {
        courseId: Number(courseId),
        userId: userId,
      },
    });
    if (!like) {
      await Like.create({
        courseId: Number(courseId),
        userId: userId,
      });
      await Course.increment("likesCount", {
        by: 1,
        where: { id: Number(courseId) },
      });
      success(res, "点赞成功");
    } else {
      await Like.destroy({ where: { id: like.id } });
      await Course.decrement("likesCount", {
        by: 1,
        where: { id: Number(courseId) },
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
    const likes = await Like.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Course,
          attributes: [
            "id",
            "name",
            "image",
            "recommended",
            "introductory",
            "likesCount",
            "chaptersCount",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
    });
    const count = await Like.count({ where: { userId: req.userId } });
    const formattedCourses = likes.map((like) => like.course);
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
