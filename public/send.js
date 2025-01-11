import amqp from "amqplib/callback_api";
// 连接到 RabbitMQ
amqp.connect("amqp://admin:clwy1234@localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }

  // 创建一个通道。通道是进行通信的基本单位，通过通道可以发送和接收消息
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    // 队列的名字是：hello
    const queue = "hello";

    // 要发送的消息内容是：你好，长乐未央!
    const msg = "你好，长乐未央!";

    // 创建一个队列。如果队列不存在，则创建一个队列。如果队列已经存在，则不会创建新的队列
    // durable: 表示队列是否持久化。如果设置为true，即重启后队列不会消失
    channel.assertQueue(queue, {
      durable: false,
    });

    // 发送消息到队列
    // queue: 要发送消息的队列的名字
    // content: 要发送的消息内容
    channel.sendToQueue(queue, Buffer.from(msg));

    // 打印发送提示信息
    console.log("[x] 发送了：%s", msg);
  });

  // 500ms 后关闭连接
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
