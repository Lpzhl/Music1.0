package com.music.mapper;

import com.music.app.Song;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UploadedmusicMapper {

/*    int insertSong(
            @Param("name") String name,
            @Param("artist") String artist,
            @Param("filepath") String filepath,
            @Param("lyric") String lyric,
            @Param("avatar") String avatar,
            @Param("status") String status,
            @Param("artist_id") int artist_id,
    );*/

    int insertSong(Song song);

    List<Song> getSongsWithStatusReviewing();

    Integer findSongByUserAndFilename(@Param("songFileName") String songFileName, @Param("userId") int userId);

    Song getSongById(int id);
    List<Song> getSongsByUserId(@Param("userId") int userId);
    // 根据songId更新歌曲的状态为"已通过"
    void updateSongStatusToAccepted(@Param("songId") int songId);

    // 添加获取标签ID的方法
    int getTagIdByName(String tagName);

    /*void insertSong( String songName, String artistName, String songFile, String lyricFile, String avatarFile, String status, int userId);*/
}
