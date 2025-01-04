import express from "express";
import { failure, success } from "../../utils/responses.js";
import prisma from "../../lib/prisma.js";

const router = express.Router();
/**
 * 统计用户性别
 * GET /admin/charts/sex
 */
router.get("/sex", async function (req, res) {
  try {
    const male = await prisma.users.count({ where: { sex: "MALE" } });
    const female = await prisma.users.count({ where: { sex: "FEMALE" } });
    const unknown = await prisma.users.count({ where: { sex: "UNKNOWN" } });
    const data = [
      { value: male, name: "男性" },
      { value: female, name: "女性" },
      { value: unknown, name: "未选择" },
    ];

    success(res, "查询用户性别成功。", { data });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 统计每个月用户数量
 * GET /admin/charts/user
 */
router.get("/user", async (req, res) => {
  try {
    const results = await prisma.$queryRaw`
        SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS value
        FROM Users 
        GROUP BY month 
        ORDER BY month ASC
  `;
    const data = {
      months: [],
      values: [],
    };

    results.forEach((item) => {
      data.months.push(item.month);
      data.values.push(Number(item.value));
    });
    success(res, "查询每月用户数量成功。", { data });
  } catch (err) {
    failure(res, err);
  }
});

export default router;
