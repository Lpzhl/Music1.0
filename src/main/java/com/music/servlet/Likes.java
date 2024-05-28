package com.music.servlet;

import com.google.gson.Gson;
import com.music.app.Comment1;
import com.music.app.CommentDetail;
import com.music.mapper.*;
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
import java.io.PrintWriter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@WebServlet("/Likes/*")
@MultipartConfig
public class Likes extends BaseServlet{
    private static final String AVATAR_BASE_PATH = "E:\\upload";
    private PlaylistMapper playlistMapper;
    private UserMapper userMapper;
    private SqlSession sqlSession;
    private SqlSessionFactory sqlSessionFactory;
    private LikesMapper likesMapper;
    private ManageMapper manageMapper;

    public Likes() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        sqlSession = sqlSessionFactory.openSession();  // 建立 session
        likesMapper = sqlSession.getMapper(LikesMapper.class);
        manageMapper = sqlSession.getMapper(ManageMapper.class);
    }
    private void ensureSqlSessionFactoryIsInitialized() throws IOException {
        if (sqlSessionFactory == null) {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        }
    }

    public void statisticsPostsCommentGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String postIdStr = req.getParameter("postId");
        int postId = Integer.parseInt(postIdStr);
        int commentCount = likesMapper.getCommentCountByPostId(postId);

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.print("{ \"commentCount\": " + commentCount + " }");
        out.flush();
    }


    protected void getPostCommentGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            String postIdStr = req.getParameter("postId");
            if (postIdStr == null || postIdStr.isEmpty()) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "postId is required.");
                return;
            }

            Integer postId = Integer.parseInt(postIdStr);
            List<CommentDetail> commentDetails = likesMapper.getPostCommentsWithUserDetails(postId);
            System.out.println("动态评论信息11："+commentDetails );
            Gson gson = new Gson();
            String jsonResponse = gson.toJson(commentDetails);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            System.out.println("动态评论信息："+jsonResponse);
            resp.getWriter().write(jsonResponse);

        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid postId format.");
        } catch (Exception e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error fetching comments.");
            e.printStackTrace();
        }
    }

    public void commentsPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        StringBuilder jsonBody = new StringBuilder();
        String line;
            BufferedReader reader = request.getReader();
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line);
            }

        JSONObject jsonObject;
        jsonObject = new JSONObject(jsonBody.toString());


        Integer userId = getIntegerFromJson(jsonObject, "user_id");
        Integer parentId = getIntegerFromJson(jsonObject, "parent_id");
        Integer topLevelCommentId = getIntegerFromJson(jsonObject, "top_level_comment_id");
        Integer playlistId = getIntegerFromJson(jsonObject, "playlist_id");
        Integer songId = getIntegerFromJson(jsonObject, "song_id");
        Integer userPostsId = getIntegerFromJson(jsonObject, "user_posts_id");
        String content = jsonObject.optString("content", null);

        List<String> words = manageMapper.getAllWords();
        buildDfaTree(words);  // 构建树
        content = filterContentWithDFA(content);  // 屏蔽敏感词
        System.out.println("敏感词汇："+content);

        Comment1 comment = new Comment1();
        comment.setUserId(userId);
        comment.setParentId(parentId);
        comment.setTopLevelCommentId(topLevelCommentId);
        comment.setPlaylistId(playlistId);
        comment.setSongId(songId);
        comment.setUserPostsId(userPostsId);
        comment.setContent(content);
        comment.setCommentTime(new Date());

        int result = likesMapper.insertComment(comment);
        sqlSession.commit();

        PrintWriter out = response.getWriter();


        if (result == 1) {
            out.print("{\"success\": true, \"comment_id\": " + comment.getId() +
                    ", \"parent_id\": " + comment.getParentId() +
                    ", \"top_level_comment_id\": " + comment.getTopLevelCommentId() + "}");
        } else {
            out.print("{\"success\": false, \"message\": \"评论保存失败\"}");
        }
    }

    private Integer getIntegerFromJson(JSONObject json, String key) {
        if (!json.has(key) || json.isNull(key)) {
            return null;
        }
        try {
            return json.getInt(key);
        } catch (Exception e) {
            return null;
        }
    }



    protected void likePostsPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        ensureSqlSessionFactoryIsInitialized();
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject jsonObject = new JSONObject(sb.toString());

        int userId = jsonObject.getInt("userId");
        int postId = jsonObject.getInt("postId");

        String action = jsonObject.getString("action");

        System.out.println("userId:"+userId);
        System.out.println("postId:"+postId);
        try {
            int result = 0;
            if ("like".equals(action)) {
                result = likesMapper.insertLikeForPost(userId, postId);

            } else if ("dislike".equals(action)) {
                result = likesMapper.deleteLikeForPost(userId, postId);

            }
            sqlSession.commit();
            if (result > 0) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().print("成功.");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().print("失败.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("错误.");
        }
    }
    protected void statisticsGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        ensureSqlSessionFactoryIsInitialized();

        String userIdStr = request.getParameter("userId");
        String postIdStr = request.getParameter("postId");
        if(userIdStr == null || postIdStr == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print("userId and postId parameters are required.");
            return;
        }
        int userId = Integer.parseInt(userIdStr);
        int postId = Integer.parseInt(postIdStr);


        System.out.println("统计："+userId);


        System.out.println("统计postId："+postId);
        JSONObject jsonResponse = new JSONObject();
        try {
           int totalLikes = likesMapper.getTotalLikesForPost(postId);
            int userLiked = likesMapper.hasUserLikedPost(userId, postId);

           jsonResponse.put("totalLikes", totalLikes);
            jsonResponse.put("userLiked", userLiked > 0);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().print(jsonResponse.toString());
            sqlSession.commit();
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("Error fetching statistics.");
        }
    }

    // DFA节点类
    static class TrieNode {
        public Map<Character, TrieNode> children = new HashMap<>();
        public boolean isEndOfWord;
    }

    protected TrieNode root = new TrieNode();

    // 构建DFA模型
    private void buildDfaTree(List<String> words) {
        for (String word : words) {
            TrieNode node = root;
            for (char ch : word.toCharArray()) {
                node = node.children.computeIfAbsent(ch, k -> new TrieNode());
            }
            node.isEndOfWord = true;
        }
    }


    // 使用DFA模型屏蔽敏感词
    private String filterContentWithDFA(String content) {
        StringBuilder result = new StringBuilder();
        int length = content.length();
        int i = 0;
        while (i < length) {
            TrieNode node = root;
            int j = i;
            int end = -1;
            while (j < length && node.children.containsKey(content.charAt(j))) {
                node = node.children.get(content.charAt(j));
                if (node.isEndOfWord) {
                    end = j;
                }
                j++;
            }
            if (end != -1) {
                while (i <= end) {
                    result.append('*');  // 用*号替换敏感词。。。。
                    i++;
                }
            } else {
                result.append(content.charAt(i));
                i++;
            }
        }
        return result.toString();
    }

}


