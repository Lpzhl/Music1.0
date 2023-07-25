/*
package com.music.servlet;

import com.music.app.User;
import com.music.dao.DatabaseConnection;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        String hashedPassword = hashWithMD5(password);

        String username = generateUniqueUsername();

        DatabaseConnection databaseConnection = new DatabaseConnection();
        System.out.println("你好啊");
        System.out.println("6666666");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Map<String, String> result = new HashMap<>();
        Gson gson = new Gson();

        if (databaseConnection.existsByEmail(email)) {
            result.put("success", "false");
            result.put("message", "此邮箱已经被注册");
            System.out.println("哈哈哈哈哈哈");
            response.getWriter().write(gson.toJson(result));
            return;
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(hashedPassword);
        user.setEmail(email);
        user.setAvatar("image/默认头像.png");
        user.setNickname("新用户");
        databaseConnection.save(user);

        result.put("success", "true");
        result.put("message", "注册成功");
        HttpSession session = request.getSession();
        session.setAttribute("loggedInUser", user);
        response.getWriter().write(gson.toJson(result));
    }

    private String hashWithMD5(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(password.getBytes());
            BigInteger no = new BigInteger(1, digest);
            String hashText = no.toString(16);
            while (hashText.length() < 32) {
                hashText = "0" + hashText;
            }
            return hashText;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private String generateUniqueUsername() {
        DatabaseConnection userDao = new DatabaseConnection();
        String username;
        do {
            username = String.valueOf(new Random().nextInt(1_000_000_000));
        } while (userDao.existsByUsername(username));
        return username;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}
*/
