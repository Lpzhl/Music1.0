package com.music.app;

import java.sql.Timestamp;
import java.util.List;

public class UserPost {
    private int  post_id;
    private int user_id;
    private String content;
    private Timestamp post_time;
    private int song_id;
    private int playlist_id;

    public User users;
    private List<PostImage> images;

    private Song songs;
    private Playlist playlists;

    private int TotalLikes;

    public int getTotalLikes() {
        return TotalLikes;
    }

    public void setTotalLikes(int totalLikes) {
        TotalLikes = totalLikes;
    }

    public int getPost_id() {
        return post_id;
    }

    public void setPost_id(int post_id) {
        this.post_id = post_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getPost_time() {
        return post_time;
    }

    public void setPost_time(Timestamp post_time) {
        this.post_time = post_time;
    }

    public int getSong_id() {
        return song_id;
    }

    public void setSong_id(int song_id) {
        this.song_id = song_id;
    }

    public int getPlaylist_id() {
        return playlist_id;
    }

    public void setPlaylist_id(int playlist_id) {
        this.playlist_id = playlist_id;
    }

    public User getUsers() {
        return users;
    }

    public void setUsers(User users) {
        this.users = users;
    }

    public List<PostImage> getImages() {
        return images;
    }

    public void setImages(List<PostImage> images) {
        this.images = images;
    }

    public Song getSongs() {
        return songs;
    }

    public void setSongs(Song songs) {
        this.songs = songs;
    }

    public Playlist getPlaylists() {
        return playlists;
    }

    public void setPlaylists(Playlist playlists) {
        this.playlists = playlists;
    }

    @Override
    public String toString() {
        return "UserPost{" +
                "post_id=" + post_id +
                ", user_id=" + user_id +
                ", content='" + content + '\'' +
                ", post_time=" + post_time +
                ", song_id=" + song_id +
                ", playlist_id=" + playlist_id +
                ", users=" + users +
                ", images=" + images +
                ", songs=" + songs +
                ", playlists=" + playlists +
                ", TotalLikes=" + TotalLikes +
                '}';
    }
}
