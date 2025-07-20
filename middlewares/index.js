import adminAuth from "./admin-auth.js";
import userAuth from "./user-auth.js";
import validateCaptcha from "./validate-captcha.js";

// 导入验证器
import {
  validateSignUp,
  validateSignIn,
  validateUpdateUserInfo,
  validateUpdateUserAccount,
  validateId,
  validatePagination,
  validateSearch,
  validateCreateCourse,
  validateCreateArticle,
  validateCreateChapter,
  validateCreateCategory,
  validateCreateLike,
  validateUpdateSetting,
  validateCreateUser,
  validatePartialUpdate,
  handleValidationErrors
} from "./validators.js";

export { 
  adminAuth, 
  userAuth, 
  validateCaptcha,
  validateSignUp,
  validateSignIn,
  validateUpdateUserInfo,
  validateUpdateUserAccount,
  validateId,
  validatePagination,
  validateSearch,
  validateCreateCourse,
  validateCreateArticle,
  validateCreateChapter,
  validateCreateCategory,
  validateCreateLike,
  validateUpdateSetting,
  validateCreateUser,
  validatePartialUpdate,
  handleValidationErrors
};
