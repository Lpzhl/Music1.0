package com.music.mapper;

import com.music.app.Comment;

import java.util.List;

public interface CommentMapper {
    void insertComment(Comment comment);
    List<Comment> fetchCommentsForPlaylist(int playlistId);
}
