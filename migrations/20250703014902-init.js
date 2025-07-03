"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 创建 Users 表
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      sex: {
        type: Sequelize.ENUM("MALE", "FEMALE", "UNKNOWN"),
        allowNull: false,
        defaultValue: "UNKNOWN",
      },
      company: {
        type: Sequelize.STRING,
      },
      introduce: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM("NORMAL", "ADMIN"),
        allowNull: false,
        defaultValue: "NORMAL",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 创建 Categories 表
    await queryInterface.createTable("Categories", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 创建 Courses 表
    await queryInterface.createTable("Courses", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      recommended: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      introductory: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      content: {
        type: Sequelize.TEXT,
      },
      likesCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      chaptersCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 创建 Chapters 表
    await queryInterface.createTable("Chapters", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
      },
      video: {
        type: Sequelize.STRING,
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 创建 Articles 表
    await queryInterface.createTable("Articles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    // 创建 Likes 表
    await queryInterface.createTable("Likes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 创建 Settings 表
    await queryInterface.createTable("Settings", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      icp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 创建 Logs 表
    await queryInterface.createTable("Logs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      meta: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 创建 Orders 表
    await queryInterface.createTable("Orders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      outTradeNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tradeNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.ENUM("ALIPAY", "WECHATPAY"),
        allowNull: false,
      },
      paymentStatus: {
        type: Sequelize.ENUM("UNPAID", "PAID", "CANCEL"),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 添加索引
    await queryInterface.addIndex("Users", ["email"]);
    await queryInterface.addIndex("Users", ["username"]);
    await queryInterface.addIndex("Users", ["role"]);

    await queryInterface.addIndex("Courses", ["categoryId"]);
    await queryInterface.addIndex("Courses", ["userId"]);
    await queryInterface.addIndex("Courses", ["recommended"]);
    await queryInterface.addIndex("Courses", ["introductory"]);

    await queryInterface.addIndex("Chapters", ["courseId"]);

    await queryInterface.addIndex("Likes", ["userId"]);
    await queryInterface.addIndex("Likes", ["courseId"]);
  },

  async down(queryInterface, Sequelize) {
    // 删除表（按照依赖关系的相反顺序）
    await queryInterface.dropTable("Orders");
    await queryInterface.dropTable("Logs");
    await queryInterface.dropTable("Settings");
    await queryInterface.dropTable("Likes");
    await queryInterface.dropTable("Articles");
    await queryInterface.dropTable("Chapters");
    await queryInterface.dropTable("Courses");
    await queryInterface.dropTable("Categories");
    await queryInterface.dropTable("Users");
  },
};
