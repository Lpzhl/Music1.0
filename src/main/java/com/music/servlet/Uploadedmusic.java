package com.music.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.music.app.Song;
import com.music.mapper.PlaylistMapper;
import com.music.mapper.SearchMapper;
import com.music.mapper.UploadedmusicMapper;
import com.music.mapper.UserMapper;
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
import java.io.Console;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;


@WebServlet("/Uploadedmusic/*")
@MultipartConfig
public class Uploadedmusic extends BaseServlet {
    private static final String AVATAR_BASE_PATH = "E:\\upload";
    private PlaylistMapper playlistMapper;
    private UserMapper userMapper;
    private SqlSession sqlSession;
    private SearchMapper searchMapper;
    private UploadedmusicMapper uploadedmusicMapper;
    private SqlSessionFactory sqlSessionFactory;

    public Uploadedmusic() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        sqlSession = sqlSessionFactory.openSession();  // 建立 session
        searchMapper = sqlSession.getMapper(SearchMapper.class);  // 初始化 SearchMapper
        uploadedmusicMapper = sqlSession.getMapper(UploadedmusicMapper.class);  // 初始化 SearchMapper
    }


    protected void handlemusicPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");

        // 获取前端传过来的song_id
        String songIdStr = request.getParameter("song_id");
        if(songIdStr == null || songIdStr.isEmpty()) {
            // 无效的请求，song_id 缺失
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"status\":\"error\", \"message\":\"song_id is missing.\"}");
            return;
        }

        int songId = Integer.parseInt(songIdStr);
        // 使用MyBatis更新歌曲状态
        uploadedmusicMapper.updateSongStatusToAccepted(songId);
// 提交更改
        sqlSession.commit();
        // 获取并返回已经更新的歌曲给前端
        Song updatedSong = uploadedmusicMapper.getSongById(songId);

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", "success");
        responseObject.add("updatedSong", gson.toJsonTree(updatedSong));
        response.getWriter().write(responseObject.toString());
    }
    protected void getAllUploadedmusicGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");

        // 使用mapper查询状态为"审核中"的所有歌曲
        List<Song> songs = uploadedmusicMapper.getSongsWithStatusReviewing();

        // 使用Gson库将歌曲列表转换为JSON
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", "success");
        responseObject.add("songs", gson.toJsonTree(songs));

        // 发送响应
        response.getWriter().write(responseObject.toString());
    }

    protected void getUploadedmusicGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");

        // 获取请求中的userId
        int userId = Integer.parseInt(request.getParameter("userId"));

        // 使用mapper查询相关歌曲
        List<Song> songs = uploadedmusicMapper.getSongsByUserId(userId);

        // 使用Gson库将歌曲列表转换为JSON
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", "success");
        responseObject.add("songs", gson.toJsonTree(songs));

        // 发送响应
        response.getWriter().write(responseObject.toString());
    }


    protected void UploadedmusicPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ensureSqlSessionFactoryIsInitialized();
        response.setCharacterEncoding("UTF-8");
        request.setCharacterEncoding("UTF-8");

        // 获取表单数据
        String songName = request.getParameter("songName");
        int userId = Integer.parseInt(request.getParameter("user_id"));
        String artistName = request.getParameter("artistName");
        Part songFilePart = request.getPart("songFile");
        Part lyricFilePart = request.getPart("lyricFile");
        Part avatarFilePart = request.getPart("avatarFile");

        // 保存文件到本地目录
        String songFileName = saveFileToLocalDirectory(songFilePart);
        String lyricFileName = (lyricFilePart != null) ? saveFileToLocalDirectory(lyricFilePart) : null;
        String avatarFileName = (avatarFilePart != null) ? saveFileToLocalDirectory(avatarFilePart) : null;

        // 获取选中的标签值
        String selectedTag = request.getParameter("selectedTag");

        // 查询标签表获取标签ID
        int tagId = uploadedmusicMapper.getTagIdByName(selectedTag);

        // 检查是否已经存在相同的歌曲文件名
        Integer existingSongCount = uploadedmusicMapper.findSongByUserAndFilename(songFileName, userId);
        if (existingSongCount != null && existingSongCount > 0) {
            // 如果该用户已经上传过这个文件名的歌曲，返回错误信息
            response.getWriter().write("上传失败，该歌曲已经被你上传过!");
            return;
        }

        Song song = new Song();
        song.setName(songName);
        song.setArtist(artistName);
        song.setFilepath(songFileName);
        song.setLyric(lyricFileName);
        song.setAvatar(avatarFileName);
        song.setStatus("审核中");
        song.setArtist_id(userId);
        song.setTag_id(tagId); // 设置标签ID
        System.out.println("歌曲标签："+song.getTag_id());
        // 将信息保存到数据库
        int songId = uploadedmusicMapper.insertSong(song);
        int generatedId = song.getId();  // 获取生成的ID

        // 提交更改
        sqlSession.commit();

        // 查询新插入的歌曲信息
        Song newlyInsertedSong = uploadedmusicMapper.getSongById(generatedId);

        // 使用Gson库将新插入的歌曲信息转换为JSON
        Gson gson = new Gson();
        String songInfoJsonString = gson.toJson(newlyInsertedSong);

        // 创建一个新的JSON结构，包含状态和歌曲信息
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("status", "上传成功");
        responseJson.add("songInfoJson", gson.fromJson(songInfoJsonString, JsonElement.class));

        // 发送响应
        response.getWriter().write(responseJson.toString());
    }


    private String saveFileToLocalDirectory(Part filePart) throws IOException {
        String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();  // 获取文件名
        File file = new File(AVATAR_BASE_PATH, fileName);

        if (!file.exists()) {  // 如果文件不存在
            try (InputStream input = filePart.getInputStream()) {
                Files.copy(input, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
            }
        }
        return fileName;
    }

    private void ensureSqlSessionFactoryIsInitialized() throws IOException {
        if (sqlSessionFactory == null) {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        }
    }
}
