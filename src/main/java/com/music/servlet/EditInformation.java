package com.music.servlet;

import com.google.gson.JsonObject;
import com.music.app.User;
import com.music.mapper.UserMapper;
import io.jsonwebtoken.io.IOException;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.File;
import java.io.InputStream;
import java.net.SocketTimeoutException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@WebServlet("/edit")
@MultipartConfig
public class EditInformation extends HttpServlet {

    private static final String AVATAR_BASE_PATH = "E:\\upload";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException, java.io.IOException {
        HttpSession session = req.getSession();
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        int id = loggedInUser.getId();

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");

          System.out.println("nickname"+loggedInUser.getNickname());
          System.out.println("avatar"+loggedInUser.getAvatar());
            JsonObject json = new JsonObject();
            json.addProperty("nickname", loggedInUser.getNickname());
            json.addProperty("avatar", loggedInUser.getAvatar());
            json.addProperty("id", loggedInUser.getUsername());
            json.addProperty("email", loggedInUser.getEmail());

            resp.getWriter().write(json.toString());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException, java.io.IOException {
        HttpSession session = req.getSession();
        req.setCharacterEncoding("UTF-8");

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        int id = loggedInUser.getId();

        String nickname = req.getParameter("nickname");
        Part avatarPart = req.getPart("avatar");
        System.out.println("nickname："+nickname);
        System.out.println("avatarPart："+avatarPart);
        System.out.println("66666："+ req.getParts());
        System.out.println("77777:"+avatarPart.getSize());
        String avatar = loggedInUser.getAvatar();
        if (avatarPart != null && avatarPart.getSize() > 0) {
            String disposition = avatarPart.getHeader("content-disposition");
            String fileName = null;
            if (disposition != null) {
                String[] parts = disposition.split(";");
                for (String part : parts) {
                    if (part.trim().startsWith("filename")) {
                        fileName = part.substring(part.indexOf('=') + 1).trim().replace("\"", "");
                        break;
                    }
                }
            }

            if (fileName != null) {
                fileName = Paths.get(fileName).getFileName().toString();
                String realPath = AVATAR_BASE_PATH;
                File file = new File(realPath, fileName);
                // 判重
                if (!file.exists()) {
                    try (InputStream input = avatarPart.getInputStream()) {
                        System.out.println("进来了吗：");
                        Files.copy(input, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    }
                    avatar = fileName;

                } else {
                    avatar = fileName;
                    System.out.println("文件重复.");
                }
            }

        }
        System.out.println("avatar:" + avatar);
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            System.out.println("nick:"+nickname);
            System.out.println("avatar:"+avatar);
            userMapper.updateUser(id, nickname, avatar);

            // 获取更新后的用户信息
            User updatedUser = userMapper.getUserById(id);
            // 将更新后的用户信息存储到会话中
            session.setAttribute("loggedInUser", updatedUser);

            sqlSession.commit();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");

            JsonObject json = new JsonObject();
            System.out.println("雕塑："+nickname);
            json.addProperty("nickname", nickname);
            json.addProperty("avatar", avatar);

            resp.getWriter().write(json.toString());
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
/*                try (InputStream input = avatarPart.getInputStream()) {
                    Files.copy(input, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }
               *//* avatar = AVATAR_BASE_PATH + "/" + fileName;*//*
                avatar = fileName;
                System.out.println("avatar:"+avatar);*/