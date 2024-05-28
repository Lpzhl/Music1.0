package com.music.app;

public class SongWithArtistDetails {
    private int id;
    private String name;
    private String artist;
    private String album;
    private String filepath;
    private String lyric;
    private int version;
    private int play_count;
    private int artist_id;
    private boolean is_member_song;
    private String nickname;
    private String avatar;
    private String bio;
    private String genre;


    public boolean isIs_member_song() {
        return is_member_song;
    }

    public void setIs_member_song(boolean is_member_song) {
        this.is_member_song = is_member_song;
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

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public int getPlay_count() {
        return play_count;
    }

    public void setPlay_count(int play_count) {
        this.play_count = play_count;
    }

    public int getArtist_id() {
        return artist_id;
    }

    public void setArtist_id(int artist_id) {
        this.artist_id = artist_id;
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


    @Override
    public String toString() {
        return "SongWithArtistDetails{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", artist='" + artist + '\'' +
                ", album='" + album + '\'' +
                ", filepath='" + filepath + '\'' +
                ", lyric='" + lyric + '\'' +
                ", version=" + version +
                ", play_count=" + play_count +
                ", artist_id=" + artist_id +
                ", is_member_song=" + is_member_song +
                ", nickname='" + nickname + '\'' +
                ", avatar='" + avatar + '\'' +
                ", bio='" + bio + '\'' +
                ", genre='" + genre + '\'' +
                '}';
    }
}
