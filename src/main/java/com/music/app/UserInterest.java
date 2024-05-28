package com.music.app;

public class UserInterest {
    private int id;
    private int user_id;
    private int song_id;
    private int interest_count;

    // 构造函数、getter 和 setter 方法


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getSong_id() {
        return song_id;
    }

    public void setSong_id(int song_id) {
        this.song_id = song_id;
    }

    public int getInterest_count() {
        return interest_count;
    }

    public void setInterest_count(int interest_count) {
        this.interest_count = interest_count;
    }

    // 示例构造函数
    public UserInterest(int user_id, int song_id, int interest_count) {
        this.user_id = user_id;
        this.song_id = song_id;
        this.interest_count = interest_count;
    }
}
