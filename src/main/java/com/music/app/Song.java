package com.music.app;

public class Song {
    private int id;
    private String name;
    private String artist;
    private String album;
    private String filepath;
    private String lyric;
    private String avatar;
    private int play_count;
    private int version;
    private int artist_id;
    private String status;
    private boolean is_member_song;
    private int tag_id;

    public int getTag_id() {
        return tag_id;
    }

    public void setTag_id(int tag_id) {
        this.tag_id = tag_id;
    }

    public int getId() {
        return id;
    }

    public boolean isIs_member_song() {
        return is_member_song;
    }

    public void setIs_member_song(boolean is_member_song) {
        this.is_member_song = is_member_song;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Song() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }

    public String getFilepath() {
        return filepath;
    }

    public void setFilepath(String filepath) {
        this.filepath = filepath;
    }

    public String getLyric() {
        return lyric;
    }

    public void setLyric(String lyric) {
        this.lyric = lyric;
    }

    public int getPlay_count() {
        return play_count;
    }

    public void setPlay_count(int play_count) {
        this.play_count = play_count;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public int getArtist_id() {
        return artist_id;
    }

    public void setArtist_id(int artist_id) {
        this.artist_id = artist_id;
    }

    @Override
    public String toString() {
        return "Song{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", artist='" + artist + '\'' +
                ", album='" + album + '\'' +
                ", filepath='" + filepath + '\'' +
                ", lyric='" + lyric + '\'' +
                ", avatar='" + avatar + '\'' +
                ", play_count=" + play_count +
                ", version=" + version +
                ", artist_id=" + artist_id +
                ", status='" + status + '\'' +
                ", is_member_song=" + is_member_song +
                ", tag_id=" + tag_id +
                '}';
    }
}

