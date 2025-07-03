import express from "express";
import { failure, success } from "../../utils/responses.js";
import { User } from "../../models/index.js";
import { QueryTypes } from "sequelize";

const router = express.Router();
/**
 * 统计用户性别
 * GET /admin/charts/sex
 */
router.get("/sex", async function (req, res) {
  try {
    const male = await User.count({ where: { sex: "MALE" } });
    const female = await User.count({ where: { sex: "FEMALE" } });
    const unknown = await User.count({ where: { sex: "UNKNOWN" } });
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
    const results = await sequelize.query(
      "SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS value FROM Users GROUP BY month ORDER BY month ASC",
      { type: QueryTypes.SELECT },
    );
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
