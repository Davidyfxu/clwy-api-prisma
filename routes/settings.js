import { failure, success } from "../utils/responses.js";
import express from "express";
import { Setting } from "../models/index.js";

const router = express.Router();

/**
 * 查询系统数据
 * GET /
 */
router.get("/", async function (req, res) {
  try {
    const setting = await Setting.findOne();
    success(res, "获取系统数据成功。", { setting });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
