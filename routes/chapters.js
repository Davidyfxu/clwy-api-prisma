import { failure, success } from "../utils/responses.js";
import express from "express";
import prisma from "../lib/prisma.js";
import { NotFoundError } from "../utils/errors.js";

const router = express.Router();

/**
 * 查询章节详情
 * GET /:id
 */
router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const chapter = await prisma.chapters.findUnique({
      omit: {
        courseId: true,
      },
      where: {
        id: Number(id),
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
                company: true,
              },
            },
          },
        },
      },
    });
    if (!chapter) {
      throw new NotFoundError(`ID: ${id}的章节未找到。`);
    }
    const chapters = await prisma.chapters.findMany({
      omit: {
        content: true,
        courseId: true,
      },
      where: {
        courseId: chapter.courseId,
      },
      orderBy: [{ rank: "asc" }, { id: "desc" }],
    });
    success(res, "查询章节详情成功。", { chapter, chapters });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
