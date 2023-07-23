const slider = document.querySelector('#slider');
const slides = Array.from(slider.children);
const prevButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');
const switchLinks = document.querySelectorAll('.main-right-switch a');
let deg = 0;
let currentSlide = 0;
let intervalId;

function rotateSlider(direction) {
    deg = deg + direction * (360 / slides.length);
    slider.style.transform = 'rotateY(' + deg + 'deg)';
}

function switchSlide(index) {
    currentSlide = index;
    deg = currentSlide * (360 / slides.length);
    slider.style.transform = 'rotateY(' + deg + 'deg)';
    switchLinks.forEach((link, i) => {
        if (i === currentSlide) {
            link.classList.add('selected');
        } else {
            link.classList.remove('selected');
        }
    });
}

prevButton.addEventListener('click', () => {
    clearInterval(intervalId);
    rotateSlider(-1);
});
nextButton.addEventListener('click', () => {
    clearInterval(intervalId);
    rotateSlider(1);
});

switchLinks.forEach((link, i) => {
    link.addEventListener('mouseover', () => {
        clearInterval(intervalId);
        switchSlide(i);
    });
});

function autoSwitchSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    switchSlide(currentSlide);
}

intervalId = setInterval(autoSwitchSlide, 2000);

// 鼠标移入slider时清除自动切换的定时器
slider.addEventListener('mouseover', () => {
    clearInterval(intervalId);
});

// 鼠标移出slider时重新启动自动切换的定时器
slider.addEventListener('mouseout', () => {
    intervalId = setInterval(autoSwitchSlide, 2000);
});

// 鼠标移入switchLinks时清除自动切换的定时器
switchLinks.forEach((link) => {
    link.addEventListener('mouseover', () => {
        clearInterval(intervalId);
    });
});

// 鼠标移出switchLinks时重新启动自动切换的定时器
switchLinks.forEach((link) => {
    link.addEventListener('mouseout', () => {
        intervalId = setInterval(autoSwitchSlide, 2000);
    });
});

// 初始旋转
for (let i = 0; i < slides.length; i++) {
    slides[i].style.transform = 'rotateY(' + i * (360 / slides.length) + 'deg) translateZ(300px)';
}

document.addEventListener("DOMContentLoaded", function () {

    // 获取保存的username
    let username = sessionStorage.getItem('username');
    console.log("账号：" + username);
    // 发送请求到HomeServlet
    axios.post('/Music1_0_war/home', {
        username: username
    }).then(function (response) {
        console.log(response.data);
        document.querySelector('.image img').src = "/upload/"+ response.data.avatar;
        document.querySelector('.user-name').innerText = response.data.nickname;
    }).catch(function (error) {
        console.log(error);
    });
    document.querySelector('.lyrics-toggle').addEventListener('click', function(e) {
        e.preventDefault();

        if (lyricsContainer.style.display === 'none') {
            showLyrics(currentSong.lyrics);
        } else {
            lyricsContainer.style.display = 'none';
        }
    });
});



let currentSong = null;

function playSong(filepath, songName, artistName, lyrics) {
    console.log("歌词:"+lyrics)
    var audio = document.getElementById('audio-player');
    if (currentSong === null || currentSong.filepath !== filepath) {
        audio.src = filepath;
        currentSong = {filepath, songName, artistName, lyrics};
    }
    audio.play();

    var songDetails = document.getElementsByClassName('song-details')[0];
    var songNameElement = songDetails.getElementsByClassName('song-name')[0];
    var artistNameElement = songDetails.getElementsByClassName('artist-name')[0];
    songNameElement.innerText = songName;
    artistNameElement.innerText = artistName;
}



let songs = [];
let currentSongIndex = 0;

// 获取音频元素
let audio = document.getElementById('audio-player');
// 播放暂停
document.querySelector('.play-pause-btn').addEventListener('click', function(e) {
    let playButton = document.querySelector('.play');
    let pauseButton = document.querySelector('.pause');
    if (playButton.style.display !== 'none' || playButton.style.display === '') {
        playButton.style.display = 'none';
        pauseButton.style.display = '';

        if (songs.length > 0) {
            playSong(songs[currentSongIndex].filepath, songs[currentSongIndex].name, songs[currentSongIndex].artist, songs[currentSongIndex].lyrics);
        }
    } else {
        console.log("啥东西啊")
        pauseButton.style.display = 'none';
        playButton.style.display = '';

        console.log(audio.paused);
        console.log(audio);
        console.log("暂停");
        audio.pause();
    }
});
// 监听 'ended' 事件
audio.addEventListener('ended', function() {
    // 在这里添加播放下一首歌的代码
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0; // 如果当前已经是最后一首歌，则切换到第一首
    }
    playSong(songs[currentSongIndex].filepath, songs[currentSongIndex].name, songs[currentSongIndex].artist,songs[currentSongIndex].lyrics);
});



// 设置上一首按钮的点击事件
document.querySelector('.prev').addEventListener('click', function() {
    if (songs.length > 0) {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        playSong(songs[currentSongIndex].filepath, songs[currentSongIndex].name, songs[currentSongIndex].artist,songs[currentSongIndex].lyrics);
    }
});

// 设置下一首按钮的点击事件
document.querySelector('.next').addEventListener('click', function() {

    if (songs.length > 0) {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        playSong(songs[currentSongIndex].filepath, songs[currentSongIndex].name, songs[currentSongIndex].artist,songs[currentSongIndex].lyrics);
    }
});

