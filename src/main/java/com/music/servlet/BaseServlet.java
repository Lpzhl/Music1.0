package com.music.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Method;

public  class BaseServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 获取请求的Servlet路径
        String servletPath = req.getRequestURI();
        System.out.println("请求路径："+servletPath);
        System.out.println("进入BaseServletUser类");
        String methodName = servletPath.substring(servletPath.lastIndexOf('/') + 1);
        System.out.println("请求方法："+methodName);
        try {
            // 利用反射获取methodName对应的方法
            Method method;
            if ("GET".equals(req.getMethod())) {
                method = getClass().getDeclaredMethod(methodName + "Get", HttpServletRequest.class, HttpServletResponse.class);
            } else {
                method = getClass().getDeclaredMethod(methodName + "Post", HttpServletRequest.class, HttpServletResponse.class);
            }
            // 执行相应的方法
            method.invoke(this, req, resp);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
