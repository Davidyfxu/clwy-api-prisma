import { failure, success } from "../utils/responses.js";
import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

/**
 * 查询分类数据
 * GET /
 */
router.get("/", async function (req, res) {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: [{ rank: "asc" }, { id: "desc" }],
    });

    success(res, "查询分类数据成功。", { categories });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