axios.get('/Music1_0_war/song')
    .then(function (response) {
        // handle success
        songs = response.data;
        let songList = document.getElementById('song-list');
        songList.innerHTML = "";

        for (let [index, song] of songs.entries()) {
            let listItem = document.createElement('li');
            listItem.innerHTML = `
        <img src="image/推荐歌单.png" alt=""/>
        <p>${song.name}</p>
        <span class="hot_play"></span>
    `;
            listItem.addEventListener('click', function() {
                playSong(song.filepath, song.name, song.artist, song.lyrics);  // add song.lyrics
                currentSongIndex = index; // 更新当前歌曲索引
            });
            songList.appendChild(listItem);
        }
    })
    .catch(function (error) {
        console.log(error);
    });



// 获取进度条和时间元素
let progressBar = document.querySelector('.progress-bar input');
let currentTimeElement = document.querySelector('.progress-bar .current-time');
let totalTimeElement = document.querySelector('.progress-bar .total-time');

// 更新进度条和时间的函数
function updateProgress() {
    // 计算进度条的值
    let progress = audio.currentTime / audio.duration;
    progressBar.value = progress;

    // 更新当前时间
    let currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime % 60);
    if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
    currentTimeElement.textContent = `${currentMinutes}:${currentSeconds}`;

    // 更新总时间
    let totalMinutes = Math.floor(audio.duration / 60);
    let totalSeconds = Math.floor(audio.duration % 60);
    if (totalSeconds < 10) totalSeconds = "0" + totalSeconds;
    totalTimeElement.textContent = `${totalMinutes}:${totalSeconds}`;
}

// 在音频播放时更新进度条和时间
audio.addEventListener('timeupdate', updateProgress);

// 拖动进度条来改变音频播放位置
progressBar.addEventListener('input', function() {
    // 计算新的currentTime并设置
    let newTime = progressBar.value * audio.duration;
    audio.currentTime = newTime;
});


let volumeSlider = document.querySelector('.volume-slider');
let volumeDisplay = document.querySelector('.volume-display');

// 更新音量显示
function updateVolumeDisplay() {
    volumeDisplay.textContent = Math.round(audio.volume * 100);
}

// 设置初始音量
audio.volume = volumeSlider.value;
updateVolumeDisplay();

volumeSlider.addEventListener('input', function() {
    audio.volume = this.value;
    updateVolumeDisplay();
});

// 获取歌词显示元素
let lyricsContainer = document.getElementById('lyrics-container');
let lyricsElement = document.getElementById('lyrics');

// 创建一个函数来处理歌词
function parseLyrics(lyrics) {
    // 通过换行符分割歌词
    let lines = lyrics.split('\n');
    let parsedLyrics = [];

    for (let line of lines) {
        // 通过']'分割每一行
        let parts = line.split(']');
        if (parts.length < 2) continue;

        // 获取时间部分，并通过':'分割分钟和秒
        let timeParts = parts[0].substr(1).split(':');
        let minutes = parseInt(timeParts[0]);
        let seconds = parseFloat(timeParts[1]);

        // 计算总时间（秒）
        let time = minutes * 60 + seconds;

        // 添加到结果数组中
        parsedLyrics.push({
            time: time,
            text: parts[1]
        });
    }

    // 按时间排序
    parsedLyrics.sort((a, b) => a.time - b.time);

    return parsedLyrics;
}

// 创建一个函数来显示歌词
function showLyrics(lyrics) {
    // 解析歌词
    let parsedLyrics = parseLyrics(lyrics);

    // 清空歌词元素
    lyricsElement.textContent = '';

    // 添加歌词到元素中
    for (let line of parsedLyrics) {
        let lineElement = document.createElement('p');
        lineElement.textContent = line.text;
        lineElement.dataset.time = line.time;
        lyricsElement.appendChild(lineElement);
    }

    // 显示歌词容器
    lyricsContainer.style.display = 'block';
}

// 更新歌词的位置
function updateLyricsPosition() {
    // 获取所有的歌词行
    let lines = lyricsElement.querySelectorAll('p');

    for (let line of lines) {
        // 如果这一行的时间小于音频的当前时间，将它的class设置为'passed'
        if (parseFloat(line.dataset.time) < audio.currentTime) {
            line.className = 'passed';
        } else {
            line.className = '';
        }
    }

    // 获取最后一个'passed'的元素
    let lastPassed = lyricsElement.querySelector('.passed:last-child');

    if (lastPassed) {
        // 如果存在，滚动到这一行
        lastPassed.scrollIntoView();
    }
}

// 在音频播放时更新歌词的位置
audio.addEventListener('timeupdate', updateLyricsPosition);

// 设置歌词切换按钮的点击事件
document.querySelector('.lyrics-toggle').addEventListener('click', function(e) {
    e.preventDefault();

    let lyricsPopup = document.getElementById('lyrics-popup');
    let lyricsInPopup = lyricsPopup.querySelector('#lyrics');

    if (lyricsPopup.style.display === 'none') {
        lyricsInPopup.textContent = currentSong.lyrics;
        lyricsPopup.style.display = 'block';
    } else {
        lyricsPopup.style.display = 'none';
    }
});

// 隐藏歌词的按钮
document.getElementById('close-lyrics-popup').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('lyrics-popup').style.display = 'none';
});