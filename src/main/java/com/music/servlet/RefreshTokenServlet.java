package com.music.servlet;

import com.music.uitl.JwtUtil;
import io.jsonwebtoken.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

@WebServlet("/refreshToken")
public class RefreshTokenServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, java.io.IOException {
        String refreshToken = request.getHeader("Authorization");
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);
        }

        // 验证refresh token的有效性
        if (JwtUtil.validateRefreshToken(refreshToken)) {
            // 生成新的access token和refresh token
            String username = JwtUtil.getUsernameFromToken(refreshToken);
            String newAccessToken = JwtUtil.generateToken(username);
            String newRefreshToken = JwtUtil.generateRefreshToken(username);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            System.out.println("哈哈哈：人防人防人防如果不隔热隔热");
            out.print("{\"accessToken\":\"" + newAccessToken + "\", \"refreshToken\":\"" + newRefreshToken + "\"}");
            out.flush();
        } else {
            // 如果refresh token无效，返回错误信息
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid refresh token");
        }
    }
}
