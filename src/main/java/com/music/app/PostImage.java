package com.music.app;

public class PostImage {
    private int image_id;
    private int post_id;
    private String image_path;


    public int getImage_id() {
        return image_id;
    }

    public void setImage_id(int image_id) {
        this.image_id = image_id;
    }

    public int getPost_id() {
        return post_id;
    }

    public void setPost_id(int post_id) {
        this.post_id = post_id;
    }

    public String getImage_path() {
        return image_path;
    }

    public void setImage_path(String image_path) {
        this.image_path = image_path;
    }

    @Override
    public String toString() {
        return "PostImage{" +
                "image_id=" + image_id +
                ", post_id=" + post_id +
                ", image_path='" + image_path + '\'' +
                '}';
    }
}
