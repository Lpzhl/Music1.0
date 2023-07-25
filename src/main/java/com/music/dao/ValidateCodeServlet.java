/*
package com.music.servlet;

import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/validateCode")
public class ValidateCodeServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String code = request.getParameter("code");
        String savedCode = (String) request.getSession().getAttribute("code");
        LocalDateTime expirationTime = (LocalDateTime) request.getSession().getAttribute("expirationTime");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, String> result = new HashMap<>();
        Gson gson = new Gson();


        if (savedCode == null || expirationTime == null) {
            result.put("success", "false");
            result.put("message", "验证码错误");
            response.getWriter().write(gson.toJson(result));
            return;
        }

        if (LocalDateTime.now().isAfter(expirationTime)) {
            request.getSession().removeAttribute("code");
            request.getSession().removeAttribute("expirationTime");
            result.put("success", "false");
            result.put("message", "验证码已过期");
            response.getWriter().write(gson.toJson(result));
            return;
        }

        if (!code.equals(savedCode)) {
            result.put("success", "false");
            result.put("message", "验证码错误");
            response.getWriter().write(gson.toJson(result));
            return;
        }

        request.getSession().removeAttribute("code");
        request.getSession().removeAttribute("expirationTime");
        result.put("success", "true");
        result.put("message", "验证码验证成功");
        response.getWriter().write(gson.toJson(result));
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}
*/
