package com.music.app;

import java.util.Date;

public class Comment {
    private int id;
    private Integer parent_id;  // 使用 Integer 可以处理 null 值
    private int user_id;
    private Integer playlist_id;  // 使用 Integer 可以处理 null 值
    private Integer song_id;      // 使用 Integer 可以处理 null 值
    private String content;
    private Date comment_time;
    private User user;
    private String nickname;
    private String avatar;
    private User parent;

    public User getParent() {
        return parent;
    }

    public void setParent(User parent) {
        this.parent = parent;
    }

    // Getters 和 Setters
    public int getId() {
        return id;
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

    public void setId(int id) {
        this.id = id;
    }

    public Integer getParent_id() {
        return parent_id;
    }

    public void setParent_id(Integer parent_id) {
        this.parent_id = parent_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public Integer getPlaylist_id() {
        return playlist_id;
    }

    public void setPlaylist_id(Integer playlist_id) {
        this.playlist_id = playlist_id;
    }

    public Integer getSong_id() {
        return song_id;
    }

    public void setSong_id(Integer song_id) {
        this.song_id = song_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getComment_time() {
        return comment_time;
    }

    public void setComment_time(Date comment_time) {
        this.comment_time = comment_time;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", parent_id=" + parent_id +
                ", user_id=" + user_id +
                ", playlist_id=" + playlist_id +
                ", song_id=" + song_id +
                ", content='" + content + '\'' +
                ", comment_time=" + comment_time +
                ", user=" + user +
                ", nickname='" + nickname + '\'' +
                ", avatar='" + avatar + '\'' +
                ", parent=" + parent +
                '}';
    }
}
