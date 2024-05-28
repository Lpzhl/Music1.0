package com.music.mapper;

import com.music.app.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ManageMapper {

    int updateUserAccountStatus(@Param("user") User user);
    List<String> getAllWords();

    int addWord(String word);

    int removeWord(String word);

    List<String> getAlltags();

    List<User> getAllUsers();

    void addTag(@Param("tag") String tag);

    void deleteTag(@Param("tag") String tag);


    void promoteUserToAdmin(@Param("userId") int userId);
    void demoteAdminToUser(@Param("userId") int userId);
}
