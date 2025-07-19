import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";
import { delKey, getKeysByPattern } from "../utils/redis.js";
import { coursesIndex } from "../utils/meilisearch.js";

/**
 * 清除缓存
 * @param course
 * @returns {Promise<void>}
 */
async function clearCache(course = null) {
  let keys = await getKeysByPattern("courses:*");
  if (keys.length !== 0) {
    await delKey(keys);
  }

  if (course) {
    await delKey(`course:${course.id}`);
  }
}

const Course = sequelize.define(
  "Courses",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING },
    recommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    introductory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    content: { type: DataTypes.TEXT },
    likesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    chaptersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Courses",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [
      { fields: ["categoryId"] },
      { fields: ["userId"] },
      { fields: ["recommended"] },
      { fields: ["introductory"] },
    ],
    hooks: {
      // 创建后
      afterCreate: async (course, options) => {
        await coursesIndex.addDocuments([
          {
            id: course.id,
            name: course.name,
            image: course.image || null,
            content: course.content || null,
            likesCount: course.likesCount || 0,
            updatedAt: course.updatedAt,
          },
        ]);
        await clearCache();
      },
      // 更新后
      afterUpdate: async (course, options) => {
        await coursesIndex.updateDocuments([
          {
            id: course.id,
            name: course.name,
            image: course.image,
            content: course.content,
            likesCount: course.likesCount,
            updatedAt: course.updatedAt,
          },
        ]);
        await clearCache(course);
      },
      // 在课程删除后
      afterDestroy: async (course) => {
        await coursesIndex.deleteDocument(course.id);
        await clearCache(course);
      },
    },
  },
);

export default Course;
