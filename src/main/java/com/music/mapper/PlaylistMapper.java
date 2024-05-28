package com.music.mapper;

import com.music.app.*;
import org.apache.ibatis.annotations.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface PlaylistMapper {

    List<Integer> getUserPlayedSongIds(int userId);
    int followUser(@Param("followerId") int followerId, @Param("followedId") int followedId);
    int unfollowUser(@Param("followerId") int followerId, @Param("followedId") int followedId);
    boolean isUserFollowed(@Param("followerId") int followerId, @Param("followedId") int followedId);

    List<ArtistInfo> getFavoriteArtistsInfoByUserId(@Param("userId") int userId);
    List<SongWithArtistDetails> getAllSongsInfo();
    List<Song> getAllSongsByArtist(int artist_id);
    List<ArtistInfo> getAllArtistsInfo();

    boolean isFavoriteArtistExist(@Param("userId") int userId, @Param("artistId") int artistId);
    void saveFavoriteArtist(@Param("userId") int userId, @Param("artistId") int artistId);

    int deleteArtistFromFavorites(@Param("userId") int userId, @Param("artistId") int artistId);
    boolean isArtistFavoriteExist(@Param("userId") int userId, @Param("artistId") int artistId);

    int deleteFromFavorites(@Param("userId") int userId, @Param("playlistId") int playlistId);
    List<Playlist> getPlaylistsCollectedByUser(@Param("userId") int userId);
    boolean isFavoriteExist(@Param("userId") int userId, @Param("playlistId") int playlistId);
    void saveFavorite(@Param("userId") int userId, @Param("playlistId") int playlistId);
    Playlist getPlaylistByUserId(@Param("userId") int userId,@Param("name") String name);
    /*Playlist createPlaylist1(@Param("creator") int userId, @Param("name") String name, @Param("avatar") String avatar);*/
    void addSongToPlaylist(@Param("playlistId") int playlistId, @Param("songId") int songId);
    void removeSongFromPlaylist(@Param("playlistId") int playlistId, @Param("songId") int songId);
    int getPlaylistId(@Param("name") String name, @Param("userId") int userId);
    int getSongInPlaylist(@Param("playlistId") int playlistId, @Param("songId") int songId);
    List<Song> getSongsInPlaylist(@Param("playlistId") int playlistId);
    Playlist getPlaylistByNameAndUserId(@Param("userId") int userId, @Param("name") String name);
    Playlist getPlaylistByNameAndUserId1(@Param("userId") int userId, @Param("name") String name, @Param("avatar") String avatar);
    List<Playlist> getPlaylistsCreatedByUser(@Param("userId") int userId);
    int getSongCountInPlaylist(@Param("playlistId") int playlistId);
    void createPlaylist(@Param("creator") int userId, @Param("name") String name, @Param("avatar") String avatar);  // 添加头像文件名参数
    void deletePlaylist(@Param("playlistId") int playlistId);
    void removeSongsFromPlaylist(@Param("playlistId") int playlistId);
    void createPlaylist1(@Param("playlist") Playlist playlist);
    Playlist getPlaylistById(@Param("id") int id);
    void updatePlaylist(@Param("id") int id, @Param("name") String name, @Param("avatar") String avatar,@Param("tags") String tags);
    void savePlayLog(@Param("userId") int userId, @Param("songId") int songId, @Param("playTime") Date playTime);
    List<PlayLog> getPlayLogsByUserId(@Param("userId") int userId);
    void deletePlayLogsByUserId(@Param("userId") int userId);
    Song getSongById(@Param("id") int id);

    List<Playlist> getAllPlaylistsExcept(String name);

    // 为歌单增加播放次数
    boolean incrementPlayCount(Map<String, Object> params);

    // 获取歌单的当前版本
    int selectVersion(int playlistId);

    // 为歌曲增加播放次数
    boolean incrementSongPlayCount(Map<String, Object> params);

    // 获取歌曲的当前版本
    int selectSongVersion(int songId);

    List<Playlist> getFourPlaylistsExcludeCreator(@Param("userId") int userId);

}

