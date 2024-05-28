package com.music.servlet;

import com.music.mapper.LikesMapper;
import com.music.mapper.ManageMapper;
import com.music.mapper.PlaylistMapper;
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
import java.io.*;
import java.net.URLEncoder;


@WebServlet("/download")
public class DownloadServlet extends HttpServlet {

    private SqlSessionFactory sqlSessionFactory;

    @Override
    public void init() throws ServletException {
        super.init();
        ensureSqlSessionFactoryIsInitialized();
    }

    private void ensureSqlSessionFactoryIsInitialized() {
        if (sqlSessionFactory == null) {
            String resource = "mybatis-config.xml";
            try (InputStream inputStream = Resources.getResourceAsStream(resource)) {
                sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
            } catch (IOException e) {
                throw new RuntimeException("错误", e);
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String songId = request.getParameter("songId");
        String type = request.getParameter("type");

        String fileName;
        String contentType;

        switch (type) {
            case "cover":
                fileName = getAvatarFileNameFromDB(songId);
                contentType = "image/jpeg";
                break;
            case "lyric":
                fileName = getLyricFileNameFromDB(songId);
                contentType = "text/plain";
                break;
            case "music":
            default:
                fileName = getSongFileNameFromDB(songId);
                contentType = "audio/mpeg";
                break;
        }

        File file = new File("E:/upload/" + fileName);

        response.setContentType(contentType);
        String encodedFileName = URLEncoder.encode(fileName, "UTF-8");
        response.setHeader("Content-Disposition", "attachment;filename*=UTF-8''" + encodedFileName);
        response.setContentLength((int) file.length());

        try (FileInputStream fileInputStream = new FileInputStream(file);
             OutputStream outputStream = response.getOutputStream()) {

            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }
    }

    private String getSongFileNameFromDB(String songId) {
        try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            String filepath = mapper.getSongFilePathById(Integer.parseInt(songId));
            System.out.println("下载歌曲的文件：" + filepath);
            return filepath;
        }
    }

    private String getAvatarFileNameFromDB(String songId) {
        try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            String avatarPath = mapper.getAvatarPathById(Integer.parseInt(songId));
            System.out.println("下载的封面：" + avatarPath);
            return avatarPath;
        }
    }

    private String getLyricFileNameFromDB(String songId) {
        try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
            UserMapper mapper = sqlSession.getMapper(UserMapper.class);
            String lyricPath = mapper.getLyricPathById(Integer.parseInt(songId));
            System.out.println("下载的歌词：" + lyricPath);
            return lyricPath;
        }
    }
}
