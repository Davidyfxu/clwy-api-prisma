import { failure } from "../utils/responses.js";
import { BadRequestError } from "../utils/errors.js";
import { getKey } from "../utils/redis.js";

const middleware = async (req, res, next) => {
  try {
    const { captchaKey, captchaText } = req.body;
    // 判断验证码为空
    if (!captchaText) {
      throw new BadRequestError("验证码不能为空");
    }
    // 从 Redis 获取验证码的值
    const captcha = await getKey(captchaKey);
    if (!captcha) {
      throw new BadRequestError("验证码已过期");
    }
    // 比对验证码，忽略大小写
    if (captcha.toLowerCase() !== captchaText.toLowerCase()) {
      throw new BadRequestError("验证码不正确。");
    }
    next();
  } catch (error) {
    failure(res, error);
  }
};

export default middleware;
