package com.music.app;

public class Song1 {
    private String song_id;
    private String song_name;
    private String song_artist;
    private String song_album;
    private String song_filepath;
    private String song_lyric;
    private String song_avatar;
    private int song_play_count;
    private int song_version;
    private String song_artist_id;
    private  boolean is_member_song;
    private int tag_id;


    public int getTag_id() {
        return tag_id;
    }

    public void setTag_id(int tag_id) {
        this.tag_id = tag_id;
    }

    public boolean isIs_member_song() {
        return is_member_song;
    }

    public void setIs_member_song(boolean is_member_song) {
        this.is_member_song = is_member_song;
    }

    public String getSong_id() {
        return song_id;
    }

    public void setSong_id(String song_id) {
        this.song_id = song_id;
    }

    public String getSong_name() {
        return song_name;
    }

    public void setSong_name(String song_name) {
        this.song_name = song_name;
    }

    public String getSong_artist() {
        return song_artist;
    }

    public void setSong_artist(String song_artist) {
        this.song_artist = song_artist;
    }

    public String getSong_album() {
        return song_album;
    }

    public void setSong_album(String song_album) {
        this.song_album = song_album;
    }

    public String getSong_filepath() {
        return song_filepath;
    }

    public void setSong_filepath(String song_filepath) {
        this.song_filepath = song_filepath;
    }

    public String getSong_lyric() {
        return song_lyric;
    }

    public void setSong_lyric(String song_lyric) {
        this.song_lyric = song_lyric;
    }

    public String getSong_avatar() {
        return song_avatar;
    }

    public void setSong_avatar(String song_avatar) {
        this.song_avatar = song_avatar;
    }

    public int getSong_play_count() {
        return song_play_count;
    }

    public void setSong_play_count(int song_play_count) {
        this.song_play_count = song_play_count;
    }

    public int getSong_version() {
        return song_version;
    }

    public void setSong_version(int song_version) {
        this.song_version = song_version;
    }

    public String getSong_artist_id() {
        return song_artist_id;
    }

    public void setSong_artist_id(String song_artist_id) {
        this.song_artist_id = song_artist_id;
    }

    @Override
    public String toString() {
        return "Song1{" +
                "song_id='" + song_id + '\'' +
                ", song_name='" + song_name + '\'' +
                ", song_artist='" + song_artist + '\'' +
                ", song_album='" + song_album + '\'' +
                ", song_filepath='" + song_filepath + '\'' +
                ", song_lyric='" + song_lyric + '\'' +
                ", song_avatar='" + song_avatar + '\'' +
                ", song_play_count=" + song_play_count +
                ", song_version=" + song_version +
                ", song_artist_id='" + song_artist_id + '\'' +
                ", is_member_song=" + is_member_song +
                ", tag_id=" + tag_id +
                '}';
    }
}
