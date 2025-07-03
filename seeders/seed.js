import sequelize from "../lib/sequelize.js";
import User from "../models/Users.js";
import Category from "../models/Categories.js";
import Course from "../models/Courses.js";
import Chapter from "../models/Chapters.js";
import Article from "../models/Articles.js";
import Order from "../models/Orders.js";
import Like from "../models/Likes.js";
import Setting from "../models/Settings.js";
import Log from "../models/Logs.js";

const seedData = async () => {
  try {
    console.log("Starting database seeding...");

    // Clear existing data
    await sequelize.sync({ force: true });

    // Seed Settings
    const settings = await Setting.create({
      name: "CLWY Learning Platform",
      icp: "ICP备案号12345678",
    });

    // Seed Categories（原有5个，10倍=50个）
    const baseCategories = [
      { name: "前端开发", rank: 1 },
      { name: "后端开发", rank: 2 },
      { name: "移动开发", rank: 3 },
      { name: "数据科学", rank: 4 },
      { name: "人工智能", rank: 5 },
    ];
    const categoriesData = [];
    for (let i = 0; i < 10; i++) {
      baseCategories.forEach((cat, idx) => {
        categoriesData.push({
          name: `${cat.name}${i > 0 ? `_${i}` : ""}`,
          rank: i * 5 + idx + 1,
        });
      });
    }
    const categories = await Category.bulkCreate(categoriesData);

    // Seed Users（原有5个，10倍=50个）
    const baseUsers = [
      {
        email: "admin@example.com",
        username: "admin",
        nickname: "管理员",
        password: "$2b$10$hash1",
        avatar: "https://example.com/avatar1.jpg",
        sex: "MALE",
        company: "CLWY Tech",
        introduce: "平台管理员",
        role: "ADMIN",
      },
      {
        email: "teacher1@example.com",
        username: "teacher1",
        nickname: "张老师",
        password: "$2b$10$hash2",
        avatar: "https://example.com/avatar2.jpg",
        sex: "FEMALE",
        company: "教育科技公司",
        introduce: "前端开发专家，5年教学经验",
        role: "NORMAL",
      },
      {
        email: "teacher2@example.com",
        username: "teacher2",
        nickname: "李老师",
        password: "$2b$10$hash3",
        avatar: "https://example.com/avatar3.jpg",
        sex: "MALE",
        company: "互联网公司",
        introduce: "后端架构师，专注于Node.js开发",
        role: "NORMAL",
      },
      {
        email: "student1@example.com",
        username: "student1",
        nickname: "小明",
        password: "$2b$10$hash4",
        avatar: "https://example.com/avatar4.jpg",
        sex: "MALE",
        company: "某大学",
        introduce: "计算机科学专业学生",
        role: "NORMAL",
      },
      {
        email: "student2@example.com",
        username: "student2",
        nickname: "小红",
        password: "$2b$10$hash5",
        avatar: "https://example.com/avatar5.jpg",
        sex: "FEMALE",
        company: "某培训机构",
        introduce: "转行学习编程",
        role: "NORMAL",
      },
    ];
    const usersData = [];
    for (let i = 0; i < 10; i++) {
      baseUsers.forEach((user, idx) => {
        usersData.push({
          email: i === 0 ? user.email : user.email.replace("@", `_${i}@`),
          username: i === 0 ? user.username : `${user.username}${i}`,
          nickname: i === 0 ? user.nickname : `${user.nickname}${i}`,
          password: `$2b$10$hash${i * 5 + idx + 1}`,
          avatar: `https://example.com/avatar${i * 5 + idx + 1}.jpg`,
          sex: user.sex,
          company: user.company,
          introduce: i === 0 ? user.introduce : `${user.introduce}（mock${i}）`,
          role: user.role,
        });
      });
    }
    const users = await User.bulkCreate(usersData);

    // Seed Courses（原有5个，10倍=50个）
    const baseCourses = [
      {
        name: "Vue.js 从入门到精通",
        image: "https://example.com/course1.jpg",
        recommended: true,
        introductory: true,
        content: "全面学习Vue.js框架，从基础语法到高级应用，包含实战项目",
        likesCount: 128,
        chaptersCount: 0,
      },
      {
        name: "React 实战开发",
        image: "https://example.com/course2.jpg",
        recommended: true,
        introductory: false,
        content: "深入学习React生态系统，包括Redux、React Router等",
        likesCount: 96,
        chaptersCount: 0,
      },
      {
        name: "Node.js 后端开发",
        image: "https://example.com/course3.jpg",
        recommended: false,
        introductory: true,
        content: "使用Node.js构建RESTful API和微服务架构",
        likesCount: 75,
        chaptersCount: 0,
      },
      {
        name: "数据库设计与优化",
        image: "https://example.com/course4.jpg",
        recommended: true,
        introductory: false,
        content: "MySQL和MongoDB的设计原理和性能优化技巧",
        likesCount: 112,
        chaptersCount: 0,
      },
      {
        name: "Python 数据分析入门",
        image: "https://example.com/course5.jpg",
        recommended: false,
        introductory: true,
        content: "使用Python进行数据分析，包括Pandas、NumPy等库的使用",
        likesCount: 68,
        chaptersCount: 0,
      },
    ];
    const coursesData = [];
    for (let i = 0; i < 10; i++) {
      baseCourses.forEach((course, idx) => {
        coursesData.push({
          categoryId: categories[(i * 5 + idx) % categories.length].id,
          userId: users[(i * 5 + idx + 1) % users.length].id,
          name: i === 0 ? course.name : `${course.name}（mock${i}）`,
          image: `https://example.com/course${i * 5 + idx + 1}.jpg`,
          recommended: i % 2 === 0 ? course.recommended : !course.recommended,
          introductory:
            i % 2 === 0 ? course.introductory : !course.introductory,
          content: i === 0 ? course.content : `${course.content}（mock${i}）`,
          likesCount: Math.floor(Math.random() * 200),
          chaptersCount: 0,
        });
      });
    }
    const courses = await Course.bulkCreate(coursesData);

    // Seed Chapters（原有8个，10倍=80个）
    const baseChapters = [
      // Vue.js 课程章节
      {
        title: "Vue.js 基础介绍",
        content: "Vue.js框架概述，MVVM模式讲解",
        video: "https://example.com/video1.mp4",
        rank: 1,
      },
      {
        title: "Vue.js 模板语法",
        content: "数据绑定、指令使用、事件处理",
        video: "https://example.com/video2.mp4",
        rank: 2,
      },
      {
        title: "组件开发",
        content: "组件的创建、通信、生命周期",
        video: "https://example.com/video3.mp4",
        rank: 3,
      },
      // React 课程章节
      {
        title: "React 核心概念",
        content: "JSX、组件、Props和State",
        video: "https://example.com/video4.mp4",
        rank: 1,
      },
      {
        title: "React Hooks",
        content: "useState、useEffect等Hooks的使用",
        video: "https://example.com/video5.mp4",
        rank: 2,
      },
      // Node.js 课程章节
      {
        title: "Node.js 环境搭建",
        content: "Node.js安装、npm使用、项目初始化",
        video: "https://example.com/video6.mp4",
        rank: 1,
      },
      {
        title: "Express 框架",
        content: "使用Express构建Web服务器",
        video: "https://example.com/video7.mp4",
        rank: 2,
      },
      {
        title: "数据库集成",
        content: "连接MySQL和MongoDB数据库",
        video: "https://example.com/video8.mp4",
        rank: 3,
      },
    ];
    const chaptersData = [];
    for (let i = 0; i < 10; i++) {
      baseChapters.forEach((chapter, idx) => {
        chaptersData.push({
          courseId: courses[(i * 8 + idx) % courses.length].id,
          title: i === 0 ? chapter.title : `${chapter.title}（mock${i}）`,
          content: i === 0 ? chapter.content : `${chapter.content}（mock${i}）`,
          video: `https://example.com/video${i * 8 + idx + 1}.mp4`,
          rank: chapter.rank + i * 10,
        });
      });
    }
    const chapters = await Chapter.bulkCreate(chaptersData);

    // Update courses chapters count
    // 这里简单分配每个课程有1-5个章节
    for (let i = 0; i < courses.length; i++) {
      const count = Math.floor(Math.random() * 5) + 1;
      await courses[i].update({ chaptersCount: count });
    }

    // Seed Articles（原有5个，10倍=50个）
    const baseArticles = [
      {
        title: "前端开发趋势分析",
        content: "分析当前前端开发的技术趋势和未来发展方向...",
      },
      {
        title: "微服务架构最佳实践",
        content: "介绍微服务架构的设计原则和实施策略...",
      },
      {
        title: "机器学习入门指南",
        content: "为初学者介绍机器学习的基本概念和学习路径...",
      },
      {
        title: "JavaScript 性能优化技巧",
        content: "分享JavaScript代码优化的实用技巧和方法...",
      },
      {
        title: "数据库索引设计原理",
        content: "深入讲解数据库索引的工作原理和设计策略...",
      },
    ];
    const articlesData = [];
    for (let i = 0; i < 10; i++) {
      baseArticles.forEach((article, idx) => {
        articlesData.push({
          title: i === 0 ? article.title : `${article.title}（mock${i}）`,
          content: i === 0 ? article.content : `${article.content}（mock${i}）`,
        });
      });
    }
    const articles = await Article.bulkCreate(articlesData);

    // Seed Likes（原有7个，10倍=70个）
    const likesData = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 7; j++) {
        likesData.push({
          userId: users[(i * 7 + j) % users.length].id,
          courseId: courses[(i * 7 + j) % courses.length].id,
        });
      }
    }
    const likes = await Like.bulkCreate(likesData);

    // Seed Orders（原有4个，10倍=40个）
    const baseOrders = [
      {
        subject: "Vue.js 从入门到精通",
        totalAmount: 299.0,
        paymentMethod: "ALIPAY",
        paymentStatus: "PAID",
      },
      {
        subject: "React 实战开发",
        totalAmount: 399.0,
        paymentMethod: "WECHATPAY",
        paymentStatus: "PAID",
      },
      {
        subject: "Node.js 后端开发",
        totalAmount: 349.0,
        paymentMethod: "ALIPAY",
        paymentStatus: "UNPAID",
      },
      {
        subject: "Python 数据分析入门",
        totalAmount: 259.0,
        paymentMethod: "WECHATPAY",
        paymentStatus: "CANCEL",
      },
    ];
    const ordersData = [];
    for (let i = 0; i < 10; i++) {
      baseOrders.forEach((order, idx) => {
        ordersData.push({
          outTradeNo: `ORDER_2024070${i}_${idx}`,
          tradeNo: `${order.paymentMethod}_${20240700 + i}_${idx}`,
          userId: users[(i * 4 + idx) % users.length].id,
          subject: i === 0 ? order.subject : `${order.subject}（mock${i}）`,
          totalAmount: order.totalAmount + i * 10,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
        });
      });
    }
    const orders = await Order.bulkCreate(ordersData);

    // Seed Logs（原有5个，10倍=50个）
    const baseLogs = [
      {
        level: "info",
        message: "User login successful",
        meta: (i) =>
          JSON.stringify({
            userId: users[i % users.length].id,
            ip: `192.168.1.${100 + i}`,
          }),
      },
      {
        level: "error",
        message: "Payment processing failed",
        meta: (i) =>
          JSON.stringify({
            orderId: orders[i % orders.length].id,
            error: "Network timeout",
          }),
      },
      {
        level: "info",
        message: "Course enrollment completed",
        meta: (i) =>
          JSON.stringify({
            userId: users[i % users.length].id,
            courseId: courses[i % courses.length].id,
          }),
      },
      {
        level: "warning",
        message: "High server load detected",
        meta: (i) =>
          JSON.stringify({
            cpu: `${80 + (i % 10)}%`,
            memory: `${70 + (i % 10)}%`,
          }),
      },
      {
        level: "info",
        message: "Database backup completed",
        meta: (i) =>
          JSON.stringify({
            backupSize: `${2 + i * 0.1}GB`,
            duration: `${40 + i}min`,
          }),
      },
    ];
    const logsData = [];
    for (let i = 0; i < 10; i++) {
      baseLogs.forEach((log, idx) => {
        logsData.push({
          level: log.level,
          message: i === 0 ? log.message : `${log.message}（mock${i}）`,
          meta: log.meta(i * 5 + idx),
          timestamp: new Date(Date.now() - (i * 5 + idx) * 1000 * 60),
        });
      });
    }
    const logs = await Log.bulkCreate(logsData);

    console.log("Database seeding completed successfully!");
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${users.length} users`);
    console.log(`Created ${courses.length} courses`);
    console.log(`Created ${chapters.length} chapters`);
    console.log(`Created ${articles.length} articles`);
    console.log(`Created ${likes.length} likes`);
    console.log(`Created ${orders.length} orders`);
    console.log(`Created ${logs.length} logs`);
    console.log(`Created ${settings ? 1 : 0} settings`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run seeding if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedData()
    .then(() => {
      console.log("Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding process failed:", error);
      process.exit(1);
    });
}

export default seedData;
