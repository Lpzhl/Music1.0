package com.music.servlet;


import com.google.gson.Gson;
import com.music.app.*;
import com.music.mapper.*;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;


import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.util.*;
import java.util.zip.CheckedOutputStream;

@WebServlet("/search/*")
@MultipartConfig
public class SearchInfo extends BaseServlet {
    private static final String AVATAR_BASE_PATH = "E:\\upload";
    private PlaylistMapper playlistMapper;
    private UserMapper userMapper;
    private SqlSession sqlSession;
    private SearchMapper searchMapper;
    private LikesMapper likesMapper;
    private ManageMapper manageMapper;
    private SqlSessionFactory sqlSessionFactory;

    public SearchInfo() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        sqlSession = sqlSessionFactory.openSession();  // 建立 session
        searchMapper = sqlSession.getMapper(SearchMapper.class);  // 初始化 SearchMapper
        likesMapper = sqlSession.getMapper(LikesMapper.class);
        manageMapper = sqlSession.getMapper(ManageMapper.class);
    }
    class SearchRequest {
        String keyword;
    }

    protected void deletePostsPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");

        // 获取要删除的 post_id
        int postId = Integer.parseInt(request.getParameter("post_id"));

        // 首先删除与此 post_id 相关的所有图片
        searchMapper.deleteImagesByPostId(postId);

        // 然后删除该 post_id 的动态
        searchMapper.deleteUserPostById(postId);

        // 提交更改
        sqlSession.commit();

        // 发送成功的响应
        response.getWriter().write("删除成功!");
    }

    protected void getPostsGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        ensureSqlSessionFactoryIsInitialized();
        response.setCharacterEncoding("UTF-8");
        // 获取表单数据
        request.setCharacterEncoding("UTF-8");
        // 获取当前用户的 ID (这里假设从 session 中获取)
        int userId = Integer.parseInt(request.getParameter("userId"));

        // 使用 SearchMapper 的方法查询信息
        List<UserPost> posts = searchMapper.getFollowedUsersPosts(userId);

        // 对于每个动态，获取其相关的所有图片以及点赞数
        for (UserPost post : posts) {
            List<PostImage> images = searchMapper.getImagesForPost(post.getPost_id());
            post.setImages(images);

            int totalLikes = likesMapper.getTotalLikesForPost(post.getPost_id());
            System.out.println(post.getPost_id()+"次数："+totalLikes);
            post.setTotalLikes(totalLikes);
        }
        sqlSession.commit();
        // 将查询结果转换为 JSON 格式并写入响应
        Gson gson = new Gson();
        String resultJson = gson.toJson(posts);
        System.out.println("获取到的动态："+resultJson);
        response.getWriter().write(resultJson);
    }




    protected void savePostsInfoPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        resp.setCharacterEncoding("UTF-8");
        // 获取表单数据
        req.setCharacterEncoding("UTF-8");

        /* int userId = Integer.parseInt(req.getParameter("user_id"));*/
        String userIdStr = req.getParameter("user_id");
        Integer userId = null;
        if (userIdStr != null && !userIdStr.isEmpty() && !userIdStr.equals("null")) {
            userId = Integer.parseInt(userIdStr);
        }

        // 获取内容，并进行DFA屏蔽
        String content = req.getParameter("content");

        List<String> words = manageMapper.getAllWords();
        buildDfaTree(words);  // 初始化DFA模型，注意：如果敏感词库不经常更新，那么没有必要每次请求都构建DFA模型
        content = filterContentWithDFA(content);  // 屏蔽敏感词
        System.out.println("敏感词汇："+content);
        String postTime = req.getParameter("post_time");
        // Getting songId
        String songIdStr = req.getParameter("song_id");
        Integer songId = null;
        if (songIdStr != null && !songIdStr.isEmpty() && !songIdStr.equals("null")) {
            songId = Integer.parseInt(songIdStr);
        }

        String playlistIdStr = req.getParameter("playlist_id");
        Integer playlistId = null;
        if (playlistIdStr != null && !playlistIdStr.isEmpty() && !playlistIdStr.equals("null")) {
            playlistId = Integer.parseInt(playlistIdStr);

        }



        System.out.println("user_id:"+userId);
        System.out.println("content:"+content);
        System.out.println("post_time:"+postTime );
        System.out.println("song_id:"+songId);
        System.out.println("playlist_id:"+playlistId );


        // 保存到user_posts表
        UserPost userPost = new UserPost();
        userPost.setUser_id(userId);
        userPost.setContent(content);
        String formattedPostTime = postTime.replace("/", "-");
        userPost.setPost_time(Timestamp.valueOf(formattedPostTime));

        if(playlistId!=null){
            userPost.setPlaylist_id(playlistId);
        }
        if(songId!=null){
            userPost.setSong_id(songId);
        }
        int affectedRows = searchMapper.saveUserPost(userPost);
        if (affectedRows <= 0) {
            // handle error
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        Integer postid = null;
        // 获取上传的图片文件
        Collection<Part> imageParts = req.getParts();
        System.out.println("imageParts:"+imageParts);
        for (Part imagePart : imageParts) {
            if (imagePart.getName().startsWith("images[]") && imagePart.getSize() > 0) {
                String imagePath = saveImage(imagePart);

                // 保存到post_images表
                PostImage postImage = new PostImage();
                postImage.setPost_id(userPost.getPost_id());
                postImage.setImage_path(imagePath);
                System.out.println("动态："+postImage.getPost_id());
                System.out.println("动态233："+postImage.getImage_path());
                searchMapper.savePostImage(postImage);
                postid = postImage.getPost_id();
            }
        }

        sqlSession.commit();
        PrintWriter out = resp.getWriter();
        resp.setContentType("application/json"); // 设置返回数据的类型为JSON
        resp.setCharacterEncoding("UTF-8");      // 设置字符编码为UTF-8

        // 返回post_id作为JSON格式
        out.print("{\"post_id\":" + userPost.getPost_id() + "}");
        out.flush();
    }

    private String saveImage(Part imagePart) throws IOException {
        String disposition = imagePart.getHeader("content-disposition");
        String fileName = extractFileNameFromDisposition(disposition);

        // 获取当前时间戳
        long timestamp = System.currentTimeMillis();

        // 将时间戳添加到文件名后面
        String newFileName =  timestamp + "_" + fileName;

        System.out.println("图片名字：" + newFileName);

        String realPath = AVATAR_BASE_PATH;
        File file = new File(realPath, newFileName);

        try (InputStream input = imagePart.getInputStream()) {
            Files.copy(input, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
        }

        return newFileName;
    }

    private String extractFileNameFromDisposition(String disposition) {
        String[] parts = disposition.split(";");
        for (String part : parts) {
            if (part.trim().startsWith("filename")) {
                return part.substring(part.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return null;
    }








    /*

    // 增加 SearchInfoPost 方法
    protected void SearchInfoPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 解析请求主体并提取关键词
        BufferedReader reader = request.getReader();
        Gson gson = new Gson();
        String keyword = gson.fromJson(reader, SearchRequest.class).keyword;
        System.out.println("keyword:"+keyword);

        // 使用 SearchMapper 的 searchSongs 方法查询歌曲信息
        List<Song> songs = searchMapper.searchSongs(keyword);

        // 将查询结果转换为 JSON 格式并写入响应
        String songsJson = gson.toJson(songs);
        System.out.println("搜索到的歌曲信息："+songsJson);
        response.getWriter().write(songsJson);
    }

*/
    protected void getfollowsUserGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        int userId = Integer.parseInt(req.getParameter("userId"));
        List<User> follows = searchMapper.getFollowedUsers(userId);

        String json = new Gson().toJson(follows);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        System.out.println("关注信息："+json);
        resp.getWriter().write(json);

    }
    protected void getfollowersUserGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        int userId = Integer.parseInt(req.getParameter("userId"));
        List<User> followers = searchMapper.getFollowersUsers(userId); // Use the new method here

        String json = new Gson().toJson(followers);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        System.out.println("粉丝信息：" + json); // "粉丝信息" means "Fans Information" in English
        resp.getWriter().write(json);

    }

    protected void SearchInfoPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 解析请求主体并提取关键词
        BufferedReader reader = request.getReader();
        Gson gson = new Gson();
        String keyword = gson.fromJson(reader, SearchRequest.class).keyword;

        // 使用 SearchMapper 的搜索方法查询信息
        List<Song> songs = searchMapper.searchSongs(keyword);
        List<ArtistInfo> artists = searchMapper.searchArtists(keyword);
        List<Playlist> playlists = searchMapper.searchPlaylists(keyword);
        List<User> users = searchMapper.searchUsers(keyword);
        System.out.println("搜索结果歌曲："+songs);
        System.out.println("搜索结果歌手："+artists);
        System.out.println("搜索结果歌单："+playlists);
        System.out.println("搜索结果用户："+users);


        // 将查询结果放入 SearchResult 对象中
        SearchResult result = new SearchResult();
        result.setSongs(songs);
        result.setArtists(artists);
        result.setPlaylists(playlists);
        result.setUsers(users);

        // 将查询结果转换为 JSON 格式并写入响应
        String resultJson = gson.toJson(result);
        System.out.println("查找结果："+resultJson);
        response.getWriter().write(resultJson);
    }



    private void ensureSqlSessionFactoryIsInitialized() throws IOException {
        if (sqlSessionFactory == null) {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
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
                    result.append('*');  // 用*号替换敏感词
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
