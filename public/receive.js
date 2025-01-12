import amqplib from "amqplib";

(async () => {
  try {
    // 连接到 RabbitMQ
    const connection = await amqplib.connect("amqp://admin:clwy1234@localhost");

    // 创建一个通道。通道是进行通信的基本单位，通过通道可以发送和接收消息
    const channel = await connection.createChannel();

    // 队列的名字是：hello
    const queue = "hello2";

    // 创建一个队列。如果队列不存在，则创建一个队列。如果队列已经存在，则不会创建新的队列
    // durable: 表示队列是否持久化。如果设置为true，即重启后队列不会消失
    await channel.assertQueue(queue, { durable: true });

    // 打印等待接收消息的提示信息
    console.log(" [*] 等待接收消息在 %s 队列中. 按 CTRL+C 退出", queue);

    // 当接收到消息
    channel.consume(
      queue,
      (msg) => {
        // 打印接收到的消息内容
        console.log("[x] 接收到了：%s", msg.content.toString());

        // 如果不是自动确认，需要手动确认消息
        // channel.ack(msg);
      },
      {
        // noAck: 表示是否自动确认消息，设置为true表示自动确认，设置为false表示手动确认
        // 如果设置为false，需要手动确认消息，否则消息会被重复消费。例如：channel.ack(msg)
        noAck: true,
      },
    );
  } catch (error) {
    console.log(error);
  }
})();
