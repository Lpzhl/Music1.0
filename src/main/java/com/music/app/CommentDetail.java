package com.music.app;

import java.util.Date;

public class CommentDetail {
    private Integer id;
    private Integer userId;
    private String content;
    private Date commentTime;
    private String username;
    private String email;
    private String nickname;
    private String avatar;
    private String userType;
    private Integer parentId;
    private Integer topLevelCommentId;


    public CommentDetail() {
    }

    public CommentDetail(Integer id, Integer userId, String content, Date commentTime, String username, String email, String nickname, String avatar, String userType, Integer parentId, Integer topLevelCommentId) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.commentTime = commentTime;
        this.username = username;
        this.email = email;
        this.nickname = nickname;
        this.avatar = avatar;
        this.userType = userType;
        this.parentId = parentId;
        this.topLevelCommentId = topLevelCommentId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
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

    @Override
    public String toString() {
        return "CommentDetail{" +
                "id=" + id +
                ", userId=" + userId +
                ", content='" + content + '\'' +
                ", commentTime=" + commentTime +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", nickname='" + nickname + '\'' +
                ", avatar='" + avatar + '\'' +
                ", userType='" + userType + '\'' +
                ", parentId=" + parentId +
                ", topLevelCommentId=" + topLevelCommentId +
                '}';
    }
}
