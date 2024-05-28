package com.music.app;

import java.util.List;

public class SearchResult {
    private List<Song> songs;
    private List<ArtistInfo> artists;
    private List<Playlist> playlists;
    private List<User> users;

    public SearchResult() {
    }

    // setters
    public void setSongs(List<Song> songs) {
        this.songs = songs;
    }

    public void setArtists(List<ArtistInfo> artists) {
        this.artists = artists;
    }

    public void setPlaylists(List<Playlist> playlists) {
        this.playlists = playlists;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    // getters
    public List<Song> getSongs() {
        return songs;
    }

    public List<ArtistInfo> getArtists() {
        return artists;
    }

    public List<Playlist> getPlaylists() {
        return playlists;
    }

    public List<User> getUsers() {
        return users;
    }
}
