package com.music.app;

import java.util.Date;

public class PlayLog {
    private int user_id;
    private int song_id;
    private Song songs;
    private Date play_time;

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public Song getSongs() {
        return songs;
    }

    public void setSongs(Song songs) {
        this.songs = songs;
    }

    public int getSong_id() {
        return song_id;
    }

    public void setSong_id(int song_id) {
        this.song_id = song_id;
    }

    public Date getPlay_time() {
        return play_time;
    }

    public void setPlay_time(Date play_time) {
        this.play_time = play_time;
    }

    @Override
    public String toString() {
        return "PlayLog{" +
                "user_id=" + user_id +
                ", song_id=" + song_id +
                ", songs=" + songs +
                ", play_time=" + play_time +
                '}';
    }
}
