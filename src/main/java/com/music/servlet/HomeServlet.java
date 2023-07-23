package com.music.servlet;

import com.alibaba.fastjson.JSONObject;
import com.music.app.User;
import com.music.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

@WebServlet("/home")
public class HomeServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException, IOException {

        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        HttpSession session = req.getSession();
        User loggedInUser = (User) session.getAttribute("loggedInUser");

        System.out.println("sb:"+sb);
        String body = sb.toString();
        System.out.println("bogy:"+body);
        JSONObject json = JSONObject.parseObject(body);
        System.out.println("json:"+json);
        String username = json.getString("username");
        // 从HttpSession中读取登录成功的用户信息
        if(username==null){
            username = loggedInUser.getUsername();
        }
        // 打印登录成功的用户信息
        System.out.println("登录成功的用户信息：" + loggedInUser);

        System.out.println("用户名666："+username);
        //1.加载mybatis的核心配置文件，获取SqlSessionFactory
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        //2.获取SqlSession对象，用它来执行sql
        try ( SqlSession sqlSession = sqlSessionFactory.openSession()) {
            // 获取 UserMapper 的实例
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            System.out.println("有吗："+userMapper);

            // 调用方法获取用户信息
            User user = userMapper.getUserByUsername(username);
            System.out.println("用户："+user);

            // 将用户信息作为响应返回给客户端
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            PrintWriter out = resp.getWriter();
            System.out.println("nickname:"+user.getNickname());
            System.out.println("avatar:"+ user.getAvatar());
            out.print("{ \"nickname\": \"" + user.getNickname() + "\", \"avatar\": \"" + user.getAvatar() + "\" }");
            out.flush();
        }
    }


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
