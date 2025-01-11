import nodemailer from "nodemailer";

/**
 * 发送邮件
 * @param email
 * @param subject
 * @param html
 * @returns {Promise<void>}
 */
const sendMail = async (email, subject, html) => {
  /**
   * 发件箱配置
   */
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE === "true",
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
    tls: {
      rejectUnauthorized: false, // 在开发环境中可以设置为false
    },
  });
  await transporter.sendMail({
    from: process.env.MAILER_USER,
    to: email,
    subject,
    html,
  });
};

export default sendMail;
