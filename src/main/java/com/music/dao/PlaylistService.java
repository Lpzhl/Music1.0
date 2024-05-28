/*package com.music.servlet;

import com.music.mapper.PlaylistMapper;
import com.music.app.Playlist;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;


public class PlaylistService {

    // 定义一个PlaylistMapper对象，用于与数据库进行交互
    private PlaylistMapper playlistMapper;

    // 在构造方法中，初始化PlaylistMapper对象
    public PlaylistService() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        this.playlistMapper = sqlSession.getMapper(PlaylistMapper.class);
    }

    // 根据用户ID获取对应的播放列表
    public Playlist getPlaylistByUserId(int userId) {
        return playlistMapper.getPlaylistByUserId(userId);
    }

    // 根据用户ID和名称创建新的播放列表，并返回新创建的播放列表
    public Playlist createPlaylist(int userId, String name) {
        playlistMapper.createPlaylist(userId, name);
        return getPlaylistByUserId(userId);
    }

    // 将歌曲添加到播放列表中
    public void addSongToPlaylist(int playlistId, int songId) {
        playlistMapper.addSongToPlaylist(playlistId, songId);
    }

    // 从播放列表中移除歌曲
    public void removeSongFromPlaylist(int playlistId, int songId) {
        playlistMapper.removeSongFromPlaylist(playlistId, songId);
    }
}*/