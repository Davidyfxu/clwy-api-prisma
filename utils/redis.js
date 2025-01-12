import { createClient } from "redis";
import logger from "./logger.js";

// 创建全局的 Redis 客户端实例
let client;

/**
 * 初始化 Redis 客户端
 */
const redisClient = async () => {
  if (client) return; // 如果客户端已经初始化，则不再重复初始化

  client = await createClient()
    .on("error", (err) => logger.error("Redis 连接失败：", err))
    .connect();
};

/**
 * 存入数组或对象，并可选地设置过期时间
 * @param key 键名
 * @param value 要存储的值
 * @param ttl 可选，以秒为单位的过期时间，默认不设置
 */
const setKey = async (key, value, ttl = null) => {
  if (!client) await redisClient(); // 确保客户端已初始化
  value = JSON.stringify(value); // 将对象转换为JSON字符串
  await client.set(key, value);

  // 如果提供了ttl，则设置过期时间
  if (ttl !== null) {
    await client.expire(key, ttl);
  }
};
/**
 * 读取数组或对象
 * @param key 键名
 * @returns {Promise<any>} 解析后的JSON对象或数组
 */
const getKey = async (key) => {
  if (!client) await redisClient(); // 确保客户端已初始化
  const value = await client.get(key); // 将获取到的JSON字符串转换回对象
  return value ? JSON.parse(value) : null; // 如果value为空，返回null而不是抛出错误
};
/**
 * 清除缓存数据
 * @param key
 * @returns {Promise<void>}
 */
const delKey = async (key) => {
  if (!client) await redisClient(); // 确保客户端已初始化
  await client.del(key);
};
/**
 * 获取匹配模式的所有键名
 * @param pattern
 * @returns {Promise<*>}
 */
const getKeysByPattern = async (pattern) => {
  if (!client) await redisClient();
  return await client.keys(pattern);
};
/**
 * 清空所有缓存数据
 * @returns {Promise<void>}
 */
const flushAll = async () => {
  if (!client) await redisClient();
  await client.flushAll();
};
export { redisClient, setKey, getKey, delKey, getKeysByPattern, flushAll };
