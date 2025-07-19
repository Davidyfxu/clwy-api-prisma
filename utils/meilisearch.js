import { Meilisearch } from "meilisearch";
// 初始化
const searchClient = new Meilisearch({
  host: "http://127.0.0.1:7700",
  apiKey: "rdf6Qvn7daArhhstDX2UunlUjAr5ii-RBiH5JrgAhQA",
});
// 创建课程索引
const coursesIndex = searchClient.index("courses");
(async () => {
  try {
    // 用于搜索的字段
    await coursesIndex.updateSearchableAttributes(["name", "content"]);
    // 自定义用于排序的规则
    await coursesIndex.updateSortableAttributes(["updatedAt", "likesCount"]);
    // 排序权重顺序
    await coursesIndex.updateRankingRules([
      "sort",
      "words",
      "typo",
      "proximity",
      "attribute",
      "exactness",
    ]);
  } catch (error) {
    console.error("创建课程索引失败:", error);
  }
})();

// 章节索引
const chaptersIndex = searchClient.index("chapters");
(async () => {
  await chaptersIndex.updateSearchableAttributes(["title", "content"]);
  await chaptersIndex.updateSortableAttributes(["updatedAt"]);
  await chaptersIndex.updateRankingRules([
    "sort",
    "words",
    "typo",
    "proximity",
    "attribute",
    "exactness",
  ]);
})();

export { searchClient, coursesIndex, chaptersIndex };
