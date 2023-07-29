let currentUserId = null; // 当前用户ID，需要从登录信息中获取
let currentRow = null;// 当前播放的行
let listsongs = [];  //用来记录播放列表的歌曲
let currentSong = null;
let songs = [];
let currentSongIndex = 0;
let songList2 = []; //获取歌单歌曲信息


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



let isLyricDisplayed = false; // 这个变量用来记录歌词是否正在显示
let currentLyric1 = ""; // 这个变量用来存储当前播放的歌词

document.querySelector('.fa-file-word').addEventListener('click', function() {
    isLyricDisplayed = !isLyricDisplayed; // 切换显示状态
    let currentLyricDiv = document.querySelector('.current-lyric'); // 获取显示歌词的 div
    if (isLyricDisplayed) {
        currentLyricDiv.style.display = ""; // 显示歌词
        console.log("有歌词吗："+currentLyric1)
        currentLyricDiv.innerText = currentLyric1; // 设置歌词
    } else {
        currentLyricDiv.style.display = "none"; // 隐藏歌词
    }
});

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
        console.log("用户ID："+response.data.id)
        currentUserId=response.data.id;
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


let playIcon = document.querySelector('.play'); //开始按钮
let pauseIcon = document.querySelector('.pause');//暂停按钮
// 获取音频元素
let audio = document.getElementById('audio-player');



function playSong(id,filepath, name, artist, lyric, avatar) {

    // 当放歌的时候恢复底框
    document.querySelector('footer .footer-left').style.display = '';
    document.querySelector('footer .footer-middle').style.display = '';
    // 检查歌曲是否已经在播放列表中
    if (!listsongs.find(song => song.id === id)) {
        // 如果不在播放列表中，将其添加到 listsongs 并添加到播放列表的 DOM 中
        let song = {id, filepath, name, artist, lyric, avatar};
        console.log("列表加进来的"+JSON.stringify(song, null, 2));
        listsongs.push(song);
        document.querySelector('.total1 > #totalSongs').textContent = listsongs.length;
        let songTable = document.getElementById('songTable');
        let songRow = document.createElement('tr');

        // 创建一个新的 Audio 对象以获取歌曲长度
        let audio = new Audio("/upload/"+filepath);
        audio.addEventListener('loadedmetadata', function () {
            let duration = audio.duration;
            let minutes = Math.floor(duration / 60);
            let seconds = Math.floor(duration % 60).toString().padStart(2, '0'); // 用0填充秒钟的左侧，确保始终显示两位数字

            // 添加新的 td 到行中，显示歌曲长度
            songRow.innerHTML = `
            <td>${name}</td>
            <td>${artist}</td>
            <td id="song-${id}-duration">${minutes}:${seconds}</td>
        `;
        });

        songRow.addEventListener('click', function() {
            playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar);
        });

        songTable.appendChild(songRow);
    }



    // 查找当前歌曲是否在用户喜欢的歌单中
    let playlistName = "我的喜欢";
    let userId =currentUserId;

    axios.get('/Music1_0_war/playlist/checkSongInMyFavorites', {
        params: {
            name: playlistName,
            userId: userId,
            songId: id
        }
    }).then(function (response) {
        let isLiked = response.data; // 修改此处获取返回的值
        console.log("isLiked:" + isLiked);
        let heartIconSolid = document.getElementById('heart-icon-solid');
        let heartIconRegular = document.getElementById('heart-icon-regular');

        if (isLiked) {
            // 如果喜欢，显示 solid 心形
            heartIconSolid.style.display = '';
            heartIconRegular.style.display = 'none';
        } else {
            // 如果不喜欢，显示 regular 心形
            heartIconSolid.style.display = 'none';
            heartIconRegular.style.display = '';
        }
    }).catch(function (error) {
        console.log(error);
    });

    console.log("歌词路径："+lyric)
    var audio = document.getElementById('audio-player');
    if (currentSong === null || currentSong.filepath !== filepath) {
        audio.src = "/upload/"+filepath;
        currentSong = {id,filepath, name, artist, lyric, avatar};

        console.log("当前音乐的哈哈哈哈ID："+currentSong.id)

    }
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = '';

    var footerLeft = document.getElementsByClassName('footer-left')[0];
    var songImageElement = footerLeft.getElementsByTagName('img')[0];  // 得到img元素
    var songDetails = document.getElementsByClassName('song-details')[0];
    var songNameElement = songDetails.getElementsByClassName('song-name')[0];
    var artistNameElement = songDetails.getElementsByClassName('artist-name')[0];

    songImageElement.src = "/upload/"+ avatar; // 设置img的src
    songNameElement.innerText = name;
    artistNameElement.innerText = artist;

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
    songNamePanel.textContent = name;
