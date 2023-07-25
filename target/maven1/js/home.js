/***歌词****/
function parseLyrics(lyricsText) {
    let lines = lyricsText.split('\n');  // 分割每一行
    let lyrics = [];

    for (let line of lines) {
        let match = line.match(/\[(\d+):(\d+\.\d+)\](.+)/);  // 正则匹配歌词和时间
        if (match) {
            let minutes = parseInt(match[1]);
            let seconds = parseFloat(match[2]);
            let text = match[3];
            lyrics.push({time: minutes * 60 + seconds, text});
        }
    }

    // 根据时间对歌词进行排序，确保在后续处理中能正确显示
    lyrics.sort((a, b) => a.time - b.time);

    return lyrics;
}





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
let userScrolling = false;  //添加一个标志 userScrolling 来记录用户是否正在手动滑动滚动条：
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
  /*  document.querySelector('.lyrics-toggle').addEventListener('click', function(e) {
        e.preventDefault();

        if (lyricsContainer.style.display === 'none') {
            showLyrics(currentSong.lyrics);
        } else {
            lyricsContainer.style.display = 'none';
        }
    });*/




});



let currentSong = null;

function playSong(filepath, songName, artistName, lyric, avatar) {
    console.log("歌词路径："+lyric)
    var audio = document.getElementById('audio-player');
    if (currentSong === null || currentSong.filepath !== filepath) {
        audio.src = "/upload/"+filepath;
        currentSong = {filepath, songName, artistName, lyric, avatar};
    }
    audio.play();
    var footerLeft = document.getElementsByClassName('footer-left')[0];
    var songImageElement = footerLeft.getElementsByTagName('img')[0];  // 得到img元素
    var songDetails = document.getElementsByClassName('song-details')[0];
    var songNameElement = songDetails.getElementsByClassName('song-name')[0];
    var artistNameElement = songDetails.getElementsByClassName('artist-name')[0];

    songImageElement.src = "/upload/"+ avatar; // 设置img的src
    songNameElement.innerText = songName;
    artistNameElement.innerText = artistName;

    let lyricsPanel = document.querySelector('.lyrics-panel');
    let lyricsDiv = lyricsPanel.querySelector('.lyrics');
    let songImagePanel = lyricsPanel.querySelector('.song-image');  // 获取歌词面板中的图片元素

    let songNamePanel = lyricsPanel.querySelector('.song-name-panel');  // 获取歌词面板中的歌曲名字元素
    let artistNamePanel = lyricsPanel.querySelector('.artist-name-panel');  // 获取歌词面板中的艺术家名字元素




    // 清空当前歌词
    lyricsDiv.innerHTML = '';

    // 设置歌词面板的歌曲图片
    songImagePanel.src = "/upload/"+ avatar; // 设置img的src

    // 设置歌词面板的歌曲名字
    songNamePanel.textContent = songName;
// 设置歌词面板的艺术家名字
    artistNamePanel.textContent = artistName;

    // 从服务器获取歌词文本
    fetch("/upload/" + lyric)
        .then(response => response.text())
        .then(lyricsText => {
            // 解析新歌词
            let lyrics1 = parseLyrics(lyricsText);
            for (let line of lyrics1) {
                let p = document.createElement('p');
                p.dataset.time = line.time;
                p.textContent = line.text;
                lyricsDiv.appendChild(p);
            }

            // 显示歌词面板
            lyricsPanel.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // 显示歌词面板
    lyricsPanel.style.display = 'block';

    //添加事件监听器来在用户开始滑动滚动条时将 userScrolling 设置为 true，
// 并在用户停止滑动后将 userScrolling 设置为 false：
    lyricsDiv.addEventListener('scroll', function() {
        userScrolling = true;
    });

    lyricsDiv.addEventListener('scrollend', function() {
        userScrolling = false;
    });

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
            playSong(songs[currentSongIndex].filepath, songs[currentSongIndex].name, songs[currentSongIndex].artist, songs[currentSongIndex].lyric,songs[currentSongIndex].avatar);
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
    playSong(songs[currentSongIndex].filepath, songs[currentSongIndex].name, songs[currentSongIndex].artist, songs[currentSongIndex].lyric,songs[currentSongIndex].avatar);
});



// 设置上一首按钮的点击事件
document.querySelector('.prev').addEventListener('click', function() {
    if (songs.length > 0) {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        playSong(songs[currentSongIndex].filepath, songs[currentSongIndex].name, songs[currentSongIndex].artist, songs[currentSongIndex].lyric,songs[currentSongIndex].avatar);
    }
});

// 设置下一首按钮的点击事件
document.querySelector('.next').addEventListener('click', function() {

    if (songs.length > 0) {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        playSong(songs[currentSongIndex].filepath, songs[currentSongIndex].name, songs[currentSongIndex].artist, songs[currentSongIndex].lyric,songs[currentSongIndex].avatar);
    }
});

axios.get('/Music1_0_war/user/song')
    .then(function (response) {
        // handle success
        songs = response.data;
        console.log("歌信息："+songs)
        let songList = document.getElementById('song-list');
        songList.innerHTML = "";

        for (let [index, song] of songs.entries()) {
            console.log("歌路径："+song.lyric)
            console.log("歌手："+song.artist)
            let listItem = document.createElement('li');
            listItem.innerHTML = `
        <img src="/upload/${song.avatar}" alt="歌曲图片" width="130%" height="60%"/>
        <p>${song.name}</p>
        <span class="hot_play"></span>
    `;
            listItem.addEventListener('click', function() {
                playSong(song.filepath, song.name, song.artist, song.lyric,song.avatar);  // add song.lyrics
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


    // 获取当前歌词元素
    let lyricsDiv = document.querySelector('.lyrics-panel .lyrics');
    let lyricsElements = lyricsDiv.querySelectorAll('p');
    let currentLyric = null;
    for (let lyric of lyricsElements) {
        if (audio.currentTime >= lyric.dataset.time) {
            currentLyric = lyric;
        } else {
            break;
        }
    }

    // 更新歌词样式
    for (let lyric of lyricsElements) {
        if (lyric === currentLyric) {
            lyric.style.color = 'white';  // 当前歌词颜色
            lyric.style.fontWeight = 'bold';  // 当前歌词字体
        } else {
            lyric.style.color = '';  // 其他歌词颜色
            lyric.style.fontWeight = '';  // 其他歌词字体
        }
    }

    // 自动滚动到当前歌词
    if (currentLyric && !userScrolling) {
        lyricsDiv.scrollTop = currentLyric.offsetTop - lyricsDiv.offsetHeight / 2;
    }

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





function showSettingsModal() {
    var overlay = document.getElementById("overlay");
    var modal = document.getElementById("modal");

    overlay.style.display = "block";
    modal.style.display = "block";

    // 禁止页面滚动
    document.body.style.overflow = "hidden";

        // 当页面加载完成时，获取用户信息
        axios.get('/Music1_0_war/user/edit').then(response => {
            console.log( response.data.nickname)
            console.log(response.data.avatar)
            document.getElementById('nickname').value = response.data.nickname;
            document.getElementById('idcard').innerHTML = response.data.id;
            document.getElementById('email').innerHTML = response.data.email;
            console.log("哈哈哈哈哈："+response.data.avatar)
            document.getElementById('avatarImage').src = "/upload/" + response.data.avatar;
        });

        // 设置头像点击事件
        document.getElementById('avatarImage').onclick = function() {
            document.getElementById('avatar').click();
        };

        // 设置文件选择事件
        document.getElementById('avatar').onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function() {
                    /*  console.log("66666："+reader.result)*/
                    document.getElementById('avatarImage').src = reader.result;
                };
            }
        };


        // 设置保存按钮点击事件
        document.getElementById('save').onclick = function() {
            const nickname = document.getElementById('nickname').value;
            const avatarFile = document.getElementById('avatar').files[0];
            console.log(nickname)
            console.log("666666:"+avatarFile)
            const formData = new FormData();
            formData.append('nickname', nickname);
            formData.append('avatar', avatarFile);
            axios.post('/Music1_0_war/user/edit', formData).then(response => {
                console.log(response)
                console.log(response.data.nickname)
                console.log(response.nickname)
                document.querySelector('.user-name').textContent =  response.data.nickname;
                document.querySelector('.image img').src = "/upload/"+ response.data.avatar
                console.log(response);
            });

        };

}


document.getElementById('back').addEventListener('click', function() {
    var overlay = document.getElementById("overlay");
    var modal = document.getElementById("modal");

    overlay.style.display = "none";
    modal.style.display = "none";

    // 恢复页面滚动
    document.body.style.overflow = "auto";
});


window.onload = function() {
    const musicLi = document.getElementById('music1');
    const rightSidebar = document.querySelector('.main-right');

    musicLi.addEventListener('click', function(event) {
        event.preventDefault();

        if (rightSidebar.style.display === 'none') {
            rightSidebar.style.display = 'block';
        } else {
            rightSidebar.style.display = 'none';
        }

        musicLi.classList.toggle('active');
    });
}


var footerHeight = $('footer').outerHeight(); // 获取footer的高度

$(".footer-left").on("click", function() {
    $(".lyrics-panel").css({
        'height': `calc(100vh - ${footerHeight}px)`, // 设置高度为视窗高度减去footer的高度
        'bottom': `${footerHeight}px`  // 设置底部位置为footer的高度
    });
    $(".lyrics-panel").show(); // 显示面板
});

$(".hide-btn").on("click", function() {
    $(".lyrics-panel").css('bottom', '100%');
});

