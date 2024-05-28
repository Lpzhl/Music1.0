package com.music.app;


public class Artist {
    private int id;
    private String name;
    private String genre;
    private String introduction;

    // 构造方法、getter和setter方法等


    public Artist() {
    }

    // 示例构造方法
    public Artist(int id, String name, String genre, String introduction) {
        this.id = id;
        this.name = name;
        this.genre = genre;
        this.introduction = introduction;
    }

    // 示例 getter 和 setter 方法
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
        return "Artist{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", genre='" + genre + '\'' +
                ", introduction='" + introduction + '\'' +
                '}';
    }
}
