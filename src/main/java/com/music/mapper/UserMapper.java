package com.music.mapper;

import com.music.app.*;
import com.music.mapper.UserMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface UserMapper {
    UserInterest getUserInterestByUserId(int userId);
    UserInterest getUserInterest(@Param("user_id") int userId, @Param("song_id") int songId);

    void insertUserInterest(UserInterest userInterest);

    void updateUserInterest(UserInterest userInterest);

    String getSongFilePathById(Integer songId);
    String getAvatarPathById(Integer songId);
    String getLyricPathById(Integer songId);
    void insertAuthenticationInfo(AuthenticationInfo authenticationInfo);
    AuthenticationInfo getAuthenticationInfoById(int id);
    void insertArtist(Artist artist);
    void updateAuthStatus(@Param("id") int id, @Param("auth_status")int auth_status);

    void updateUserArtistDetails(User user);
    List<AuthenticationInfo> getAuthenticationRecords(int userId);

    List<AuthenticationInfo> getAllPendingAuthenticationRecords();
    // 一定要对应id
    List<User> selectAll();

    User getUserByUsername(String username);
    User getUserByUsername1(String username);
    List<Song> selectSongs();

    void updateUser(@Param("id") int id, @Param("nickname") String nickname, @Param("avatar") String avatar);

    User getUserById(@Param("id") int id);
    // 添加新的方法
    int getFollowerCount(@Param("userId") int userId);

    int getFollowingCount(@Param("userId") int userId);
}
