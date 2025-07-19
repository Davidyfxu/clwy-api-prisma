import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize.js";
import { delKey } from "../utils/redis.js";
import { chaptersIndex } from "../utils/meilisearch.js";
/**
 * 清除缓存
 * @param chapter
 * @returns {Promise<void>}
 */
async function clearCache(chapter) {
  await delKey(`chapters:${chapter.courseId}`);
  await delKey(`chapter:${chapter.id}`);
}
const Chapter = sequelize.define(
  "Chapters",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {},
      notEmpty: { msg: "章节标题不能为空。" },
      len: { args: [1, 100], msg: "章节标题长度必须是1 ~ 100之间。" },
    },
    content: { type: DataTypes.TEXT },
    video: { type: DataTypes.STRING },
    // 章节排序权重，必须是非负整数
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        notNull: { msg: "排序必须填写。" },
        notEmpty: { msg: "排序不能为空。" },
        isInt: { msg: "排序必须为整数。" },
        isPositive(value) {
          if (value < 0) {
            throw new Error("排序必须是非负整数。");
          }
        },
      },
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
    tableName: "Chapters",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [{ fields: ["courseId"] }],
    hooks: {
      // 创建后
      afterCreate: async (chapter) => {
        await sequelize.models.Course.increment("chaptersCount", {
          where: { id: chapter.courseId },
        });
        const course = await chapter.getCourse();
        await chaptersIndex.addDocuments([
          {
            id: chapter.id,
            title: chapter.title,
            content: chapter.content || null,
            updatedAt: chapter.updatedAt,
            course: {
              id: course.id,
              name: course.name,
              image: course.image || null,
            },
          },
        ]);
        await clearCache(chapter);
      }, // 在章节更新后
      afterUpdate: async (chapter) => {
        const course = await chapter.getCourse();
        await chaptersIndex.updateDocuments([
          {
            id: chapter.id,
            title: chapter.title,
            content: chapter.content,
            updatedAt: chapter.updatedAt,
            course: {
              id: course.id,
              name: course.name,
              image: course.image,
            },
          },
        ]);
        await clearCache(chapter);
      },
      // 在章节删除后
      afterDestroy: async (chapter) => {
        await sequelize.models.Course.decrement("chaptersCount", {
          where: { id: chapter.courseId },
        });
        await chaptersIndex.deleteDocument(chapter.id);
        await clearCache(chapter);
      },
    },
  },
);

export default Chapter;
