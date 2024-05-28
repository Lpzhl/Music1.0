package com.music.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.music.app.*;
import com.music.dao.DatabaseConnection;
import com.music.mapper.CommentMapper;
import com.music.mapper.MembershipMapper;
import com.music.mapper.PlaylistMapper;
import com.music.mapper.UserMapper;
import com.music.servlet.BaseServlet;
import com.music.uitl.CustomDateDeserializer;
import com.music.uitl.JwtUtil;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.lang.reflect.Type;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@WebServlet("/user/*")
@MultipartConfig
public class UserServlet extends BaseServlet {
    private static final String AVATAR_BASE_PATH = "E:\\upload";
    private PlaylistMapper playlistMapper;
    private UserMapper userMapper;  // 添加 UserMapper 实例
    private SqlSession sqlSession;
    private CommentMapper commentMapper;

    private SqlSessionFactory sqlSessionFactory;

    public UserServlet() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        this.sqlSession = sqlSessionFactory.openSession(); // 初始化字段
        this.playlistMapper = sqlSession.getMapper(PlaylistMapper.class);
        this.userMapper = sqlSession.getMapper(UserMapper.class);  // 初始化 UserMapper 实例
        this.commentMapper = sqlSession.getMapper(CommentMapper.class);
    }

    protected void approve_submissionPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));

            // 更新 authentication_info 表的 auth_status 为 '1'（已通过）
            userMapper.updateAuthStatus(id, 1);

            // 获取提交详情
            AuthenticationInfo submission = userMapper.getAuthenticationInfoById(id);

            // 更新 user 表为艺术家详情
            User user = new User();
            user.setId(submission.getUser_id());
            System.out.println("哈哈哈哈哈哈"+submission);
            System.out.println("哈哈"+submission.getArtistName());
            user.setNickname(submission.getArtistName());
            user.setAvatar(submission.getAvatarUrl());
            user.setUser_type("ARTIST");
            System.out.println(user);
            userMapper.updateUserArtistDetails(user);

            // 插入艺术家详情到 artists 表
            Artist artist = new Artist();
            artist.setId(submission.getUser_id());
            artist.setGenre(submission.getGenre());
            artist.setIntroduction(submission.getIntroduction());
            userMapper.insertArtist(artist);


            // 提交事务
            sqlSession.commit();
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println("提交已批准");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("批准提交失败：" + e.getMessage());
        }
    }

    protected void reject_submissionPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            int id = Integer.parseInt(request.getParameter("id"));

            // 更新 authentication_info 表的 auth_status 为 '2'（拒绝）
            userMapper.updateAuthStatus(id, 2);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println("提交已拒绝");
            sqlSession.commit();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("拒绝提交失败：" + e.getMessage());
        }
    }


    protected void handle_authentication_recordsGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            response.setCharacterEncoding("UTF-8");


            List<AuthenticationInfo> records = userMapper.getAllPendingAuthenticationRecords();


            ObjectMapper objectMapper = new ObjectMapper();
            String recordsJson = objectMapper.writeValueAsString(records);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println(recordsJson);
        } catch (Exception e) {
            e.printStackTrace();

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Failed to retrieve authentication records: " + e.getMessage());
        }
    }


    protected void authentication_recordsGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            response.setCharacterEncoding("UTF-8");
            int userId = Integer.parseInt(request.getParameter("user_id"));

            // 获取提交记录
            List<AuthenticationInfo> records = userMapper.getAuthenticationRecords(userId);

            // 将提交记录转换为 JSON 并返回给前端
            ObjectMapper objectMapper = new ObjectMapper();
            String recordsJson = objectMapper.writeValueAsString(records);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println(recordsJson);
        } catch (Exception e) {
            e.printStackTrace();
            // 响应错误消息
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("获取提交记录失败：" + e.getMessage());
        }
    }


    private Map<Integer, Long> userLastSubmitTime = new HashMap<>(); // 用于存储用户最近提交时间的 Map

    protected void authenticationPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            request.setCharacterEncoding("UTF-8");
            response.setCharacterEncoding("UTF-8");

            int userId = Integer.parseInt(request.getParameter("user_id"));
            String artistName = request.getParameter("artistName");
            String genre = request.getParameter("genre");
            String introduction = request.getParameter("introduction");
            Part avatarPart = request.getPart("avatar");

            String avatar = null;
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
                            System.out.println(fileName + "  文件下载成功：");
                            Files.copy(input, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                        }
                        avatar = fileName;
                    } else {
                        avatar = fileName;
                        System.out.println("文件重复.");
                    }
                }
            }