// 设置歌词面板的艺术家名字
    artistNamePanel.textContent = artist;

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
                p.classList.add('lyric-line');  // 在这里添加类
                p.addEventListener('click', function() {
                    // 在这里改变歌曲的当前播放进度
                    audio.currentTime = line.time;
                    // 更新进度条的值
                    progressBar.value = audio.currentTime / audio.duration;
                });
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




// 播放   暂停
document.querySelector('.play-pause-btn').addEventListener('click', function(e) {
    let playButton = document.querySelector('.play');
    let pauseButton = document.querySelector('.pause');
    if (playButton.style.display !== 'none' || playButton.style.display === '') {
        playButton.style.display = 'none';
        pauseButton.style.display = '';

        if (listsongs.length > 0) {
            playSong(listsongs[currentSongIndex].id,listsongs[currentSongIndex].filepath, listsongs[currentSongIndex].name, listsongs[currentSongIndex].artist, listsongs[currentSongIndex].lyric,listsongs[currentSongIndex].avatar);
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
    if (currentSongIndex >= listsongs.length) {
        currentSongIndex = 0; // 如果当前已经是最后一首歌，则切换到第一首
    }
    playSong(listsongs[currentSongIndex].id,listsongs[currentSongIndex].filepath, listsongs[currentSongIndex].name, listsongs[currentSongIndex].artist, listsongs[currentSongIndex].lyric,listsongs[currentSongIndex].avatar);
});



// 设置上一首按钮的点击事件
document.querySelector('.prev').addEventListener('click', function() {
    if (listsongs.length > 0) {
        currentSongIndex--;
        console.log("索引6666666")
        if (currentSongIndex < 0) {
            currentSongIndex = listsongs.length - 1;
        }
        console.log("歌曲id:"+listsongs[currentSongIndex].id)
        console.log("歌曲MP3："+listsongs[currentSongIndex].filepath)
        console.log("歌曲名字:"+listsongs[currentSongIndex].name)
        console.log("歌手："+listsongs[currentSongIndex].artist)
        console.log("歌曲歌词:"+listsongs[currentSongIndex].lyric)
        console.log("歌曲头像："+listsongs[currentSongIndex].avatar)
        console.log("歌曲专辑："+JSON.stringify(listsongs[currentSongIndex], null, 2));


        playSong(listsongs[currentSongIndex].id,listsongs[currentSongIndex].filepath, listsongs[currentSongIndex].name, listsongs[currentSongIndex].artist, listsongs[currentSongIndex].lyric,listsongs[currentSongIndex].avatar);
    }
});

// 设置下一首按钮的点击事件
document.querySelector('.next').addEventListener('click', function() {

    if (listsongs.length > 0) {
        currentSongIndex++;
        if (currentSongIndex >= listsongs.length) {
            currentSongIndex = 0;
        }
        playSong(listsongs[currentSongIndex].id,listsongs[currentSongIndex].filepath, listsongs[currentSongIndex].name, listsongs[currentSongIndex].artist, listsongs[currentSongIndex].lyric,listsongs[currentSongIndex].avatar);
    }
});



//登入之后获取的四首歌曲
axios.get('/Music1_0_war/user/song')
    .then(function (response) {
        // handle success
        let Newsongs = response.data;
        console.log("歌信息："+JSON.stringify(Newsongs, null, 2));
        let songList = document.getElementById('song-list');
        songList.innerHTML = "";

        for (let [index, Newsong] of Newsongs.entries()) {
            console.log("歌路径："+Newsong.lyric)
            console.log("歌手："+Newsong.artist)
            let listItem = document.createElement('li');
            listItem.innerHTML = `
        <img src="/upload/${Newsong.avatar}" alt="歌曲图片" width="130%" height="60%"/>
        <p>${Newsong.name}</p>
        <span class="hot_play"></span>
    `;
            listItem.addEventListener('click', function() {
                playSong(Newsong.id,Newsong.filepath, Newsong.name, Newsong.artist, Newsong.lyric,Newsong.avatar);  // add song.lyrics
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
            currentLyric1 = lyric.textContent; // 更新当前播放的歌词
        } else {
            break;
        }
    }

    // 更新歌词样式
    for (let lyric of lyricsElements) {
        if (lyric === currentLyric) {
            lyric.classList.add('current');  // 添加 'current' 类
            lyric.style.color = 'white';  // 当前歌词颜色
            lyric.style.fontWeight = 'bold';  // 当前歌词字体
        } else {
            lyric.classList.remove('current');  // 移除 'current' 类
            lyric.style.color = '';  // 其他歌词颜色
            lyric.style.fontWeight = '';  // 其他歌词字体
        }
    }


    // 自动滚动到当前歌词
    if (currentLyric && !userScrolling) {
        lyricsDiv.scrollTop = currentLyric.offsetTop - lyricsDiv.offsetHeight / 2;
    }
    // 更新当前播放的歌词
    if (currentLyric) {
        currentLyric1 = currentLyric.textContent;
        // 如果歌词是显示状态，就更新显示的歌词
        if (isLyricDisplayed) {
            let currentLyricDiv = document.querySelector('.current-lyric');
            currentLyricDiv.innerText = currentLyric1;
        }
    } else {
        currentLyric1 = '';
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

                // 更新播放列表创建者的昵称和头像
                document.getElementById('playlist-creator').textContent = response.data.nickname;
                document.getElementById('creator-image').src = "/upload/"+ response.data.avatar;

                console.log(response);
            });

        };

}

// 歌词界面
document.getElementById('back').addEventListener('click', function() {
    var overlay = document.getElementById("overlay");
    var modal = document.getElementById("modal");

    overlay.style.display = "none";
    modal.style.display = "none";

    // 恢复页面滚动
    document.body.style.overflow = "auto";
});


window.onload = function() {
    const music1 = document.getElementById('music1');
    const music2 = document.getElementById('music2');
    const div1 = document.getElementById('1');
    const div2 = document.getElementById('2');
    const div3 = document.getElementById('3');
    // 初始化，两部分都不显示
    div1.style.display = 'none';
    div2.style.display = 'none';

    music1.addEventListener('click', function(event) {
        event.preventDefault();

        if (div1.style.display === 'none') {
            div1.style.display = 'block';
            div2.style.display = 'none';
            div3.style.display = 'none';
        } else {
            div1.style.display = 'none';
        }

        music1.classList.toggle('active');
        music2.classList.remove('active');
    });

    music2.addEventListener('click', function(event) {
        event.preventDefault();

        if (div2.style.display === 'none') {
            div2.style.display = 'block';
            div1.style.display = 'none';
            div3.style.display = 'none';
            // 获取歌单信息和歌曲列表
            fetchPlaylistAndSongs(currentUserId, '我的喜欢');
        } else {
            div2.style.display = 'none';
        }

        music2.classList.toggle('active');
        music1.classList.remove('active');
    });

}

//显示我的喜欢歌曲
document.getElementById('song-list-tab').addEventListener('click', function () {
    var songList = document.getElementById('song-list1');
    let current = document.getElementById('paginator');
    if (songList.style.display === "none") {
        songList.style.display = "block";
    } else {
        songList.style.display = "none";
    }
});

let favoriteSongs = [];//喜欢的音乐
let row;






let currentPage = 1;
let rowsPerPage = 6;  // 每页显示的行数，可以根据需要修改
let totalPages;
let songList;  // 保存歌曲歌单列表

/****获取我的喜欢****/
function fetchPlaylistAndSongs(userId, playlistName) {
    console.log("我的喜欢")
    console.log("userId:" + userId)
    console.log("name:" + playlistName)
    axios.post('/Music1_0_war/playlist/playlistInfo', {userId: userId, name: playlistName}, {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(function (response) {
        // 歌单信息
        const playlistInfo = response.data;
        console.log("playlistInfo:" + playlistInfo)
        console.log("playlistInfo.image:" + playlistInfo.playlist.avatar)
        console.log("playlistInfo.name:" + playlistInfo.playlist.name)
        //console.log("")
        document.getElementById('playlist-image').src = "/upload/" + playlistInfo.playlist.avatar;
        document.getElementById('playlist-creator').innerText = playlistInfo.creator.nickname;
        document.getElementById('creator-image').src = "/upload/" + playlistInfo.creator.avatar;
        document.getElementById('playlist-title').innerText = playlistInfo.playlist.name;

        document.getElementById('playlist-date').innerText = playlistInfo.playlist.created_time;
        document.getElementById('play-count').innerText = '数据加载失败';

// 获取歌曲列表
        axios.post('/Music1_0_war/playlist/playlist_songs', {playlistId: playlistInfo.playlist.id}, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(function (response) {
            // 歌曲信息
            songList = response.data;  // 保存歌曲列表
            console.log("songList:" + songList)
            console.log("后端传来我喜欢的音乐："+JSON.stringify(songList, null, 2));
            // 更新歌曲数量
            document.getElementById('song-count').innerText = songList.length;

            // 清空原歌曲列表
            let songTable = document.getElementById('song-data');
            while (songTable.firstChild) {
                songTable.removeChild(songTable.firstChild);
            }

            totalPages = Math.ceil(songList.length / rowsPerPage);  // 计算总页数
            paginate(currentPage, rowsPerPage);  // 添加第一页的歌曲和页码
        })

    })
    let paginator = document.getElementById('paginator');
    paginator.className = 'paginator';

}


// 插入歌曲行，接收一个歌曲对象
function insertSongRow(song) {
    let tbody = document.getElementById('song-data');
    let row = document.createElement('tr');

    let audio = new Audio("/upload/" + song.filepath);
    audio.addEventListener('loadedmetadata', function () {
        let duration = audio.duration;
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60);
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center;">
                    <img src="/upload/${song.avatar}" alt="${song.name}" style="width:50px; height:50px; border-radius: 50%;">
                    <span style="margin-left: 10px;">${song.name}</span>
                </div>
            </td>
            <td>${song.artist}</td>
            <td>${song.album}</td>
            <td>${minutes}:${seconds}</td>
        `;
        row.addEventListener('click', function () {
            // 播放被点击的歌曲
            console.log("点击我的喜欢列表播放的音乐："+JSON.stringify(song, null, 2));
            playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar);
            console.log("currentSong", currentSong);

            // 如果存在之前正在播放的行，移除播放图标
            if (currentRow) {
                const icon = currentRow.querySelector(".fa-circle-play");
                if (icon) {
                    icon.parentNode.removeChild(icon);
                }
            }
            // 创建新的播放图标，并添加到当前播放的行
            const playIcon = document.createElement("i");
            playIcon.className = "fa fa-light fa-circle-play fa-beat-fade";
            playIcon.style.color = "#de0d0d";

            // 找到歌曲名字的列，并将播放图标添加到歌曲名字后面
            const songNameColumn = row.cells[0];
            songNameColumn.appendChild(playIcon);

            // 保存当前正在播放的歌曲的行
            currentRow = row;
        });
    });
    tbody.appendChild(row);
}

// 分页函数，接收当前页数和每页的行数
function paginate(page, rowsPerPage) {
    let startRow = (page - 1) * rowsPerPage;
    let endRow = startRow + rowsPerPage;

    let tbody = document.getElementById('song-data');
    let paginator = document.getElementById('paginator');

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    while (paginator.firstChild) {
        paginator.removeChild(paginator.firstChild);
    }

    for (let i = startRow; i < endRow; i++) {

        if (i < songList.length) {
            console.log("分页的歌曲："+JSON.stringify(songList[i], null, 2));
            insertSongRow(songList[i]);
        } else {
            break;
        }
    }

    for (let i = 1; i <= totalPages; i++) {
        let pageElement = document.createElement('span');
        pageElement.innerText = i;
        pageElement.addEventListener('click', function () {
            currentPage = i;
            paginate(currentPage, rowsPerPage);
        });

        if (i === page) {  // 如果是当前页，添加 'active' 类
            pageElement.className = 'active';
        }
        paginator.appendChild(pageElement);
    }
}

/****歌单里面搜索歌曲***/
document.getElementById('search').addEventListener('input', function () {
    let input = this.value.toLowerCase();  // 获取输入框的内容，并转为小写

    // 清空表格
    let tbody = document.getElementById('song-data');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // 对每首歌曲进行检查
    for (let song of songList) {
        // 如果歌曲名或歌手名包含输入的文本，那么添加到表格中
        if (song.name.toLowerCase().includes(input) || song.artist.toLowerCase().includes(input)) {
            insertSongRow(song);
        }
    }
});


// 歌曲名字排序
document.querySelector('.name-sort-asc').addEventListener('click', sortFunction(0, 1, 'asc'));
document.querySelector('.name-sort-desc').addEventListener('click', sortFunction(0, 1, 'desc'));

// 歌手名字排序
document.querySelector('.artist-sort-asc').addEventListener('click', sortFunction(1, 1, 'asc'));
document.querySelector('.artist-sort-desc').addEventListener('click', sortFunction(1, 1, 'desc'));

// 时间排序
document.querySelector('.time-sort-asc').addEventListener('click', sortFunction(3, 2, 'asc'));
document.querySelector('.time-sort-desc').addEventListener('click', sortFunction(3, 2, 'desc'));

/*// 随机排序
document.querySelectorAll('.random-sort').forEach((element) => {
    element.addEventListener('click', sortFunction(0, 0, 'random'));
});*/

// 排序函数，参数是排序的列和类型
function sortFunction(column, dataType, orderType) {
    return function () {
        let tbody = document.getElementById('song-data');
        let rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort(function (a, b) {
            let aValue = a.cells[column].innerText;
            let bValue = b.cells[column].innerText;
            if (dataType === 1) {
                // 字符串排序
                if (orderType === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            } else if (dataType === 2) {
                // 时间排序
                let aTime = aValue.split(':').map(Number);
                let bTime = bValue.split(':').map(Number);
                aTime = aTime[0] * 60 + aTime[1];
                bTime = bTime[0] * 60 + bTime[1];
                if (orderType === 'asc') {
                    return aTime - bTime;
                } else {
                    return bTime - aTime;
                }
            } else {
                // 随机排序
                return Math.random() - 0.5;
            }
        });
        // 移除所有行
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        // 添加排序后的行
        for (let row of rows) {
            tbody.appendChild(row);
        }
    }
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



/*****喜欢音乐图标切换******/
document.addEventListener('DOMContentLoaded', function() {


    let heartIconRegular = document.getElementById('heart-icon-regular');
    let heartIconSolid = document.getElementById('heart-icon-solid');

    heartIconRegular.addEventListener('click', function(e) {
        e.preventDefault();
        // 发送请求，检查用户是否已经创建了 "我的喜欢" 的歌单
        axios.get('/Music1_0_war/playlist/playlist?userId=' + currentUserId)
            .then(function(response) {
                // 如果已经创建了，就添加当前歌曲到歌单中
                let playlistId = response.data.id;
                console.log("创建了")
                addSongToPlaylist(playlistId, currentSong.id).then(() => {
                    // 重新获取歌单信息和歌曲列表
                    fetchPlaylistAndSongs(currentUserId, '我的喜欢');
                });
            })
            .catch(function(error) {
                console.log("错误", error);
                // 如果没有创建，就新建一个并添加当前歌曲
                createPlaylistAndAddSong(currentUserId, currentSong.id).then(() => {
                    // 重新获取歌单信息和歌曲列表
                    fetchPlaylistAndSongs(currentUserId, '我的喜欢');
                });
            });
        // 更新图标
        heartIconRegular.style.display = 'none';
        heartIconSolid.style.display = 'inline';
    });

    heartIconSolid.addEventListener('click', function(e) {
        e.preventDefault();

        // 发送请求，从 "我的喜欢" 的歌单中删除当前歌曲
        axios.get('/Music1_0_war/playlist/playlist?userId=' + currentUserId)
            .then(function(response) {
                let playlistId = response.data.id;
                removeSongFromPlaylist(playlistId, currentSong.id).then(() => {
                    // 重新获取歌单信息和歌曲列表
                    fetchPlaylistAndSongs(currentUserId, '我的喜欢');
                });
            });

        // 更新图标
        heartIconSolid.style.display = 'none';
        heartIconRegular.style.display = 'inline';
    });

// 创建歌单并添加歌曲的函数
    function createPlaylistAndAddSong(userId, songId) {
        console.log("创建userId:"+userId)
        console.log("我都喜欢：")
        return axios.post('/Music1_0_war/playlist/playlist', {userId: userId, name: '我的喜欢'}, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(function(response) {
            let playlistId = response.data.id;
            return addSongToPlaylist(playlistId, songId);
        });
    }

// 添加歌曲到歌单的函数
    function addSongToPlaylist(playlistId, songId) {
        console.log("添加playlistId："+playlistId)
        console.log("添加songId："+songId)
        return axios.post('/Music1_0_war/playlist/playlist_song', {playlistId: playlistId, songId: songId});
    }

// 从歌单删除歌曲的函数
    function removeSongFromPlaylist(playlistId, songId) {
        console.log("删除")
        console.log("playlistId:"+playlistId)
        console.log(" songId:"+ songId)
        return axios.delete('/Music1_0_war/playlist/playlist_songDelete?playlistId=' + playlistId + '&songId=' + songId);
    }

});



/***播放列表***/
document.querySelector('#list666').addEventListener('click', function() {
    let playlist = document.querySelector('#playlist1');
    // 如果播放列表div是隐藏的，那么显示并移动到屏幕上
    if (playlist.style.display === 'none') {
        playlist.style.display = 'block';
        playlist.style.transform = 'translateX(0)';
    } else { // 否则，将其移回原位置并隐藏
        playlist.style.transform = 'translateX(100%)';
        // 需要等待transform过渡结束后再隐藏div，否则过渡效果将不会显示
        setTimeout(function() {
            playlist.style.display = 'none';
        }, 500); // 这里的500ms应与css中的过渡时间相同
    }
});


document.querySelector('.clear').addEventListener('click', function(e) {
    // 阻止链接的默认行为（导航到新页面或刷新页面）
    e.preventDefault();

    // 清空存储歌曲的数组
    listsongs = [];

    // 清空歌曲列表的 DOM
    document.getElementById('songTable').innerHTML = '';

    // 更新显示的歌曲总数
    document.querySelector('.total1 > #totalSongs').textContent = listsongs.length;

    // 停止音乐播放
    audio.pause();

    // 将音乐播放器的当前时间设置为 0
    audio.currentTime = 0;

    // 隐藏 footer 的一部分组件
    document.querySelector('footer .footer-left').style.display = 'none';
    document.querySelector('footer .footer-middle').style.display = 'none';
});






/*******把喜欢的歌单放在播放列表里面去********/
/******播放全部歌单******/

// 获取播放全部按钮
let playAllButton = document.getElementById('play-all');

// 监听播放全部按钮的点击事件
playAllButton.addEventListener('click', function(e) {
    // 阻止按钮的默认行为（导航到新页面或刷新页面）
    e.preventDefault();

    // 清空原来的播放列表
    listsongs = [];
    // 清空歌曲列表的 DOM
    document.getElementById('songTable').innerHTML = '';
    // 遍历所有歌曲
    for(let i = 0; i < songList.length; i++) {
        let song = songList[i];
        console.log("获取播放全部按钮："+JSON.stringify(song, null, 2));
        console.log("song:"+song)
        console.log(song.id)
        console.log(song.name)
        console.log(song.artist)
        console.log(song.filepath)
        console.log(song.lyric)
        // 将歌曲添加到播放列表
        listsongs.push(song);
        // 更新显示的歌曲总数
        let songTable = document.getElementById('songTable');
        let songRow = document.createElement('tr');

        // 创建一个新的 Audio 对象以获取歌曲长度
        let audio = new Audio("/upload/"+song.filepath);
        audio.addEventListener('loadedmetadata', function () {
            let duration = audio.duration;
            let minutes = Math.floor(duration / 60);
            let seconds = Math.floor(duration % 60).toString().padStart(2, '0'); // 用0填充秒钟的左侧，确保始终显示两位数字

            // 添加新的 td 到行中，显示歌曲长度
            songRow.innerHTML = `
            <td>${song.name}</td>
            <td>${song.artist}</td>
            <td id="song-${song.id}-duration">${minutes}:${seconds}</td>
        `;
        });

        songRow.addEventListener('click', function() {
            playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar);
        });

        songTable.appendChild(songRow);
    }

    document.querySelector('.total1 > #totalSongs').textContent = listsongs.length;
    // 播放第一首歌
    let firstSong = listsongs[0];
    console.log("播放第一首歌："+JSON.stringify(firstSong, null, 2));
    playSong(firstSong.id, firstSong.filepath, firstSong.name, firstSong.artist, firstSong.lyric, firstSong.avatar);
});

/*******我的主页****/
function toggleDisplay() {
    // 获取 div 元素
    var div3 = document.getElementById('3');
    var div1 = document.getElementById('1');
    var div2 = document.getElementById('2');
    div1.style.display = "none";
    div2.style.display = "none"
    // 切换 div 的显示状态
    if (div3.style.display === "none") {
        div3.style.display = "block";
    } else {
        div3.style.display = "none";
    }


    axios.get('/Music1_0_war/user/edit1', {
        params: {
            userId: currentUserId
        }
    }).then(response => {
        console.log(response.data)
        document.getElementById('playlist-title1').textContent = response.data.nickname;
        document.getElementById('email1').textContent = response.data.email;
        document.getElementById('account').textContent = response.data.username;
        console.log("哈哈哈哈哈："+response.data.avatar)
        document.getElementById('playlist-image1').src = "/upload/" + response.data.avatar;
    });

    // 发送新的请求获取粉丝和关注数量
    axios.get('/Music1_0_war/user/getFollowerCount', {
        params: {
            userId: currentUserId
        }
    }).then(response => {
        console.log(response.data)
        document.getElementsByClassName('followerCount')[0].textContent = response.data.followerCount;
        document.getElementsByClassName('followingCount')[0].textContent = response.data.followingCount;

    });

    axios.get('/Music1_0_war/playlist/playlistsCreatedByUser', {
        params: {
            userId: currentUserId
        }
    }).then(response => {
        console.log(response.data)

        document.getElementById('song-list-tab1').addEventListener('click', function(e) {
            e.preventDefault();
            var playlistsContainer = document.getElementById('playlists-container');
            var songListTab = document.getElementById('song-list-tab1');

            // 切换 tab 的激活状态
            if (songListTab.classList.contains('active-tab')) {
                songListTab.classList.remove('active-tab');
            } else {
                songListTab.classList.add('active-tab');
            }

            if (playlistsContainer.style.display === "none") {
                playlistsContainer.style.display = "flex";
            } else {
                playlistsContainer.style.display = "none";
            }

            playlistsContainer.innerHTML = '';

            for (var i = 0; i < response.data.length; i++) {
                var playlist = response.data[i];

                var img = document.createElement('img');
                img.src = "/upload/" + playlist.avatar;
                img.alt = "Playlist Image";
                img.className = 'playlist-image';

                var playIcon = document.createElement('a');
                playIcon.classList.add('fa', 'fa-circle-play', 'play-icon');

                var span = document.createElement('span');
                span.textContent = playlist.songCount + '首';
                span.className = 'playlist-count';

                var playlistName = document.createElement('p');
                playlistName.textContent = playlist.name;
                playlistName.className = 'playlist-name';

                var div = document.createElement('div');
                div.className = 'playlist2';
                div.appendChild(img);
                div.appendChild(playIcon);
                div.appendChild(playlistName);
                div.appendChild(span);

                playlistsContainer.appendChild(div);
            }
        });


    });
}

/*******创建歌单*****/
function createPlaylist() {
    var modal = document.getElementById("create-playlist-modal");
    var link = document.getElementById("create-playlist-link");
    var close = document.getElementsByClassName("close")[0];
    var createButton = document.getElementById("create-button");
    var playlistTitle = document.getElementById("creatplaylist-title");

    var avatarImage = document.getElementById('avatarImage2');
    var avatarInput = document.getElementById('avatar2');

    avatarImage.onclick = function() {
        avatarInput.click();
    };
    avatarInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                avatarImage.src = reader.result;
            };
        }
    };

    link.onclick = function () {
        modal.style.display = "block";
    }

    close.onclick = function () {
        modal.style.display = "none";
    }

    createButton.onclick = function () {
        // 新建一个FormData对象
        var formData = new FormData();
        formData.append("name", playlistTitle.value);  // 添加歌单名
        formData.append("creator", currentUserId);  // 添加创建者ID
        formData.append("avatar", avatarInput.files[0]);  // 添加头像文件

        axios({
            method: "post",
            url: "/Music1_0_war/playlist/createdPlaylistLnfo",
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        })
            .then(function (response) {
                //处理响应数据
            })
            .catch(function (error) {
                console.error('获取操作出现了问题: ' + error.message);
            });

        modal.style.display = "none";
    }

        playlistTitle.oninput = function () {
        createButton.disabled = !this.value;
    }
}
