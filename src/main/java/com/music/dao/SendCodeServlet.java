/*
package com.music.servlet;

import com.google.gson.Gson;
import com.music.uitl.EmailVca;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@WebServlet("/sendCode")
public class SendCodeServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, IOException {
        String email = request.getParameter("email");
        String code = EmailVca.generateRandomCode();
        HttpSession session = request.getSession();
        Map<String, String> result = new HashMap<>();
        Gson gson = new Gson();

        //保存验证码到session或数据库中，用于后续验证
        session.setAttribute("code", code);
        // 创建EmailVca实例时，将session传入
        EmailVca emailVca = new EmailVca(email, code, session);
        //使用线程池异步执行发送邮件任务，防止阻塞
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        executorService.submit(emailVca);
        executorService.shutdown();
        //返回结果给前端
        response.setCharacterEncoding("UTF-8");
        System.out.println("什么东西啊？？？？");
        result.put("success", "正确");
        result.put("message", "验证码发送成功");
        response.getWriter().write(gson.toJson(result));
        System.out.println("Saved expirationTime: to session: " + session.getId());
    }
}
*/