// 检查是否已达到每小时两次的提交限制
            Long lastSubmitTime = userLastSubmitTime.get(userId);
            System.out.println("lastSubmitTime:" + lastSubmitTime);
            System.out.println("系统时间：" + System.currentTimeMillis());
            if (lastSubmitTime != null && System.currentTimeMillis() - lastSubmitTime < 90000) {
                // 如果在一小时内已经提交过两次，返回错误信息
                /*response.setStatus(HttpServletResponse.SC_BAD_REQUEST);*/
                response.getWriter().println("每半小时只能提交一次认证信息");
                return;
            }


            // 保存认证信息到数据库表 authentication_info
            AuthenticationInfo authenticationInfo = new AuthenticationInfo();
            authenticationInfo.setUser_id(userId);
            authenticationInfo.setArtistName(artistName);
            authenticationInfo.setGenre(genre);
            authenticationInfo.setIntroduction(introduction);
            authenticationInfo.setAvatarUrl(avatar);

            // 执行插入操作，您需要确保 userMapper 变量已正确初始化
            userMapper.insertAuthenticationInfo(authenticationInfo);
            sqlSession.commit();

            // 更新最近提交时间
            userLastSubmitTime.put(userId, System.currentTimeMillis());

            // 响应成功消息
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println("认证信息提交成功");

        } catch (Exception e) {
            e.printStackTrace();
            // 响应错误消息
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("认证信息提交失败：" + e.getMessage());
        }
    }


    protected void getPlaylistCommentsGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int playlistId = Integer.parseInt(request.getParameter("playlist_id"));

        // 使用CommentMapper从数据库获取评论
        List<Comment> comments = commentMapper.fetchCommentsForPlaylist(playlistId);
        System.out.println("评论记录:"+comments);
        response.setContentType("application/json; charset=UTF-8");
        response.getWriter().write(new Gson().toJson(comments));
    }

    protected void saveCommentPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 响应评论数据，包括数据库中生成的 ID
        response.setContentType("application/json; charset=UTF-8");

        // 使用自定义的日期解析器
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Date.class, new CustomDateDeserializer())
                .create();

        // 解析请求体
        Comment comment = gson.fromJson(request.getReader(), Comment.class);

        // 插入到数据库中
        commentMapper.insertComment(comment);
        sqlSession.commit();

        // 返回评论（现在包含数据库生成的ID和时间）
        System.out.println("评论是L::" + comment);
        response.getWriter().write(new Gson().toJson(comment));
    }


    protected void loginPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();

        Gson gson = new Gson();
        User user = gson.fromJson(data, User.class);

        if (user == null) {
            System.out.println("User is null");
            request.setAttribute("error_message", "Invalid user data received");
            RequestDispatcher dispatcher = request.getRequestDispatcher("login.html");
            dispatcher.forward(request, response);
            return;
        }

        DatabaseConnection userDao = new DatabaseConnection();
        User validUser = userDao.validate(user);
        System.out.println("获取到的："+validUser);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        System.out.println(validUser.getAccount_status());
        System.out.println(!validUser.getAccount_status().equals("EXCEPTION"));

        if (validUser != null&& !validUser.getAccount_status().equals("EXCEPTION")) {
            // 用户验证成功后
            // 如果用户选择了"记住密码"
            System.out.println("记住密码："+user.getRemember());
            if ("1".equals(user.getRemember()))  {
                System.out.println("记住密码了吗：");
                Cookie usernameCookie = new Cookie("username", validUser.getUsername());
                // 需要对密码进行安全处理，我直接使用原密码
                Cookie passwordCookie = new Cookie("password", validUser.getPassword());
                // 设置cookie的有效期，这里设置为7天（单位为秒）
                usernameCookie.setMaxAge(7 * 24 * 60 * 60);
                passwordCookie.setMaxAge(7 * 24 * 60 * 60);
                // 将cookie添加到响应中
                response.addCookie(usernameCookie);
                response.addCookie(passwordCookie);
            }

            // 验证成功的逻辑
            System.out.println("登录成功");

            // 获取Session对象
            HttpSession session = request.getSession();
            // 存储数据
            session.setAttribute("username", validUser.getUsername());
            // 存储用户信息或标记用户已登录
            session.setAttribute("loggedInUser", validUser);
            String accessToken = null;
            String refreshToken = null;
            try {
                accessToken = JwtUtil.generateToken(validUser.getUsername());
                refreshToken = JwtUtil.generateRefreshToken(validUser.getUsername());
                System.out.println("access token:"+accessToken);
                System.out.println("refresh token:"+refreshToken);
            } catch (Throwable e) {
                e.printStackTrace();
            }

            // 将 JWT 添加到响应体中
            if (accessToken != null && refreshToken != null) {
                System.out.println("哈哈哈哈哈哈哈哈哈");
                out.print("{\"success\":true,\"message\":\"登录成功\",\"accessToken\":\""+accessToken+"\",\"refreshToken\":\""+refreshToken+"\"}");
            } else {
                out.print("{\"success\":true,\"message\":\"登录成功但生成 token 失败\"}");
            }

        }else if(validUser.getAccount_status().equals("EXCEPTION")){
            System.out.println("账号已冻结");
            out.print("{\"success\":false,\"message\":\"该账号已被冻结\"}");
        }else {
            // 验证失败的逻辑
            System.out.println("登录失败");
            out.print("{\"success\":false,\"message\":\"用户名或密码错误\"}");
        }

        out.flush();
    }

    protected void editGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession();
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        int userId = loggedInUser.getId();

        try (SqlSession localSession = sqlSessionFactory.openSession()) {
            UserMapper localUserMapper = localSession.getMapper(UserMapper.class);
            User validUser = localUserMapper.getUserByUsername1(loggedInUser.getUsername());

            JsonObject json = new JsonObject();
            json.addProperty("nickname", loggedInUser.getNickname());
            json.addProperty("avatar", loggedInUser.getAvatar());
            json.addProperty("id", loggedInUser.getUsername());
            json.addProperty("email", loggedInUser.getEmail());

            if (validUser.getUserMembership() != null) {
                Date endDate = validUser.getUserMembership().getEnd_date();

                if (endDate == null) {
                    json.addProperty("membershipEndDate", "未购买会员");
                } else {
                    SimpleDateFormat targetFormat = new SimpleDateFormat("yyyy-M-dd");
                    String formattedDate = targetFormat.format(endDate);
                    json.addProperty("membershipEndDate", formattedDate);
                }
            } else {
                json.addProperty("membershipEndDate", "未购买会员");
            }

            response.getWriter().write(json.toString());
        }
    }

    protected void edit1Get(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 在这里处理编辑个人信息的GET请求

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);

        String userId = request.getParameter("userId");
        User user = userMapper.getUserById(Integer.parseInt(userId));

        sqlSession.commit();
        sqlSession.close();

        Gson gson = new Gson();
        String userJson = gson.toJson(user);
        response.getWriter().write(userJson);
    }


    protected void editPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 在这里处理编辑个人信息的POST请求
        HttpSession session = request.getSession();
        request.setCharacterEncoding("UTF-8");

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        int id = loggedInUser.getId();

        String nickname = request.getParameter("nickname");
        Part avatarPart = request.getPart("avatar");
        System.out.println("nickname："+nickname);
        System.out.println("avatarPart："+avatarPart);
        System.out.println("66666："+ request.getParts());
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
                        System.out.println(fileName+"  文件下载成功：");
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
            System.out.println("更新后："+updatedUser);
            // 将更新后的用户信息存储到会话中
            session.setAttribute("loggedInUser", updatedUser);

            sqlSession.commit();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            JsonObject json = new JsonObject();
            System.out.println("雕塑："+nickname);
            json.addProperty("nickname", nickname);
            json.addProperty("avatar", avatar);

            response.getWriter().write(json.toString());
        } catch (Exception e) {
            System.out.println(e);
        }
    }
    public List<Integer> extractSongFeatures(List<Song> songs) {
        List<Integer> songFeatures = new ArrayList<>();

        for (Song song : songs) {
            // 提取每首歌曲的 tag_id 并添加到特征列表中
            songFeatures.add(song.getTag_id());
        }

        return songFeatures;
    }


    public List<Integer> getUserInterestFeatures(int userId) {
        List<Integer> userInterestFeatures = new ArrayList<>();

        // 获取用户的兴趣模型（基于用户播放记录的歌曲ID列表）
        List<Integer> userPlayedSongIds = playlistMapper.getUserPlayedSongIds(userId);

        // 将用户播放过的歌曲ID作为兴趣特征
        userInterestFeatures.addAll(userPlayedSongIds);

        return userInterestFeatures;
    }


    public List<Song> recommendSongs(List<Integer> userInterestFeatures, List<Song> allSongs) {
        List<Song> recommendedSongs = new ArrayList<>();

        int count = 0;

        for (Song song : allSongs) {
            if (userInterestFeatures.contains(song.getId())) {
                recommendedSongs.add(song);
                count++;

                if (count == 4) {
                    break;
                }
            }
        }
        return recommendedSongs;
    }


    public List<Song> getRecommendedSongs(int userId) {
        // 获取用户的兴趣模型特征
        List<Integer> userInterestFeatures = getUserInterestFeatures(userId);

        // 获取所有歌曲列表
        List<Song> allSongs =userMapper.selectSongs();

        // 进行推荐
        return recommendSongs(userInterestFeatures, allSongs);
    }


    public void songGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            // 获取用户ID
            int userId = Integer.parseInt(request.getParameter("userId"));

            // 获取推荐歌曲
            List<Song> recommendedSongs = getRecommendedSongs(userId);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            Gson gson = new Gson();
            System.out.println("推荐的歌曲信息："+gson.toJson(recommendedSongs));
            response.getWriter().write(gson.toJson(recommendedSongs));
    }


    public void updateInterests(List<PlayLog> playLogs) {
        for (PlayLog playLog : playLogs) {
            // 1. 在播放记录表中插入新的播放记录
            System.out.println(" playLog.getPlayTime:" + playLog.getPlay_time());
            playlistMapper.savePlayLog(playLog.getUser_id(), playLog.getSong_id(), playLog.getPlay_time());

            // 2. 更新用户兴趣模型
            UserInterest userInterest = userMapper.getUserInterest(playLog.getUser_id(), playLog.getSong_id());
            if (userInterest == null) {
                // 用户对该歌曲的兴趣记录不存在，创建新的兴趣记录
                userInterest = new UserInterest(playLog.getUser_id(), playLog.getSong_id(), 1);
                userMapper.insertUserInterest(userInterest);
            } else {
                // 用户对该歌曲的兴趣记录已存在，增加兴趣计数
                userInterest.setInterest_count(userInterest.getInterest_count() + 1);
                userMapper.updateUserInterest(userInterest);
            }
        }

        sqlSession.commit();
    }


    public void savePlayLogsPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            String json = sb.toString();
            Gson gson = new Gson();

            // 解析 JSON 数据
            Type type = new TypeToken<Map<String, Object>>(){}.getType();
            Map<String, Object> map = gson.fromJson(json, type);

            // 取出 "playLogs" 键对应的值，并将其解析为一个 List<PlayLog>
            String playLogsString = (String) map.get("playLogs");
            double userIdDouble = (Double) map.get("user_id");
            int userIdInt = (int) userIdDouble;

            Type playLogListType = new TypeToken<List<PlayLog>>(){}.getType();
            List<PlayLog> playLogs = gson.fromJson(playLogsString, playLogListType);

            playlistMapper.deletePlayLogsByUserId(userIdInt);
            // 调用方法实时更新用户兴趣建模
            updateInterests(playLogs);

            // 返回响应，表示播放记录保存成功
            resp.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            e.printStackTrace();
        }
    }

