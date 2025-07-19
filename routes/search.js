import { failure, success } from "../utils/responses.js";
import express from "express";
import { Article, Course, User } from "../models/index.js";
import { chaptersIndex, coursesIndex } from "../utils/meilisearch.js";
import { BadRequestError } from "../utils/errors.js";
import { Op } from "sequelize";

const router = express.Router();

/**
 * 查询搜索数据
 * GET /search
 */
router.get("/", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;
    const { q, type } = query;
    const option = {
      attributesToHighlight: ["*"],
      offset: offset,
      limit: pageSize,
    };
    // 搜索类型
    let results = [];
    switch (type) {
      case "courses":
        results = await coursesIndex.search(q, option);
        break;
      case "chapters":
        results = await chaptersIndex.search(q, option);
        break;
      default:
        throw new BadRequestError("无效的搜索类型。");
    }
    // 搜索到的结果
    const data = {};
    data[type] = results.hits;
    success(res, "获取搜索数据成功。", {
      ...data,
      pagination: {
        total: results.estimatedTotalHits,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
