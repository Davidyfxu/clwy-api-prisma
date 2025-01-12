import express from "express";
import { failure, success } from "../utils/responses.js";
import svgCaptcha from "svg-captcha";
import { v4 as uuidv4 } from "uuid";
import { setKey } from "../utils/redis.js";

const router = express.Router();
/**
 * 获取验证码
 * GET /captcha
 */
router.get("/", async (req, res) => {
  try {
    const captcha = svgCaptcha.createMathExpr({
      size: 4, // 验证码长度
      ignoreChars: "0O1Il9quv", // 验证码字符中排除 0O1Il9quv
      noise: 3, // 干扰线条数量
      color: true, // 是否有颜色，
      width: 100, // 宽
      height: 40, // 高
    });
    const captchaKey = `captcha:${uuidv4()}`;
    await setKey(captchaKey, captcha.text, 60 * 10);
    //
    // res.type("svg");
    // res.status(StatusCodes.OK).send(captcha.data);
    success(res, "验证码获取成功。", {
      captchaKey,
      captchaData: captcha.data,
      captchaText: captcha.text,
    });
  } catch (error) {
    failure(res, error);
  }
});
export default router;
