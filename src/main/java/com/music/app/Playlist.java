package com.music.app;


import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;

public class Playlist {
    private int id;
    private int creator;
    private String name;
    private String avatar;
    private String created_time;
    private String tags;
    private int songCount;  // 歌单中歌曲的数量
    private int version;// 版本号用于更新
    private List<Song> songs;


    public List<Song> getSongs() {
        return songs;
    }

    public void setSongs(List<Song> songs) {
        this.songs = songs;
    }

    public int getPlay_count() {
        return play_count;
    }

    public void setPlay_count(int play_count) {
        this.play_count = play_count;
    }

    private int play_count;

    public String getCreated_time() {
        return created_time;
    }

    public void setCreated_time(String created_time) {
        this.created_time = created_time;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        System.out.println("Setting creator time: " + id);
        this.id = id;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public int getCreator() {
        return creator;
    }

    public void setCreator(int creator) {
        this.creator = creator;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreatorTime() {
        return created_time;
    }
    public void setCreatorTime(Timestamp creatorTime) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");;
        this.created_time = sdf.format(created_time);
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public int getSongCount() {
        return songCount;
    }

    public void setSongCount(int songCount) {
        this.songCount = songCount;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    @Override
    public String toString() {
        return "Playlist{" +
                "id=" + id +
                ", creator=" + creator +
                ", name='" + name + '\'' +
                ", avatar='" + avatar + '\'' +
                ", created_time='" + created_time + '\'' +
                ", tags='" + tags + '\'' +
                ", songCount=" + songCount +
                ", version=" + version +
                ", songs=" + songs +
                ", play_count=" + play_count +
                '}';
    }
}
