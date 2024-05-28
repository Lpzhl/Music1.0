package com.music.servlet;

import com.alibaba.fastjson.JSONObject;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.music.app.*;
import com.music.mapper.PlaylistMapper;
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
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.music.mapper.UserMapper;

@WebServlet("/playlist/*")
@MultipartConfig
public class MusicServlet extends BaseServlet {
    private static final String AVATAR_BASE_PATH = "E:\\upload";
    private PlaylistMapper playlistMapper;
    private UserMapper userMapper;
    private SqlSession sqlSession;

    public MusicServlet() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        this.sqlSession = sqlSessionFactory.openSession(); // 初始化字段
        this.playlistMapper = sqlSession.getMapper(PlaylistMapper.class);
        this.userMapper = sqlSession.getMapper(UserMapper.class);  // 初始化 UserMapper 实例
    }

    @Override
    public void destroy() {
        if (sqlSession != null) {
            sqlSession.close();
        }
        super.destroy();
    }

    protected void getAllPlaylistInfoPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            resp.setCharacterEncoding("UTF-8");

            // 创建一个List来存放所有歌单的信息
            List<Map<String, Object>> allPlaylistsData = new ArrayList<>();

            // 调用方法获取除了name为“我的喜欢”的所有歌单信息
            List<Playlist> allPlaylistList = playlistMapper.getAllPlaylistsExcept("我的喜欢");

            // 对每个歌单，获取创建者信息和歌单内的所有歌曲
            for (Playlist playlist : allPlaylistList) {
                Map<String, Object> playlistData = new HashMap<>();

                // 从数据库获取创建歌单的用户信息
                User creator = userMapper.getUserById(playlist.getCreator());

                // 将用户信息和歌单信息添加到Map中
                playlistData.put("playlist", playlist);
                playlistData.put("creator", creator);

                // 获取歌单内的所有歌曲
                List<Song> songs = playlistMapper.getSongsInPlaylist(playlist.getId());
                playlistData.put("songs", songs);

                // 将该歌单的数据添加到总列表中
                allPlaylistsData.add(playlistData);
            }

            // 将所有的歌单信息转换为JSON字符串
            Gson gson = new Gson();
            String json = gson.toJson(allPlaylistsData);
            System.out.println("所有歌单信息：" + json);

            // 将JSON字符串写入响应
            resp.getWriter().write(json);

        } catch (Exception e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }


    public void judgmentFollowUserPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        int userId = (int) Double.parseDouble(data.get("userId").toString());
        int followedId = (int) Double.parseDouble(data.get("followedId").toString());

        System.out.println("判断是否关注了："+followedId);
        boolean isFollowed = playlistMapper.isUserFollowed(userId, followedId);
        sqlSession.commit();
        resp.getWriter().write(gson.toJson(isFollowed));  // 将判断结果返回给前端
    }

    public void FollowUserPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        int userId = (int) Double.parseDouble(data.get("userId").toString());
        int followedId = (int) Double.parseDouble(data.get("followedId").toString());

        System.out.println("关注的："+userId);
        System.out.println("关注用户："+followedId);
        int result = playlistMapper.followUser(userId, followedId);
        sqlSession.commit();
        resp.getWriter().write(String.valueOf(result > 0));  // 将操作结果返回给前端
    }

    public void unfollowUserPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        int userId = (int) Double.parseDouble(data.get("userId").toString());
        int followedId = (int) Double.parseDouble(data.get("followedId").toString());

        System.out.println("用户："+userId);
        System.out.println("取消关注用户："+followedId);
        int result = playlistMapper.unfollowUser(userId, followedId);
        sqlSession.commit();
        resp.getWriter().write(String.valueOf(result > 0));  // 将操作结果返回给前端
    }


    public void getCollectartistPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        System.out.println("获取收藏艺术家的请求："+data);
        int userId = (int) Double.parseDouble(data.get("userId").toString());

        // 获取收藏的艺术家信息
        List<ArtistInfo> artistsInfoList = playlistMapper.getFavoriteArtistsInfoByUserId(userId);

        System.out.println("收藏的艺术家信息：" + artistsInfoList);
        String jsonString = gson.toJson(artistsInfoList);
        sqlSession.commit();
        // 将收藏的艺术家信息返回给前端
        resp.getWriter().write(jsonString);
    }


    public void cancelCollectartistPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setCharacterEncoding("UTF-8");
        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        int userId = (int) Double.parseDouble(data.get("userId").toString());
        int artistId = (int) Double.parseDouble(data.get("artistId").toString());
        System.out.println("取消收藏歌手："+artistId);
        int result = playlistMapper.deleteArtistFromFavorites(userId, artistId);
        sqlSession.commit();
        resp.getWriter().write(String.valueOf(result > 0));
    }

    public void judgmentCollectartistPostPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        int userId = (int) Double.parseDouble(data.get("userId").toString());
        int artistId = (int) Double.parseDouble(data.get("artistId").toString());

        System.out.println("判断是否为收藏的歌手："+artistId);
        // 判断是否已经存在收藏
        boolean isExist = playlistMapper.isArtistFavoriteExist(userId, artistId);
        System.out.println(isExist);
        sqlSession.commit();
        resp.getWriter().write(gson.toJson(isExist));  // 将判断结果返回给前端
    }
    public void collectartistPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        System.out.println("收藏艺术家:"+data);
        int userId = (int) Double.parseDouble(data.get("userId").toString());
        int artistId = (int) Double.parseDouble(data.get("artistId").toString());
        System.out.println("收藏歌手："+artistId);
        // 判断是否已经存在收藏
        boolean isExist = playlistMapper.isFavoriteArtistExist(userId, artistId);
        if(isExist){
            resp.getWriter().write(gson.toJson(false));  // 将操作结果返回给前端
        } else {
            // 保存收藏
            playlistMapper.saveFavoriteArtist(userId, artistId);

            // 提交事务
            sqlSession.commit();
            resp.getWriter().write(gson.toJson(true));  // 将操作结果返回给前端
        }
    }

    protected void getArtistsPlaylistsGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            resp.setCharacterEncoding("UTF-8");
            int artistId = Integer.parseInt(req.getParameter("artistId"));
            System.out.println("artistId:"+artistId);
            // 调用方法获取艺术家的歌单信息
            List<Playlist> artistsPlaylistList = playlistMapper.getPlaylistsCreatedByUser(artistId);

            // 对每个歌单获取歌曲并设置
            for (Playlist playlist : artistsPlaylistList) {
                List<Song> songs = playlistMapper.getSongsInPlaylist(playlist.getId());
                playlist.setSongs(songs);
            }

            // 将艺术家的歌单信息转换为JSON字符串
            Gson gson = new Gson();
            String json = gson.toJson(artistsPlaylistList);
            System.out.println("歌手歌单信息："+json);
            // 将JSON字符串写入响应
            sqlSession.commit();
            resp.getWriter().write(json);
        } catch (Exception e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }



    public void getAllArtistsInfoPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setCharacterEncoding("UTF-8");
        Gson gson = new Gson();

        List<ArtistInfo> artistsInfoList = playlistMapper.getAllArtistsInfo();
        System.out.println("哈哈哈所有歌手信息：" + artistsInfoList);
        String jsonString = gson.toJson(artistsInfoList);

        resp.getWriter().write(jsonString);
    }


    public void cancelCollectPlaylistPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setCharacterEncoding("UTF-8");
        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        System.out.println("收藏:"+data);
        int userId = (int) Double.parseDouble(data.get("userId").toString());
        int playlistId = (int) Double.parseDouble(data.get("playlistId").toString());
        int result = playlistMapper.deleteFromFavorites(userId, playlistId);
        sqlSession.commit();
        resp.getWriter().write(String.valueOf(result > 0));
    }

    public void collectPlaylistPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);



        System.out.println("收藏:"+data);
        int userId = (int) Double.parseDouble(data.get("userId").toString());
        int playlistId = (int) Double.parseDouble(data.get("playlistId").toString());
        // 判断是否已经存在收藏
        boolean isExist = playlistMapper.isFavoriteExist(userId, playlistId);
        if(isExist){
            resp.getWriter().write(gson.toJson(false));  // 将操作结果返回给前端
        }else {
            // 保存收藏
            playlistMapper.saveFavorite(userId, playlistId);

            // 提交事务
            sqlSession.commit();
            resp.getWriter().write(gson.toJson(true));  // 将操作结果返回给前端
        }
    }

    public void judgmentCollectPlaylistPostPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);
        System.out.println("判断:"+data);
        int userId = (int) Double.parseDouble(data.get("userId").toString());
        int playlistId = (int) Double.parseDouble(data.get("playlistId").toString());

        // 判断是否已经存在收藏
        boolean isExist = playlistMapper.isFavoriteExist(userId, playlistId);

        resp.getWriter().write(gson.toJson(isExist));  // 将判断结果返回给前端
    }


    public void getFourPlistPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);
        System.out.println("data:"+data);
        int  userId  = (int) Double.parseDouble(data.get("userId").toString());
        List<Playlist> playlists = playlistMapper.getFourPlaylistsExcludeCreator(userId);
        if (playlists == null || playlists.size() == 0) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String json = new Gson().toJson(playlists);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }
