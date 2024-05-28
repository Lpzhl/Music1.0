package com.music.mapper;

import com.music.app.*;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface SearchMapper {

    List<Song> searchSongs(String keyword);

    List<ArtistInfo> searchArtists(String keyword);

    List<Playlist> searchPlaylists(String keyword);

    List<User> searchUsers(String keyword);
    List<User> getFollowedUsers(int userId);
    List<User> getFollowersUsers(int userId);

    int saveUserPost(UserPost userPost);  // 返回值是受影响的行数，你可以根据自己的需要更改
    int savePostImage(PostImage postImage);


    List<UserPost> getFollowedUsersPosts(int userId);
    List<PostImage> getImagesForPost(int postId);

    void deleteImagesByPostId(int postId);  // 删除指定 post_id 的所有图片
    void deleteUserPostById(int postId);    // 删除指定 post_id 的动态
}