/*    protected void songGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 在这里处理获取歌曲请求
        List<Song> songs = new ArrayList<>();
        try {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

            try (SqlSession sqlSession = sqlSessionFactory.openSession()) {
                *//*songs = sqlSession.selectList("selectSongs");*//*
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
    }*/

    protected void validateCodePost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 在这里处理发送验证码请求
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

    protected void registerPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 这里处理用户注册请求
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

    protected void resetPasswordPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 这里处理找回密码
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
    protected void getAllSongsInfoPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        List<SongWithArtistDetails> songsWithDetails;

        try (SqlSession localSession = sqlSessionFactory.openSession()) {
            PlaylistMapper playlistMapper = localSession.getMapper(PlaylistMapper.class);
            songsWithDetails = playlistMapper.getAllSongsInfo();
        }

        Gson gson = new Gson();
        String songsWithDetailsJson = gson.toJson(songsWithDetails);
        System.out.println("所有歌曲信息："+songsWithDetailsJson);
        response.getWriter().write(songsWithDetailsJson);
    }

   protected void TierDownPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // 获取参数
        String songId = request.getParameter("song_id");

        try (SqlSession localSession = sqlSessionFactory.openSession()) {
            // 获取对应的Mapper
            MembershipMapper localMembershipMapper = localSession.getMapper(MembershipMapper.class);

            // 将歌曲降级为普通歌曲的逻辑
            try {
                int result = localMembershipMapper.tierDownSong(Integer.parseInt(songId));

                if (result > 0) {
                    // 降级成功
                    response.getWriter().write("success");
                } else {
                    // 降级失败
                    response.getWriter().write("fail");
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
                response.getWriter().write("fail");
            }
            localSession.commit();
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("fail");
        }
    }

    public void UpgradesPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // 获取参数
        String songId = request.getParameter("song_id");

        try (SqlSession localSession = sqlSessionFactory.openSession()) {
            // 获取对应的Mapper
            MembershipMapper localMembershipMapper = localSession.getMapper(MembershipMapper.class);

            // 将歌曲升级为会员歌曲的逻辑
            try {
                int result = localMembershipMapper.upgradeToMemberSong(Integer.parseInt(songId));
                if (result > 0) {
                    // 升级成功
                    response.getWriter().write("success");
                } else {
                    // 升级失败
                    response.getWriter().write("fail");
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
                response.getWriter().write("fail");
            }
            localSession.commit();
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("fail");
        }
    }


    protected void getFollowerCountGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String userId = request.getParameter("userId");
        System.out.println("关注者：" + userId);
        int followerCount, followingCount;

        try (SqlSession localSession = sqlSessionFactory.openSession()) {
            UserMapper localUserMapper = localSession.getMapper(UserMapper.class);
            followerCount = localUserMapper.getFollowerCount(Integer.parseInt(userId));
            followingCount = localUserMapper.getFollowingCount(Integer.parseInt(userId));
            System.out.println("粉丝：" + followerCount);
            System.out.println("关注的人：" + followingCount);
        }

        Map<String, Integer> followCounts = new HashMap<>();
        followCounts.put("followerCount", followerCount);
        followCounts.put("followingCount", followingCount);

        Gson gson = new Gson();
        String followCountsJson = gson.toJson(followCounts);
        response.getWriter().write(followCountsJson);
    }


    private void ensureSqlSessionFactoryIsInitialized() throws IOException {
        if (sqlSessionFactory == null) {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        }
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

}
