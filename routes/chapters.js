import { failure, success } from "../utils/responses.js";
import express from "express";
import { NotFoundError } from "../utils/errors.js";
import { Chapter, Course, User } from "../models/index.js";

const router = express.Router();

/**
 * 查询章节详情
 * GET /:id
 */
router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findByPk(Number(id), {
      attributes: { exclude: ["courseId"] },
      include: [
        {
          model: Course,
          attributes: ["id", "name"],
          include: [
            {
              model: User,
              attributes: ["id", "username", "nickname", "avatar", "company"],
            },
          ],
        },
      ],
    });
    if (!chapter) {
      throw new NotFoundError(`ID: ${id}的章节未找到。`);
    }
    const chapters = await Chapter.findAll({
      attributes: { exclude: ["content", "courseId"] },
      where: { courseId: chapter.courseId },
      order: [
        ["rank", "ASC"],
        ["id", "DESC"],
      ],
    });
    success(res, "查询章节详情成功。", { chapter, chapters });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
