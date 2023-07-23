package com.music.servlet;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Properties;
import java.util.Random;

@WebServlet("/sendVerificationCode")
public class SendVerificationCodeServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String toEmail = request.getParameter("email"); // 从注册页面获取填写的邮箱号
        String generatedCode = generateRandomCode(); // 生成验证码

        // 从配置文件中读取邮件服务器配置信息
        Properties properties = new Properties();
        properties.load(getClass().getResourceAsStream("/email.properties"));

        // 获取发送方的邮箱地址和密码
        String fromEmail = properties.getProperty("mail.from.email");
        String emailPassword = properties.getProperty("mail.from.password");

        // 创建一个用于发送邮件的 session
        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, emailPassword);
            }
        });

        // 组装邮件内容并发送邮件
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject("【双创科技】");
            message.setText("验证码: " + generatedCode + " 用于QQ邮箱身份验证，3分钟内有效，请勿泄露和转发。如非本人操作，请忽略此短信。");
            Transport.send(message);
            System.out.println("发送成功!");
            // 将验证码及其过期时间添加到映射中
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    // 生成一个随机六位数验证码
    private static String generateRandomCode() {
        Random random = new Random();
        int code = random.nextInt(1_000_000);
        return String.format("%06d", code);
    }
}
