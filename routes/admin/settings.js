import express from "express";
import prisma from "../../lib/prisma.js";
import { failure, success } from "../../utils/responses.js";
import { updateSettingSchema } from "../../utils/schemas.js";
import { NotFoundError } from "../../utils/errors.js";

const router = express.Router();

// 公共方法：查询当前系统设置
async function getSetting() {
  // 查询当前系统设置
  const setting = await prisma.settings.findFirst();

  // 如果没有找到，就抛出异常
  if (!setting) {
    throw new NotFoundError(`系统设置未找到。`);
  }
  return setting;
}
// 白名单过滤
function filterBody(req) {
  return {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright,
  };
}

// 查询系统设置列表
router.get("/", async (req, res) => {
  try {
    const setting = await getSetting();
    success(res, "查询系统设置成功。", { setting });
  } catch (error) {
    failure(res, error);
  }
});
// 更新系统设置
router.put("/", async (req, res) => {
  try {
    const setting = await getSetting();
    const body = filterBody(req);

    const validationResult = updateSettingSchema.safeParse(body);
    if (!validationResult.success) {
      return failure(res, validationResult.error);
    }

    const updatedSetting = await prisma.settings.update({
      where: {
        id: setting?.id,
      },
      data: body,
    });
    success(res, "更新系统设置成功。", { setting: updatedSetting });
  } catch (error) {
    failure(res, error);
  }
});

export default router;
