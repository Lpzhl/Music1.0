package com.music.app;

import java.util.Date;

public class User {
    private int id;
    private String username;
    private String password;
    private String email;
    private String nickname;
    private String avatar;
    private String remember;
    private String bio;
    private String genre;
    private String user_type;
    private boolean is_member;
    private String account_status;
    private UserMembership userMembership;

    private Date membershipStartDate;
    private Date membershipEndDate;


    public String getAccount_status() {
        return account_status;
    }

    public void setAccount_status(String account_status) {
        this.account_status = account_status;
    }

    public Date getMembershipStartDate() {
        return membershipStartDate;
    }

    public void setMembershipStartDate(Date membershipStartDate) {
        this.membershipStartDate = membershipStartDate;
    }

    public Date getMembershipEndDate() {
        return membershipEndDate;
    }

    public void setMembershipEndDate(Date membershipEndDate) {
        this.membershipEndDate = membershipEndDate;
    }

    public UserMembership getUserMembership() {
        return userMembership;
    }

    public void setUserMembership(UserMembership userMembership) {
        this.userMembership = userMembership;
    }

    public boolean isIs_member() {
        return is_member;
    }

    public void setIs_member(boolean is_member) {
        this.is_member = is_member;
    }

    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public User(int id, String username, String password, String email, String nickname, String avatar) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.nickname = nickname;
        this.avatar = avatar;
    }

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }
    public String getRemember() {
    return remember;
}

    public void setRemember(String remember) {
        this.remember = remember;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", nickname='" + nickname + '\'' +
                ", avatar='" + avatar + '\'' +
                ", remember='" + remember + '\'' +
                ", bio='" + bio + '\'' +
                ", genre='" + genre + '\'' +
                ", user_type='" + user_type + '\'' +
                ", is_member=" + is_member +
                ", account_status='" + account_status + '\'' +
                ", userMembership=" + userMembership +
                ", membershipStartDate=" + membershipStartDate +
                ", membershipEndDate=" + membershipEndDate +
                '}';
    }
}
