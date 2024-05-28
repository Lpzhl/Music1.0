package com.music.app;

import java.util.Date;

public class AuthenticationInfo {
    private int id;
    private int user_id;
    private int auth_status;
    private String artistName;
    private String avatarUrl;
    private String genre;
    private String introduction;
    private Date submission_time;

    public Date getSubmission_time() {
        return submission_time;
    }

    public void setSubmission_time(Date submission_time) {
        this.submission_time = submission_time;
    }

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

    public int getAuth_status() {
        return auth_status;
    }

    public void setAuth_status(int auth_status) {
        this.auth_status = auth_status;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    @Override
    public String toString() {
        return "AuthenticationInfo{" +
                "id=" + id +
                ", user_id=" + user_id +
                ", auth_status=" + auth_status +
                ", artistName='" + artistName + '\'' +
                ", avatarUrl='" + avatarUrl + '\'' +
                ", genre='" + genre + '\'' +
                ", introduction='" + introduction + '\'' +
                ", submission_time=" + submission_time +
                '}';
    }
}