/*public void getFourPlistPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    resp.setCharacterEncoding("UTF-8");

    int userId = Integer.parseInt(req.getParameter("userId"));
    List<Playlist> playlists = playlistMapper.getFourPlaylistsExcludeCreator(userId);
    if (playlists == null || playlists.size() == 0) {
        resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        return;
    }

    String json = new Gson().toJson(playlists);
    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");
    resp.getWriter().write(json);
}*/

    public void updateSongTimesPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        System.out.println("data:" + data);
        // 从 Map 中获取 id 参数，并转化为 Double
        double songIdDouble = Double.parseDouble(data.get("id").toString());

        // 将 songIdDouble 转换为整数类型，只取整数部分
        int songId = (int) songIdDouble;

        System.out.println(songId);

        boolean success = false;
        int retryTimes = 3;  // 设置最大重试次数

        // 尝试更新，如果失败则重试
        while (retryTimes-- > 0) {
            // 获取歌曲的当前版本
            int version = playlistMapper.selectSongVersion(songId);

            System.out.println("version：" + version);
            // 创建一个Map来保存更新操作所需的参数
            Map<String, Object> params = new HashMap<>();
            params.put("songId", songId);
            params.put("version", version);

            // 使用新的参数执行更新操作
            success = playlistMapper.incrementSongPlayCount(params);

            sqlSession.commit();

            // 如果更新成功，就跳出循环
            if (success) {
                break;
            }
        }

        resp.getWriter().write(gson.toJson(success));  // 将操作结果返回给前端
    }


    public void updatePlaylistTimesPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");

        // 创建 Gson 对象
        Gson gson = new Gson();

        // 将请求主体转化为 Map 对象
        Map<String, Object> data = gson.fromJson(req.getReader(), Map.class);

        System.out.println("data:" + data);
        // 从 Map 中获取 playlistId 参数，并转化为 Double
        double playlistIdDouble = Double.parseDouble(data.get("playlistId").toString());

        // 将 playlistIdDouble 转换为整数类型，只取整数部分
        int playlistId = (int) playlistIdDouble;

        System.out.println(playlistId);

        boolean success = false;
        int retryTimes = 3;  // 设置最大重试次数

        // 尝试更新，如果失败则重试
        while (retryTimes-- > 0) {
            // 获取播放列表的当前版本
            int version = playlistMapper.selectVersion(playlistId);

            System.out.println("version：" + version);
            // 创建一个Map来保存更新操作所需的参数
            Map<String, Object> params = new HashMap<>();
            params.put("playlistId", playlistId);
            params.put("version", version);

            // 使用新的参数执行更新操作
            success = playlistMapper.incrementPlayCount(params);

            sqlSession.commit();

            // 如果更新成功，就跳出循环
            if (success) {
                break;
            }
        }

        resp.getWriter().write(gson.toJson(success));  // 将操作结果返回给前端
    }

    public void getPlayLogsGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        int userId = Integer.parseInt(req.getParameter("userId"));  // 获取 userId 参数
        System.out.println("好好好好好好好："+userId);

        List<PlayLog> playLogs = playlistMapper.getPlayLogsByUserId(userId);  // 从数据库中获取播放记录
        System.out.println("777777："+playLogs);
        // 对每一条播放记录进行处理
        for (PlayLog playLog : playLogs) {
            // 从数据库中根据 song_id 获取歌曲信息
            Song song = playlistMapper.getSongById(playLog.getSong_id());
            System.out.println("8888888:"+song);
            playLog.setSongs(song);  // 将歌曲信息设置到播放记录中
        }

        Gson gson = new Gson();
        System.out.println("获取到的播放列表："+playLogs);
        resp.getWriter().write(gson.toJson(playLogs));  // 将播放记录列表转换为 JSON 格式并返回

    }



