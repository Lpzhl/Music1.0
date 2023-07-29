package com.music.mapper;

import com.music.app.Song;
import com.music.app.User;
import com.music.mapper.UserMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface UserMapper {

    // 一定要对应id
    List<User> selectAll();

    User getUserByUsername(String username);

    List<Song> selectSongs();

    void updateUser(@Param("id") int id, @Param("nickname") String nickname, @Param("avatar") String avatar);

    User getUserById(@Param("id") int id);
    // 添加新的方法
    int getFollowerCount(@Param("userId") int userId);

    int getFollowingCount(@Param("userId") int userId);
}
