package com.music.app;



import java.util.Date;

public class Comment1 {
    private int id;
    private int userId;
    private Integer parentId; // 可能为null
    private Integer topLevelCommentId; // 可能为null
    private Integer playlistId; // 可能为null
    private Integer songId; // 可能为null
    private int userPostsId;
    private String content;
    private Date commentTime;


    public Comment1() {
    }

    public Comment1(int id, int userId, Integer parentId, Integer topLevelCommentId, Integer playlistId, Integer songId, int userPostsId, String content, Date commentTime) {
        this.id = id;
        this.userId = userId;
        this.parentId = parentId;
        this.topLevelCommentId = topLevelCommentId;
        this.playlistId = playlistId;
        this.songId = songId;
        this.userPostsId = userPostsId;
        this.content = content;
        this.commentTime = commentTime;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Integer getTopLevelCommentId() {
        return topLevelCommentId;
    }

    public void setTopLevelCommentId(Integer topLevelCommentId) {
        this.topLevelCommentId = topLevelCommentId;
    }

    public Integer getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(Integer playlistId) {
        this.playlistId = playlistId;
    }

    public Integer getSongId() {
        return songId;
    }

    public void setSongId(Integer songId) {
        this.songId = songId;
    }

    public int getUserPostsId() {
        return userPostsId;
    }

    public void setUserPostsId(int userPostsId) {
        this.userPostsId = userPostsId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCommentTime() {
        return commentTime;
    }

    public void setCommentTime(Date commentTime) {
        this.commentTime = commentTime;
    }

    @Override
    public String toString() {
        return "Comment1{" +
                "id=" + id +
                ", userId=" + userId +
                ", parentId=" + parentId +
                ", topLevelCommentId=" + topLevelCommentId +
                ", playlistId=" + playlistId +
                ", songId=" + songId +
                ", userPostsId=" + userPostsId +
                ", content='" + content + '\'' +
                ", commentTime=" + commentTime +
                '}';
    }
}