/*

    protected void songGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 在这里处理获取歌曲请求
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
*/

/*    public void savePlayLogsPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            String json = sb.toString();
            System.out.println("最近播放："+json);
            Gson gson = new Gson();

            // 将整个 JSON 对象解析为一个 Map
            Type type = new TypeToken<Map<String, Object>>(){}.getType();
            Map<String, Object> map = gson.fromJson(json, type);
            System.out.println("播放列表："+map);
            // 取出 "user_id" 键对应的值，并将其转换为 int 类型
            double userIdDouble = (Double) map.get("user_id");
            int userId = (int) userIdDouble;
            // 删除这个用户的所有播放记录
            playlistMapper.deletePlayLogsByUserId(userId);

            // 取出 "playLogs" 键对应的值，并将其解析为一个 List<PlayLog>
            String playLogsString = (String) map.get("playLogs");
            Type playLogListType = new TypeToken<List<PlayLog>>(){}.getType();
            List<PlayLog> playLogs = gson.fromJson(playLogsString, playLogListType);

            savePlayLogs(playLogs);
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            e.printStackTrace();
        }
    }*/


/*    public void savePlayLogs(List<PlayLog> playLogs) {
        for (PlayLog playLog : playLogs) {
            System.out.println(" playLog.getPlayTime:"+ playLog.getPlay_time());
            playlistMapper.savePlayLog(playLog.getUser_id(), playLog.getSong_id(), playLog.getPlay_time());
        }
        sqlSession.commit();
    }*/

    public void playlistGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int userId = Integer.parseInt(req.getParameter("userId"));
        String name = "我的喜欢";
        System.out.println("我的喜欢列表:"+userId);
        Playlist playlist = playlistMapper.getPlaylistByNameAndUserId(userId, name);
        System.out.println("获取的playlist："+playlist);
        if (playlist == null) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String json = new Gson().toJson(playlist);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }


    public void addToPlaylistPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        // 获取请求参数
        String playlistIdParam = req.getParameter("playlistId");
        String songIdParam = req.getParameter("songId");
        System.out.println("playlistIdParam："+playlistIdParam);
        System.out.println("songIdParam："+songIdParam);

        // 将参数转换成整数（如果是整数类型的参数）
        int playlistId = Integer.parseInt(playlistIdParam);
        int songId = Integer.parseInt(songIdParam);

        // 添加歌曲到歌单
        try {
            playlistMapper.addSongToPlaylist(playlistId,songId);
            sqlSession.commit();

            // 设置响应
            res.setContentType("application/json");
            res.setCharacterEncoding("UTF-8");
            PrintWriter out = res.getWriter();
            out.print("{\"status\":\"success\"}");
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    // 处理删除歌单中歌曲的请求
    protected void deleteSongFromPlaylistPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String playlistIdParam = req.getParameter("playlistId");
        String songIdParam = req.getParameter("songId");

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        JSONObject responseJson = new JSONObject();

        if (playlistIdParam == null || songIdParam == null) {
            responseJson.put("success", false);
            out.print(responseJson);
            return;
        }

        int playlistId, songId;
        try {
            playlistId = Integer.parseInt(playlistIdParam);
            songId = Integer.parseInt(songIdParam);
        } catch (NumberFormatException e) {
            responseJson.put("success", false);
            out.print(responseJson);
            return;
        }

        // 调用mapper方法删除歌单中的歌曲
        try {
            playlistMapper.removeSongFromPlaylist(playlistId, songId);
            sqlSession.commit();
            responseJson.put("success", true);
        } catch (Exception e) {
            responseJson.put("success", false);
        }

        out.print(responseJson);
    }

    public void deletePlaylistPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 从请求中获取要删除的歌单的 ID
        int playlistId = Integer.parseInt(req.getParameter("playlistId"));
        System.out.println("歌单ID："+playlistId);
        try {
            // 首先，删除歌单与所有歌曲的关联
            playlistMapper.removeSongsFromPlaylist(playlistId);
            // 然后，删除歌单本身
            playlistMapper.deletePlaylist(playlistId);
            // 提交事务
            sqlSession.commit();

            // 返回删除成功的信息
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write(new Gson().toJson("删除成功"));
        } catch (Exception e) {
            // 如果删除过程中出现错误，返回错误信息
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write(new Gson().toJson("删除失败"));
        }
    }

    public void playlistInfoByplistIdGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("信息是什么："+req);
        System.out.println(req.getParameter("playlistId"));
        // 从请求中获取歌单 ID
        int playlistId = Integer.parseInt(req.getParameter("playlistId"));

        // 创建一个Map来存放歌单信息
        Map<String, Object> playlistInfo = new HashMap<>();

        try {
            // 从数据库获取歌单信息
            Playlist playlist = playlistMapper.getPlaylistById(playlistId);

            if (playlist == null) {
                throw new Exception("歌单不存在");
            }

            // 将歌单信息添加到Map中
            playlistInfo.put("playlist", playlist);

            // 从数据库获取创建歌单的用户信息
            User creator = userMapper.getUserById(playlist.getCreator());

            // 将用户信息添加到Map中
            playlistInfo.put("creator", creator);

            // 设置返回的数据类型为json，并编码为UTF-8
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");

            // 将Map转换为Json字符串并写入响应
            resp.getWriter().write(new Gson().toJson(playlistInfo));
        } catch (Exception e) {
            // 如果出现错误，返回错误信息
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write(new Gson().toJson(e.getMessage()));
        }
    }


    public void collectPlaylistsCreatedByUserGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int userId = Integer.parseInt(req.getParameter("userId"));
        List<Playlist> playlists = playlistMapper.getPlaylistsCollectedByUser(userId);
        System.out.println("收藏的播放列表：" + playlists);
        String json = new Gson().toJson(playlists);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }

    public void playlistsCreatedByUserGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int userId = Integer.parseInt(req.getParameter("userId"));
        List<Playlist> playlists = playlistMapper.getPlaylistsCreatedByUser(userId);
        System.out.println("刘洋666666666666："+playlists);
        String json = new Gson().toJson(playlists);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }



    protected void playlistPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(reader, new TypeToken<Map<String, Object>>() {
        }.getType());
        System.out.println("map："+map);
        double userIdDouble = (Double) map.get("userId");
        int userId = (int) userIdDouble;
        String name = (String) map.get("name");
        String avatar = "我的喜欢.png";
        System.out.println("设置里面三大石窟大理石的");
        Playlist playlist = createPlaylist(userId, name,avatar);

        String json = new Gson().toJson(playlist);
        System.out.println("飒飒萨达撒："+json);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }

    protected void playlist_songPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(reader, new TypeToken<Map<String, Object>>() {}.getType());
        System.out.println("map:"+map);
        int playlistId = ((Double) map.get("playlistId")).intValue();
        int songId = ((Double) map.get("songId")).intValue();
        addSongToPlaylist(playlistId, songId);
    }

    protected void playlist_songDeletePost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int playlistId = Integer.parseInt(req.getParameter("playlistId"));
        int songId = Integer.parseInt(req.getParameter("songId"));
        removeSongFromPlaylist(playlistId, songId);
    }

    public void checkSongInMyFavoritesGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String name = req.getParameter("name");
        int userId = Integer.parseInt(req.getParameter("userId"));
        int songId = Integer.parseInt(req.getParameter("songId"));

        boolean isInFavorites = isSongInMyFavorites(name, userId, songId);

        System.out.println("isInFavorites:"+isInFavorites);
        String json = new Gson().toJson(isInFavorites);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }
    protected void playlistInfoPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(reader, new TypeToken<Map<String, Object>>() {}.getType());
        System.out.println("lnfo map:"+map);

        Object userIdObj = map.get("userId");
        int userId=0;
        if (userIdObj instanceof Double) {
            userId = ((Double) userIdObj).intValue();
        } else if (userIdObj instanceof String) {
            userId = Integer.parseInt((String) userIdObj);
        }
        String name = (String) map.get("name");
        String avatar = "默认头像.png";
        Playlist playlist = playlistMapper.getPlaylistByNameAndUserId(userId, name);
        if (playlist == null) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        User creator = userMapper.getUserById(playlist.getCreator());
        System.out.println("creator："+creator);

        System.out.println(playlist.getCreatorTime());

        // 创建一个新的 map 来存储 playlist 和 creator 的信息
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("playlist", playlist);
        responseMap.put("creator", creator);

        String json = new Gson().toJson(responseMap);

        System.out.println(json);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }

