document.getElementById('playlist-image').src = "/upload/伍六七.jpeg";
document.getElementById('playlist-title').innerText = '歌单的名字';
document.getElementById('playlist-creator').innerText = '创建者的昵称';
document.getElementById('playlist-date').innerText = '创建时间';
document.getElementById('song-count').innerText = '歌曲数量';
document.getElementById('play-count').innerText = '播放次数';

// 你的歌曲数据，例如：
const songs = [
    { title: '歌曲名1', artist: '歌手1', album: '专辑1' },
    { title: '歌曲名2', artist: '歌手2', album: '专辑2' },
    // ...
];

const songList = document.getElementById('song-list');
songs.forEach(song => {
    songList.innerHTML += `<p>${song.title} - ${song.artist} - ${song.album}</p>`;
});

document.getElementById('song-list-tab').addEventListener('click', function() {
    var songList = document.getElementById('song-list');
    if(songList.style.display === "none") {
        songList.style.display = "block";
    } else {
        songList.style.display = "none";
    }
});

