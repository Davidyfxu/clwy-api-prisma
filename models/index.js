import Article from "./Articles.js";
import Category from "./Categories.js";
import Course from "./Courses.js";
import Chapter from "./Chapters.js";
import User from "./Users.js";
import Like from "./Likes.js";
import Setting from "./Settings.js";
import Log from "./Logs.js";
import Order from "./Orders.js";

// 关联关系
Category.hasMany(Course, { foreignKey: "categoryId" });
Course.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Course, { foreignKey: "userId" });
Course.belongsTo(User, { foreignKey: "userId" });

Course.hasMany(Chapter, { foreignKey: "courseId" });
Chapter.belongsTo(Course, { foreignKey: "courseId" });

User.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(User, { foreignKey: "userId" });

Course.hasMany(Like, { foreignKey: "courseId" });
Like.belongsTo(Course, { foreignKey: "courseId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

export { Article, Category, Course, Chapter, User, Like, Setting, Log, Order };
