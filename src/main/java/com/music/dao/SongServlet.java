/*
package com.music.servlet;
import com.google.gson.Gson;
import com.music.app.Song;
import com.music.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.*;

@WebServlet("/song")
public class SongServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Song> songs = new ArrayList<>();
        try {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

            try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
                */
/*songs = sqlSession.selectList("selectSongs");*//*

                UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
                songs = userMapper.selectSongs();
                System.out.println("红红火火恍恍惚惚");
                System.out.println("songs:"+songs);
            }
        } catch (Exception e) {
            System.out.println("87889898987");
            System.out.println(e);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Gson gson = new Gson();
        response.getWriter().write(gson.toJson(songs));
    }
}
*/
