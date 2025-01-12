import amqplib from "amqplib";

(async () => {
  try {
    const connection = await amqplib.connect("amqp://admin:clwy1234@localhost");

    // 创建一个通道。通道是进行通信的基本单位，通过通道可以发送和接收消息
    const channel = await connection.createChannel();

    // 队列的名字是：hello
    const queue = "hello2";

    // 要发送的消息内容是：你好，长乐未央!
    const msg = "你好，长乐未央!";

    // 创建一个队列。如果队列不存在，则创建一个队列。如果队列已经存在，则不会创建新的队列
    // durable: 表示队列是否持久化。如果设置为true，即重启后队列不会消失
    await channel.assertQueue(queue, { durable: true });

    // 发送消息到队列
    // queue: 要发送消息的队列的名字
    // content: 要发送的消息内容
    // persistent: true，消息持久化，确保消息在 RabbitMQ 重启后仍然存在。
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });

    // 打印发送提示信息
    console.log("[x] 发送了：%s", msg);

    // 500ms 后关闭连接
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(error);
  }
})();
