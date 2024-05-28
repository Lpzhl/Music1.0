package com.music.servlet;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.music.app.User;
import com.music.mapper.LikesMapper;
import com.music.mapper.ManageMapper;
import com.music.mapper.PlaylistMapper;
import com.music.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/manage/*")
@MultipartConfig
public class manage extends BaseServlet {
    private static final String AVATAR_BASE_PATH = "E:\\upload";
    private PlaylistMapper playlistMapper;
    private UserMapper userMapper;
    private SqlSession sqlSession;
    private SqlSessionFactory sqlSessionFactory;
    private LikesMapper likesMapper;
    private ManageMapper manageMapper;

    public manage() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        sqlSession = sqlSessionFactory.openSession();  // 建立 session
        likesMapper = sqlSession.getMapper(LikesMapper.class);
        manageMapper = sqlSession.getMapper(ManageMapper.class);
    }



    protected void handlePost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        String requestBody = sb.toString();
        System.out.println("Request Body: " + requestBody);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(requestBody);

        String action = jsonNode.get("action").asText();
        int userId = jsonNode.get("userId").asInt();
        response.setCharacterEncoding("UTF-8");
        if ("promote".equals(action)) {
            try {
                // 执行权限设置为管理员的操作
                manageMapper.promoteUserToAdmin(userId);
                sqlSession.commit(); // 提交事务

                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("用户已成功升级为管理员");
            } catch (Exception e) {
                sqlSession.rollback(); // 回滚事务
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("升级用户为管理员失败");
            }
        } else if ("demote".equals(action)) {
            try {
                // 执行降级为用户的操作
                manageMapper.demoteAdminToUser(userId);
                sqlSession.commit(); // 提交事务

                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("管理员已成功降级为用户");
            } catch (Exception e) {
                sqlSession.rollback(); // 回滚事务
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("降级管理员为用户失败");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("无效的操作");
        }
    }

    protected void unfreezeUserPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        String requestBody = sb.toString();
        System.out.println("Request Body: " + requestBody);

        try {
            JSONObject json = new JSONObject(requestBody);
            int userId = json.getInt("userId");

            // 执行数据库更新操作，将用户的 account_status 修改为 'NORMAL'
            User user = new User();
            user.setId(userId);
            user.setAccount_status("NORMAL");

            int updatedRows = manageMapper.updateUserAccountStatus(user); // 更新用户账号状态
            if (updatedRows > 0) {
                response.getWriter().write("{\"success\": true}");
                sqlSession.commit();
            } else {
                response.getWriter().write("{\"success\": false, \"message\": \"更新失败\"}");
            }
        } catch (Exception e) {
            response.getWriter().write("{\"success\": false, \"message\": \"更新出现错误\"}");
        }
    }


    protected void freezeUserPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        String requestBody = sb.toString();
        System.out.println("Body: " + requestBody);

        try {
            JSONObject json = new JSONObject(requestBody);
            int userId = json.getInt("userId");

            // 执行数据库更新操作，将用户的 account_status 修改为 'EXCEPTION'
            User user = new User();
            user.setId(userId);
            user.setAccount_status("EXCEPTION");

            int updatedRows = manageMapper.updateUserAccountStatus(user);
            if (updatedRows > 0) {
                response.getWriter().write("{\"success\": true}");
                sqlSession.commit();
            } else {
                response.getWriter().write("{\"success\": false, \"message\": \"更新失败\"}");
            }
        } catch (Exception e) {
            response.getWriter().write("{\"success\": false, \"message\": \"更新出现错误\"}");
        }
    }

    protected void getAllUsersGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            List<User> allUsers = manageMapper.getAllUsers();
            // 将用户信息以JSON格式返回给前端
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.writeValue(resp.getWriter(), allUsers);
        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private void ensureSqlSessionFactoryIsInitialized() throws IOException {
        if (sqlSessionFactory == null) {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        }
    }

    protected void addTagsGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            ensureSqlSessionFactoryIsInitialized();
            String newTag = request.getParameter("newTag");

            System.out.println("添加的："+newTag);

            if (newTag != null && !newTag.isEmpty()) {
                manageMapper.addTag(newTag);
                sqlSession.commit();
            }

            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "错误");
        }
    }

    protected void deleteTagsGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            ensureSqlSessionFactoryIsInitialized();
            String tagToDelete = request.getParameter("tagToDelete");
            System.out.println("删除的："+tagToDelete);
            if (tagToDelete != null && !tagToDelete.isEmpty()) {
                manageMapper.deleteTag(tagToDelete);
                sqlSession.commit();
            } else {
                // 如果标签为空或不存在，可以返回一个状态码表示失败
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "错误");
                return;
            }

            response.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "错误");
        }
    }


    protected void gettagsGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            ensureSqlSessionFactoryIsInitialized();
            List<String> tags = manageMapper.getAlltags();

            System.out.println("tags:"+tags);
            // 将标签列表转换为 JSON 格式并发送回前端
            String json = new Gson().toJson(tags);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "错误");
        }
    }

    protected void getAllWordsGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<String> words = manageMapper.getAllWords();
        response.setContentType("application/json");
        System.out.println(new Gson().toJson(words));
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(words));
    }

    protected void addWordPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuilder sb = new StringBuilder();
        String line;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (Exception e) {
            throw new ServletException("Error reading request payload", e);
        }

        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(sb.toString(), Map.class);
        String word = (String) map.get("word");

        System.out.println("word:"+word);
        int result = manageMapper.addWord(word);
        sqlSession.commit();
        Map<String, Boolean> resultMap = new HashMap<>();
        resultMap.put("success", result > 0);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(resultMap));
    }

    protected void removeWordPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuilder sb = new StringBuilder();
        String line;
        try {
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (Exception e) {
            throw new ServletException("Error reading request payload", e);
        }

        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(sb.toString(), Map.class);
        String word = (String) map.get("word");

        System.out.println("word:"+word);
        int result = manageMapper.removeWord(word);
        Map<String, Boolean> resultMap = new HashMap<>();
        sqlSession.commit();
        resultMap.put("success", result > 0);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(resultMap));
    }
}