/*

    protected void playlistInfoPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(reader, new TypeToken<Map<String, Object>>() {
        }.getType());
        System.out.println("lnfo map:"+map);

        Object userIdObj = map.get("userId");
        int userId=0;
        if (userIdObj instanceof Double) {
            userId = ((Double) userIdObj).intValue();
        } else if (userIdObj instanceof String) {
            userId = Integer.parseInt((String) userIdObj);
        }
        String name = (String) map.get("name");

        Playlist playlist = playlistMapper.getPlaylistByNameAndUserId(userId, name);
        if (playlist == null) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        playlist.getCreator();
        System.out.println(playlist.getCreatorTime());
        String json = new Gson().toJson(playlist);
        System.out.println(json);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }
*/

/*
    protected void playlistInfoPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(reader, new TypeToken<Map<String, Object>>() {
        }.getType());
        int userId = ((Double) map.get("userId")).intValue();
        String name = (String) map.get("name");

        Playlist playlist = playlistMapper.getPlaylistByNameAndUserId(userId, name);
        if (playlist == null) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        List<Song> songs = playlistMapper.getSongsInPlaylist(playlist.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("playlist", playlist);
        result.put("songs", songs);

        String json = new Gson().toJson(result);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }
*/

    public void playlist_songsPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        Gson gson = new Gson();
        Map<String, Object> map = gson.fromJson(reader, new TypeToken<Map<String, Object>>() {}.getType());
        System.out.println("songs map:"+map);
        int playlistId = ((Double) map.get("playlistId")).intValue();

        List<Song> songs = getSongsInPlaylist(playlistId);

        String json = new Gson().toJson(songs);
        System.out.println(json);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(json);
    }

    protected void createdPlaylistLnfoPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");

        String name = req.getParameter("name");  // 获取歌单名
        int creator = Integer.parseInt(req.getParameter("creator"));  // 获取创建者ID

        Part avatarPart = req.getPart("avatar");  // 获取头像文件
        String avatar = null;

        System.out.println("avatarPart："+avatarPart);
        System.out.println("6："+ req.getParts());
        System.out.println("7:"+avatarPart.getSize());
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


        System.out.println(avatar);

        Playlist newPlaylist = new Playlist();
        newPlaylist.setCreator(creator);
        newPlaylist.setName(name);
        newPlaylist.setAvatar(avatar);

        playlistMapper.createPlaylist1(newPlaylist);
        sqlSession.commit();  // 提交事务，使插入操作生效
        int newPlaylistId = newPlaylist.getId();  // 获取新创建的歌单的 ID


        System.out.println("newPlaylistId："+newPlaylistId);
        System.out.println(newPlaylist);

        // 查询歌单中的歌曲数量，假设 playlistMapper.getSongCount() 方法存在，返回一个 int 值
        int songCount = playlistMapper.getSongCountInPlaylist(newPlaylistId);

        // 更新 Playlist 对象的 songCount 属性
        newPlaylist.setSongCount(songCount);

        // 设置响应内容
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // 使用 Gson 库将 Playlist 对象转换为 JSON 字符串
        Gson gson = new Gson();
        String json = gson.toJson(newPlaylist);

        resp.getWriter().write(json);  // 响应歌单信息
    }

    protected void editPlaylistLnfoPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        Gson gson = new Gson();
        String json = null;

        try {
            // 读取参数
            String name = req.getParameter("name");
            String idString = req.getParameter("playlistId");
            String tags= req.getParameter("tags");

            int id = Integer.parseInt(idString);

            // 获取头像文件
            Part avatarPart = req.getPart("avatar");  // 获取头像文件
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
                            Files.copy(input, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                        }
                        avatar = fileName;
                    } else {
                        avatar = fileName;
                        System.out.println("文件重复.");
                    }
                }
            }

            // 更新歌单信息
            playlistMapper.updatePlaylist(id, name, avatar,tags);
            sqlSession.commit();

            // 获取更新后的歌单信息
            Playlist updatedPlaylist = playlistMapper.getPlaylistById(id);

            json = gson.toJson(updatedPlaylist);

        } catch (Exception e) {

        }
        // 响应结果
        resp.getWriter().write(json);
    }


    public List<Song> getSongsInPlaylist(int playlistId) {
        return playlistMapper.getSongsInPlaylist(playlistId);
    }


    public Playlist getPlaylistByUserId(int userId,String name) {
        return playlistMapper.getPlaylistByUserId(userId,name);
    }

    public Playlist createPlaylist(int userId, String name,String avatar) {
        playlistMapper.createPlaylist(userId, name,avatar);
        sqlSession.commit();  // 提交事务
        return getPlaylistByUserId(userId, name);
    }

    public void addSongToPlaylist(int playlistId, int songId) {
        playlistMapper.addSongToPlaylist(playlistId, songId);
        sqlSession.commit();  // 提交事务
    }

    public void removeSongFromPlaylist(int playlistId, int songId) {
        playlistMapper.removeSongFromPlaylist(playlistId, songId);
        sqlSession.commit();  // 提交事务
    }

    public boolean isSongInMyFavorites(String name, int userId, int songId) {
        int playlistId = playlistMapper.getPlaylistId(name, userId);
        int count = playlistMapper.getSongInPlaylist(playlistId, songId);
        return count > 0;
    }

}