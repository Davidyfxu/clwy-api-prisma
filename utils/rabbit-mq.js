import amqp from "amqplib";
import sendMail from "./mail.js";
import logger from "./logger.js";
// 创建全局的RabbitMQ连接和通道
let connection;
let channel;

const connectToRabbitMQ = async () => {
  if (connection && channel) return;
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("成功连接到RabbitMQ");
    await channel.assertQueue("mail_queue", { durable: true });
  } catch (e) {
    logger.error("RabbitMQ 连接失败：", e);
  }
};

// 邮件队列生产则（发送邮件）
const mailProducer = async (msg) => {
  try {
    await connectToRabbitMQ();
    await channel.sendToQueue("mail_queue", Buffer.from(JSON.stringify(msg)), {
      persistent: true,
    });
  } catch (e) {
    logger.error("邮件队列生产者错误：", e);
  }
};

// 邮件队列消费者（接收邮件）
const mailConsumer = async () => {
  try {
    await connectToRabbitMQ();
    channel.consume(
      "mail_queue",
      async (msg) => {
        const message = JSON.parse(msg.content.toString());
        await sendMail(message.to, message.subject, message.html);
      },
      {
        noAck: true,
      },
    );
  } catch (e) {
    logger.error("邮件队列消费者错误：", e);
  }
};

export { mailProducer, mailConsumer };
