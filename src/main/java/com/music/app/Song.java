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


    public Song(int id, String name, String artist, String album, String filepath, String lyric, int play_count) {
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.album = album;
        this.filepath = filepath;
        this.lyric = lyric;
        this.play_count = play_count;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
                '}';
    }
}

