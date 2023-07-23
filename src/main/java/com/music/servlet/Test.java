package com.music.servlet;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;


import com.music.app.User;
import com.google.gson.Gson;
import com.music.dao.DatabaseConnection;
import com.music.uitl.JwtUtil;

@WebServlet("/test")
    public class Test extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();

        Gson gson = new Gson();
        User user = gson.fromJson(data, User.class);

        if (user == null) {
            System.out.println("User is null");
            request.setAttribute("error_message", "Invalid user data received");
            RequestDispatcher dispatcher = request.getRequestDispatcher("login.html");
            dispatcher.forward(request, response);
            return;
        }

        DatabaseConnection userDao = new DatabaseConnection();
        User validUser = userDao.validate(user);
        System.out.println(validUser);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        if (validUser != null) {
            // 用户验证成功后
            // 如果用户选择了"记住密码"
            System.out.println("记住密码："+user.getRemember());
            if ("1".equals(user.getRemember()))  {
                Cookie usernameCookie = new Cookie("username", validUser.getUsername());
                // 需要对密码进行安全处理，我直接使用原密码
                Cookie passwordCookie = new Cookie("password", validUser.getPassword());
                // 设置cookie的有效期，这里设置为7天（单位为秒）
                usernameCookie.setMaxAge(7 * 24 * 60 * 60);
                passwordCookie.setMaxAge(7 * 24 * 60 * 60);
                // 将cookie添加到响应中
                response.addCookie(usernameCookie);
                response.addCookie(passwordCookie);
            }

            // 验证成功的逻辑
            System.out.println("登录成功");

            // 获取Session对象
            HttpSession session = request.getSession();
            // 存储数据
            session.setAttribute("username", validUser.getUsername());
            // 存储用户信息或标记用户已登录
            session.setAttribute("loggedInUser", validUser);
            String accessToken = null;
            String refreshToken = null;
            try {
                accessToken = JwtUtil.generateToken(validUser.getUsername());
                refreshToken = JwtUtil.generateRefreshToken(validUser.getUsername());
                System.out.println("access token:"+accessToken);
                System.out.println("refresh token:"+refreshToken);
            } catch (Throwable e) {
                e.printStackTrace();
            }

            // 将 JWT 添加到响应体中
            if (accessToken != null && refreshToken != null) {
                System.out.println("哈哈哈哈哈哈哈哈哈");
                out.print("{\"success\":true,\"message\":\"登录成功\",\"accessToken\":\""+accessToken+"\",\"refreshToken\":\""+refreshToken+"\"}");
            } else {
                out.print("{\"success\":true,\"message\":\"登录成功但生成 token 失败\"}");
            }

        } else {
            // 验证失败的逻辑
            System.out.println("登录失败");
            out.print("{\"success\":false,\"message\":\"用户名或密码错误\"}");
        }

        out.flush();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}





