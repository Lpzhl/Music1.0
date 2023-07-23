package com.music.servlet;

import com.music.app.User;
import com.music.dao.DatabaseConnection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@WebServlet("/resetPassword")
public class ResetPasswordServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String code = request.getParameter("code");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String hashedPassword = hashWithMD5(password);

        DatabaseConnection db = new DatabaseConnection();
        User user = db.findByEmail(email);
        if (user != null) {
            // 如果能找到用户，就更新密码
            db.updatePassword(email,hashedPassword);
            HttpSession session = request.getSession();
            session.setAttribute("loggedInUser", user);
            System.out.println("找回成功");
            out.print("{\"success\": true, \"message\": \"密码重置成功\"}");
        } else {
            System.out.println("找回失败");
            out.print("{\"success\": false, \"message\": \"未找到用户\"}");
        }
        out.flush();
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

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}
