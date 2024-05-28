package com.music.mapper;

import com.music.app.Comment1;
import com.music.app.CommentDetail;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface LikesMapper {
    int insertLikeForPost(@Param("userId") int userId, @Param("postId") int postId);
    int deleteLikeForPost(@Param("userId") int userId, @Param("postId") int postId);

    int getTotalLikesForPost(@Param("postId") int postId);


    int hasUserLikedPost(@Param("userId") int userId, @Param("postId") int postId);

    int insertComment(Comment1 comment);

    List<CommentDetail> getPostCommentsWithUserDetails(@Param("postId")  Integer postId);
    int getCommentCountByPostId(int postId);
}
