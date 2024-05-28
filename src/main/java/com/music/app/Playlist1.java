package com.music.app;


import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;

public class Playlist1 {
    private int playlist_id;
    private int playlist_creator;
    private String playlist_name;
    private String playlist_avatar;
    private String playlist_created_time;
    private String playlist_tags;
    private int playlist_songCount;  // 歌单中歌曲的数量
    private int playlist_version;// 版本号用于更新


    public int getPlaylist_id() {
        return playlist_id;
    }

    public void setPlaylist_id(int playlist_id) {
        this.playlist_id = playlist_id;
    }

    public int getPlaylist_creator() {
        return playlist_creator;
    }

    public void setPlaylist_creator(int playlist_creator) {
        this.playlist_creator = playlist_creator;
    }

    public String getPlaylist_name() {
        return playlist_name;
    }

    public void setPlaylist_name(String playlist_name) {
        this.playlist_name = playlist_name;
    }

    public String getPlaylist_avatar() {
        return playlist_avatar;
    }

    public void setPlaylist_avatar(String playlist_avatar) {
        this.playlist_avatar = playlist_avatar;
    }

    public String getPlaylist_created_time() {
        return playlist_created_time;
    }

    public void setPlaylist_created_time(String playlist_created_time) {
        this.playlist_created_time = playlist_created_time;
    }

    public String getPlaylist_tags() {
        return playlist_tags;
    }

    public void setPlaylist_tags(String playlist_tags) {
        this.playlist_tags = playlist_tags;
    }

    public int getPlaylist_songCount() {
        return playlist_songCount;
    }

    public void setPlaylist_songCount(int playlist_songCount) {
        this.playlist_songCount = playlist_songCount;
    }

    public int getPlaylist_version() {
        return playlist_version;
    }

    public void setPlaylist_version(int playlist_version) {
        this.playlist_version = playlist_version;
    }

    @Override
    public String toString() {
        return "Playlist1{" +
                "playlist_id=" + playlist_id +
                ", playlist_creator=" + playlist_creator +
                ", playlist_name='" + playlist_name + '\'' +
                ", playlist_avatar='" + playlist_avatar + '\'' +
                ", playlist_created_time='" + playlist_created_time + '\'' +
                ", playlist_tags='" + playlist_tags + '\'' +
                ", playlist_songCount=" + playlist_songCount +
                ", playlist_version=" + playlist_version +
                '}';
    }
}
