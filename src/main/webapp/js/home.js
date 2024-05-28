let currentUserId = null; // 当前用户ID，需要从登录信息中获取
let currentRow = null;// 当前播放的行
let listsongs = [];  //用来记录播放列表的歌曲
let currentSong = null;
let userss = null;
let songs = [];
let currentSongIndex = 0;
let songList2 = []; //获取歌单歌曲信息
let editplaylistId = null; //编辑信息时候的歌单
let deleteplaylistId = null; //被删除歌曲歌单的id
const myHome = document.getElementById('my-home');
let playLogs = []; // 播放记录
let currentPlaylistId=null;
let randomPlaylist = [];//推荐歌单
let artists = [];//歌手
let allplaylist = [];//歌单
let allsongs = [];//歌曲
let artistsPlaylists = [];//歌手歌单
let oneartist = null;//单个歌手
let artistInfo = null; //歌手简介

/***歌词****/
function parseLyrics(lyricsText) {
    let lines = lyricsText.split('\n');  // 分割每一行
    let lyrics = [];//初始化一个空数组，稍后会用于存储解析后的歌词对象。

    for (let line of lines) {
        let match = line.match(/\[(\d+):(\d+\.\d+)\](.+)/);  // 正则匹配歌词和时间  这个正则匹配的时间戳格式是[分:秒.毫秒]。
        if (match) {
            let minutes = parseInt(match[1]);//分
            let seconds = parseFloat(match[2]);//秒
            let text = match[3];//文本内容
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


document.addEventListener("DOMContentLoaded", function () {
    // 获取保存的username
    let username = sessionStorage.getItem('username');
    console.log("账号：" + username);
    // 发送请求到HomeServlet
    axios.post('/Music1_0_war/home', {
        username: username
    }).then(function (response) {
        console.log(response.data);
        userss = response.data;
        console.log("用户："+userss);
        console.log("89788："+JSON.stringify(userss, null, 2));
        console.log("用户ID："+response.data.id)
        currentUserId=response.data.id;
        if(userss.user_type==='ADMIN'||userss.user_type==='SUPER_ADMIN'){
            document.getElementById('music9').style.display = '';
            document.getElementById('music10').style.display = '';
            document.getElementById('music15').style.display = '';
            document.getElementById('music16').style.display = '';
        }
        document.querySelector('.image img').src = "/upload/"+ response.data.avatar;
        document.querySelector('.user-name').innerText = response.data.nickname;

        if (userss.is_member) {
            const userNameElement = document.querySelector('.user-name');
            userNameElement.innerText = response.data.nickname;
            userNameElement.style.color = 'red';
        }



        const queryParams = {
            userId: currentUserId
        };

        axios.get('/Music1_0_war/user/song', {
            params: queryParams
        }).then(function (response) {
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
        <img src="/upload/${Newsong.avatar}" alt="歌曲图片" width="400px" height="300px"/>
        <p>${Newsong.name}</p>
        <span class="hot_play"></span>
    `;
                listItem.addEventListener('click', function() {
                    playSong(Newsong.id,Newsong.filepath, Newsong.name, Newsong.artist, Newsong.lyric,Newsong.avatar,Newsong.is_member_song);  // add song.lyrics
                    currentSongIndex = index; // 更新当前歌曲索引
                });
                songList.appendChild(listItem);
            }
            // 从localStorage中恢复播放列表
            let savedListsongs = localStorage.getItem('listsongs-' + currentUserId);
            console.log("ssdss:"+savedListsongs)
            console.log("用户试试："+currentUserId)

            if (savedListsongs) {
                listsongs = JSON.parse(savedListsongs);
                let firstSong = listsongs[0];
                console.log("播放第一首歌："+JSON.stringify(firstSong, null, 2));
                playSong(firstSong.id, firstSong.filepath, firstSong.name, firstSong.artist, firstSong.lyric, firstSong.avatar,firstSong.is_member_song);
                audio.pause();
                for (let song of listsongs) {
                    document.querySelector('.total1 > #totalSongs').textContent = listsongs.length;
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
                        playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar,song.is_member_song);
                    });

                    songTable.appendChild(songRow);
                }

            } else {
                listsongs = [];
            }
        }).catch(function (error) {
                console.log(error);
            });

        axios({
            method: "get",
            url: "/Music1_0_war/playlist/getPlayLogs",
            params: {
                userId: currentUserId
            },
            /* responseType: 'json',  */
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            console.log('最近播放列表66666：',response.data);
            playLogs = response.data;  // 把获取到的列表赋值给 playLogs
        }).catch(function (error) {
            console.log(error);
        });
        axios({
            method: "get",
            url: "/Music1_0_war/membership/checkmembership",
            params: {
                userId: currentUserId
            },
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            console.log('最新用户：',response.data);
            if(response.data.success){
                userss = response.data.updatedUser;
            }

        }).catch(function (error) {
            console.log(error);
        });

        axios({
            method: "post",
            url: "/Music1_0_war/playlist/getAllArtistsInfo",
            headers: { "Content-Type": "application/json" },
        }).then(function (response) {
            // 解析返回的数据
            let data = response.data;
            console.log("所有歌手信息data:"+JSON.stringify(data, null, 2));
                artists = data;  // 把数据赋值给 artists
            console.log("歌手信息:"+artists[1].id)
        }).catch(function(error) {
            console.log('Error occurred: ', error);
        });

    }).catch(function (error) {
        console.log(error);
    });

    axios({
        method: "post",
        url: "/Music1_0_war/playlist/getAllPlaylistInfo",
        headers: { "Content-Type": "application/json" },
    }).then(function (response) {
            let data = response.data;
            console.log("所有歌单信息data:", JSON.stringify(data, null, 2));
            allplaylist = data;
        })
        .catch(function(error) {
            console.log('Error occurred: ', error);
        });

    axios({
        method: "post",
        url: "/Music1_0_war/user/getAllSongsInfo",
        headers: { "Content-Type": "application/json" },
    }).then(function (response) {
            let data = response.data;
            console.log("所有歌曲信息data:", JSON.stringify(data, null, 2));
            allsongs= data;
        })
        .catch(function(error) {
            console.log('Error occurred: ', error);
        });


    //登入之后获取的四首歌曲


});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


delay(2000).then(() => {
    console.log("推荐歌单KKJKSDHhks:"+currentUserId)
    axios({
        method: "post",
        url: "/Music1_0_war/playlist/getFourPlist",
        data: {
            userId: currentUserId
        },
        headers: { "Content-Type": "application/json" },
    }).then(function (response) {
        randomPlaylist = response.data;
        let playlistHTML = '';
        randomPlaylist.forEach(playlist => {
            playlistHTML += `
     <li>
       <img id="img-${playlist.id}" src="/upload/${playlist.avatar}" alt="歌曲图片" width="400px" height="300px"/>
        <p>${playlist.name}</p>
        <span class="hot_play"></span>
    </li>
    `;
        });

        document.querySelector('#play-list').innerHTML = playlistHTML;

        randomPlaylist.forEach(playlist => {
            let imgElement = document.querySelector(`#img-${playlist.id}`);
            imgElement.addEventListener('click', function() {
                const div2 = document.getElementById('2');
                const div1 = document.getElementById('1');
                const div3 = document.getElementById('3');
                const div4 = document.getElementById('4');
                const div5 = document.getElementById('5');
                div2.style.display = 'block';
                div1.style.display = 'none';
                div3.style.display = 'none';
                div4.style.display = 'none';
                div5.style.display = 'none';

                console.log("点击了")
                console.log(playlist.id);
                deleteplaylistId = playlist.id;
                fetchPlaylistAndSongs1(playlist.id); // 使用当前播放列表的id调用函数
            });
        });

    })
        .catch(function (error) {
            console.log(error);
        });
});



myHome.addEventListener('click', function() {
    toggleDisplay(userss);
    var div4 = document.getElementById('4');
    div4.style.display = 'none';
    var div6 = document.getElementById('6');
    div6.style.display = "none";
});

let playIcon = document.querySelector('.play'); //开始按钮
let pauseIcon = document.querySelector('.pause');//暂停按钮
// 获取音频元素
let audio = document.getElementById('audio-player');


let userScrolling = false;  //添加一个标志 userScrolling 来记录用户是否正在手动滑动滚动条：
var isPlaybackDisabled = false; // 添加标志以控制播放暂停按钮的禁用状态
// 定义下载点击事件监听器
function downloadClickListener(isMemberSong, userId_is_member, songId, songName, artistName) {
    console.log("歌曲：" + isMemberSong);
    console.log("用户：" +  userId_is_member);

    if (isMemberSong &&  !userId_is_member) {
        alert("非会员用户不能下载会员歌曲。");
    } else {

        // 更新歌曲信息和下载链接
        let songInfo = document.getElementById('song-info');
        songInfo.textContent = songName + ' - ' + artistName;

        let musicLink = document.querySelector(".download-links li:nth-child(1) a");
        let coverLink = document.querySelector(".download-links li:nth-child(2) a");
        let lyricLink = document.querySelector(".download-links li:nth-child(3) a");

        musicLink.href = "/Music1_0_war/download?songId=" + songId + "&type=music";
        coverLink.href = "/Music1_0_war/download?songId=" + songId + "&type=cover";
        lyricLink.href = "/Music1_0_war/download?songId=" + songId + "&type=lyric";

        // 显示下载弹出框和背景
        document.getElementById('downloadModal').style.display = 'block';
        document.getElementById('modalBackdrop').style.display = 'block';
    }
}

const down = document.getElementById('download-link');
let previousClickListener = null; // 用于保存之前的点击监听器

var isTrialTimeAlertShown = false; // 添加标志以追踪试听时间限制弹窗的状态

function playSong(id,filepath, name, artist, lyric, avatar,is_member_song) {
/*    var is_member_song = (is_member_song === "true");*/
    console.log("传进来的是不是会员音乐",is_member_song)
    let songlos = {id, filepath, name, artist, lyric, avatar,is_member_song};


// 移除之前的点击监听器
    if (previousClickListener) {
        down.removeEventListener("click", previousClickListener);
    }

    previousClickListener = function () {
        downloadClickListener(is_member_song, userss.is_member, id, name, artist);
    };

    // 添加新的点击监听器
    down.addEventListener("click", previousClickListener);


    document.getElementById('modalBackdrop').addEventListener('click', function() {
        document.getElementById('downloadModal').style.display = 'none';
        document.getElementById('modalBackdrop').style.display = 'none';
    });

    var audio = document.getElementById('audio-player');

    // 判断是否为非会员用户
    var isNonMember = !userss.is_member;
    var hasTrialTimeLimit = false;

    if (currentSong === null || currentSong.filepath !== filepath) {
        if (currentSong !== null && currentSong.is_member_song && isNonMember) {
            audio.removeEventListener('timeupdate', trialTimeListener);
        }

        audio.src = "/upload/" + filepath;
        currentSong = { id, filepath, name, artist, lyric, avatar, is_member_song };

        console.log("当前音乐的哈哈哈哈ID：" + currentSong.id);
        console.log("是音乐会员吗ID：" + currentSong.is_member_song);
        console.log("用户是会员吗D：" + isNonMember);

        if (currentSong.is_member_song && isNonMember) {
            var trialTimeLimit = 30;

            var trialTimeListener = function () {


                if (!hasTrialTimeLimit && audio.currentTime >= trialTimeLimit) {
                    hasTrialTimeLimit = true;
                    audio.pause();
                    isPlaybackDisabled = true; // 设置标志为true，禁用播放暂停按钮
                    alert("非会员用户只能试听" + trialTimeLimit + "秒" + "    开通会员即可享受高质量音乐");

                    currentSongIndex++;
                    if (currentSongIndex >= listsongs.length) {
                        currentSongIndex = 0;
                    }
                    if (listsongs.length === 1) {
                        audio.currentTime = 0; // 重置音乐进度为0
                        progressBar.value = audio.currentTime / audio.duration;
                    }
                    playSong(listsongs[currentSongIndex].id, listsongs[currentSongIndex].filepath, listsongs[currentSongIndex].name, listsongs[currentSongIndex].artist, listsongs[currentSongIndex].lyric, listsongs[currentSongIndex].avatar, listsongs[currentSongIndex].is_member_song);
                }
            };
            audio.addEventListener('timeupdate', trialTimeListener);
        } else {
            hasTrialTimeLimit = false;
        }
    }

    audio.play();






    // 检查歌曲是否已经在播放列表中
    if (!listsongs.find(song => song.id === id)) {
        // 如果不在播放列表中，将其添加到 listsongs 并添加到播放列表的 DOM 中
        let song = {id, filepath, name, artist, lyric, avatar,is_member_song};
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
            playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar,song.is_member_song);
        });

        songTable.appendChild(songRow);
    }




    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    console.log("更新的歌曲："+id)
    setTimeout(() => {
        axios({
            method: "post",
            url: "/Music1_0_war/playlist/updateSongTimes",
            data: {
                id:id
            },
            headers: { "Content-Type": "application/json" },
        }).then(function (response) {
            console.log("更新播放次数：" + response.data);
            // 检查更新是否成功
            if (response.data) {
                console.log('播放次数更新成功');
            } else {
                console.log('播放次数更新失败');
            }
        });
    }, 2000);
    // 当放歌的时候恢复底框
    document.querySelector('footer .footer-left').style.display = '';
    document.querySelector('footer .footer-middle').style.display = '';
    // 检查歌曲是否已经在播放记录中
    console.log("检查歌曲是否已经在播放记录中:"+JSON.stringify(playLogs, null, 2));
    console.log(songlos)
    console.log(currentUserId)
    let foundLog = playLogs.find(log => log.songs.id === id && log.user_id == currentUserId);
    let currentTime = new Date();
    let currentDateTime = currentTime.getFullYear() + '-'
        + (currentTime.getMonth()+1).toString().padStart(2, '0') + '-'
        + currentTime.getDate().toString().padStart(2, '0') + ' '
        + currentTime.getHours().toString().padStart(2, '0') + ':'
        + currentTime.getMinutes().toString().padStart(2, '0') + ':'
        + currentTime.getSeconds().toString().padStart(2, '0');

    console.log('currentDateTime',currentDateTime)
    if (foundLog) {
        // 如果在播放记录中，更新播放时间
        foundLog.play_time = currentDateTime;
    } else {
        // 如果不在播放记录中，创建新的播放记录并添加到数组
        playLogs.push({
            user_id: currentUserId,
            songs: songlos,
            play_time: currentDateTime
        });
    }
    console.log("插入最近播放:"+JSON.stringify(playLogs, null, 2));

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




    playIcon.style.display = 'none';
    pauseIcon.style.display = '';




    var footerLeft = document.getElementsByClassName('footer-left')[0];
    var songImageElement = footerLeft.getElementsByTagName('img')[0];  // 得到img元素
    var songDetails = document.getElementsByClassName('song-details')[0];
    var songNameElement = songDetails.getElementsByClassName('song-name')[0];
    var artistNameElement = songDetails.getElementsByClassName('artist-name')[0];

    var isMemberSong = is_member_song; // 根据您的逻辑，获取当前歌曲是否为会员歌曲
    console.log('7878787798798',isMemberSong)



    songImageElement.src = "/upload/"+ avatar; // 设置img的src
    songNameElement.innerText = name;
    artistNameElement.innerText = artist;


// 修改歌曲名称
    if (isMemberSong) {
        console.log('九零六十点三')
        songNameElement.innerHTML = songNameElement.innerHTML + '<span class="membership-tag">   会员专属</span>';
    }

// 添加红色边框样式
    if (isMemberSong) {
        console.log('九零反对犯得上发六十点三')
        songNameElement.classList.add('member-song');
    }

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
                p.classList.add('lyric-line');
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
            playSong(listsongs[currentSongIndex].id,listsongs[currentSongIndex].filepath, listsongs[currentSongIndex].name, listsongs[currentSongIndex].artist, listsongs[currentSongIndex].lyric,listsongs[currentSongIndex].avatar,listsongs[currentSongIndex].is_member_song);
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
let playModes = ["repeat", "single-repeat", "random"]; // 播放模式
let playModeIcons = ["fa-arrows-spin", "fa-1", "fa-random"]; // FontAwesome图标类名
let playModeNames = ["循环播放", "单曲循环", "随机播放"]; // 播放模式的名称
let playModeIndex = 0; // 默认播放模式为“repeat”

// 切换播放模式的点击事件
document.querySelector('#play-mode').addEventListener('click', function() {
    // 移除旧的图标类名
    this.classList.remove(playModeIcons[playModeIndex]);

    // 索引加1，如果超过数组长度，则返回到第一个
    playModeIndex = (playModeIndex + 1) % playModes.length;

    // 添加新的图标类名
    this.classList.add(playModeIcons[playModeIndex]);

    // 修改工具提示的文本
    this.title = playModeNames[playModeIndex];

    // 显示播放模式
    let tooltip = document.querySelector('#play-mode-tooltip');
    tooltip.style.display = 'block';
    tooltip.innerText = playModeNames[playModeIndex];

    // 1秒后隐藏
    setTimeout(function() {
        tooltip.style.display = 'none';
    }, 1500);
});


audio.addEventListener('ended', function() {
    if (playModes[playModeIndex] === "random") {
        // 随机播放
        currentSongIndex = Math.floor(Math.random() * listsongs.length);
    } else if (playModes[playModeIndex] === "repeat") {
        // 循环播放
        currentSongIndex++;
        if (currentSongIndex >= listsongs.length) {
            currentSongIndex = 0;
        }
    } else if (playModes[playModeIndex] === "single-repeat") {
        // 单曲循环，不需要改变 currentSongIndex
    }
    playSong(listsongs[currentSongIndex].id,listsongs[currentSongIndex].filepath, listsongs[currentSongIndex].name, listsongs[currentSongIndex].artist, listsongs[currentSongIndex].lyric,listsongs[currentSongIndex].avatar,listsongs[currentSongIndex].is_member_song);
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


        playSong(listsongs[currentSongIndex].id,listsongs[currentSongIndex].filepath, listsongs[currentSongIndex].name, listsongs[currentSongIndex].artist, listsongs[currentSongIndex].lyric,listsongs[currentSongIndex].avatar,listsongs[currentSongIndex].is_member_song);
    }
});

// 设置下一首按钮的点击事件
document.querySelector('.next').addEventListener('click', function() {

    if (listsongs.length > 0) {
        currentSongIndex++;
        if (currentSongIndex >= listsongs.length) {
            currentSongIndex = 0;
        }
        playSong(listsongs[currentSongIndex].id,listsongs[currentSongIndex].filepath, listsongs[currentSongIndex].name, listsongs[currentSongIndex].artist, listsongs[currentSongIndex].lyric,listsongs[currentSongIndex].avatar,listsongs[currentSongIndex].is_member_song);
    }
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
        document.getElementById('My-member').innerHTML = response.data.membershipEndDate;
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

            // 更新我的主页的昵称和头像
            document.getElementById('playlist-title1').textContent = response.data.nickname;
            document.getElementById('playlist-image1').src = "/upload/" + response.data.avatar;
            console.log(response);
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = "block";
            setTimeout(function() {
                console.log("执行来吗")
                successMessage.style.display = "none";
            }, 2000);
            overlay.style.display = "none";
            modal.style.display = "none";

            document.body.style.overflow = "auto";
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


function modifyClass(ids, action, className = 'active') {
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList[action](className);
        }
    });
}

const music1 = document.getElementById('music1');
const music2 = document.getElementById('music2');
const music3 = document.getElementById('music3');
const music4 = document.getElementById('music4');
const  music6 = document.getElementById('music6');
const div1 = document.getElementById('1');
const div2 = document.getElementById('2');
const div3 = document.getElementById('3');
const div4 = document.getElementById('4');
const div5 = document.getElementById('5');
const div6 = document.getElementById('6');
const div8 = document.getElementById('8');
const div10 = document.getElementById('10');
const div11 = document.getElementById('11');
const div12 = document.getElementById('12');
const  music7 = document.getElementById('music7');
const  music9 = document.getElementById('music9');
const  music10 = document.getElementById('music10');
var dynamicList = document.getElementById('dynamicList');
music3.addEventListener('click', function(event) {
    event.preventDefault();

    const children = document.querySelectorAll('.main-right > div');
    children.forEach(child => {
        child.style.display = 'none';
    });


console.log("789465")
// 清空dynamicList的内容
    dynamicList.innerHTML = '';
    /*selectedFiles = null;*/
    axios({
        method: "get",
        url: "/Music1_0_war/search/getPosts",
        params: {
            userId: currentUserId
        },
        headers: {"Content-Type": "multipart/form-data"},
    }).then(function (response) {
        // 获取动态信息
        let dynamics = response.data;

        // 渲染每一条动态信息
        dynamics.forEach(dynamic => {
            // 提取数据
            const user = {
                id: dynamic.users.id,
                nickname: dynamic.users.nickname,
                avatar: '/upload/'+dynamic.users.avatar
            };

            const content = dynamic.content;


            const song = dynamic.song_id ? {
                type: dynamic.playlist_id ? 'playlist' : 'song',
                id: dynamic.song_id,
                name: dynamic.songs.name,
                artist: dynamic.songs.artist,
                filepath: dynamic.songs.filepath,
                lyric: dynamic.songs.lyric,
                avatar: dynamic.songs.avatar,
            } : null;

            const images = dynamic.images.map(img => img.image_path);
            const totalLikes = dynamic.TotalLikes;
            // 使用renderDynamic函数渲染
            renderDynamic1(dynamic.post_id,dynamic.post_time,user, content, song, images,totalLikes);
        });

    }).catch(function (error) {
        console.log(error);
    });

    if (div10.style.display === 'none') {
        div10.style.display = '';
    }
    div2.style.display = 'none';
    div3.style.display = 'none';
    div5.style.display = 'none';
    div8.style.display = 'none';
    div6.style.display = 'none';
    div1.style.display = 'none';
    div4.style.display = 'none';
    div11.style.display = 'none';
    div12.style.display = 'none';
    music3.classList.toggle('active');
    music2.classList.remove('active');
    music4.classList.remove('active');
    music6.classList.remove('active');
    music1.classList.remove('active');
    music7.classList.remove('active');
    music9.classList.remove('active');
    music10.classList.remove('active');
});
music7.addEventListener('click', function(event) {
    event.preventDefault();
    const children = document.querySelectorAll('.main-right > div');
    children.forEach(child => {
        child.style.display = 'none';
    });

        div11.style.display = 'block';
        div1.style.display = 'none';
        div4.style.display = 'none';
        div2.style.display = 'none';
        div3.style.display = 'none';
        div5.style.display = 'none';
        div8.style.display = 'none';
        div10.style.display = 'none';
        div12.style.display = 'none';
        // 发送请求获取相关音乐数据
    axios.get("/Music1_0_war/Uploadedmusic/getUploadedmusic", {
        params: {
            userId: currentUserId
        }
    }).then(response => {
            // 验证返回数据
            if (response.data.status === "success" && response.data.songs) {
                // 清空当前的歌曲列表
                const tbody = document.getElementById('upload-music');
                tbody.innerHTML = '';
                // 使用返回的数据更新表格
                response.data.songs.forEach(songInfo => {
                    populateUploadedMusic(songInfo);
                });

                div11.style.display = 'block';
            }
        }).catch(error => {
            console.error('Error fetching the songs:', error);
        });

    music7.classList.toggle('active');
    music2.classList.remove('active');
    music4.classList.remove('active');
    music6.classList.remove('active');
    music1.classList.remove('active');
    music3.classList.remove('active');
    music9.classList.remove('active');
    music10.classList.remove('active');
});
// 初始化，两部分都不显示
div1.style.display = 'none';
div2.style.display = 'none';
div4.style.display ='none';
music1.addEventListener('click', function(event) {
    event.preventDefault();
    const children = document.querySelectorAll('.main-right > div');
    children.forEach(child => {
        child.style.display = 'none';
    });
        div1.style.display = 'block';
        div2.style.display = 'none';
        div3.style.display = 'none';
        div4.style.display = 'none';
        div5.style.display = 'none';
        div6.style.display = 'none';
        div8.style.display = 'none';
        div10.style.display = 'none';
        div11.style.display = 'none';
         div12.style.display = 'none';

    music1.classList.toggle('active');
    music2.classList.remove('active');
    music4.classList.remove('active');
    music6.classList.remove('active');
    music7.classList.remove('active');
    music3.classList.remove('active');
    music9.classList.remove('active');
    music10.classList.remove('active');
});

music2.addEventListener('click', function(event) {
    event.preventDefault();
    const children = document.querySelectorAll('.main-right > div');
    children.forEach(child => {
        child.style.display = 'none';
    });
    if (div2.style.display === 'none') {
        div2.style.display = 'block';
        div1.style.display = 'none';
        div3.style.display = 'none';
        div4.style.display ='none';
        div5.style.display ='none';
        div6.style.display ='none';
        div8.style.display ='none';
        div10.style.display = 'none';
        div11.style.display = 'none';
        div12.style.display = 'none';
        // 获取歌单信息和歌曲列表
        fetchPlaylistAndSongs(currentUserId, '我的喜欢');
    }
    music2.classList.toggle('active');
    music1.classList.remove('active');
    music4.classList.remove('active');
    music6.classList.remove('active');
    music3.classList.remove('active');
    music7.classList.remove('active');
    music9.classList.remove('active');
    music10.classList.remove('active');
});

window.onload = function() {

    music1.click();

}


// 显示我的喜欢歌曲
document.addEventListener('DOMContentLoaded', function() {
    const songList = document.getElementById('song-list1');
    const paginator = document.getElementById('paginator');
    const commentSection = document.getElementById('comment-section');
    const songListTab = document.getElementById('song-list-tab');
    const commentsTab = document.getElementById('comments-tab');
    const collectorsTab = document.getElementById('collectors-tab');

    function resetTabs() {
        songListTab.classList.remove('active-tab');
        commentsTab.classList.remove('active-tab');
        collectorsTab.classList.remove('active-tab');
    }

    function hideAllSections() {
        songList.style.display = "none";
        paginator.style.display = "none";
        commentSection.style.display = "none";
    }

    songListTab.addEventListener('click', function(e) {
        e.preventDefault();
        resetTabs();
        hideAllSections();

        songList.style.display = "block";
        paginator.style.display = "flex";
        e.target.classList.add('active-tab');

        paginator.style.justifyContent = "center";
        paginator.style.alignItems = "center";
        paginator.style.margin = "20px 0";
    });

    commentsTab.addEventListener('click', function(e) {
        e.preventDefault();
        resetTabs();
        hideAllSections();

        commentSection.style.display = "block";
        e.target.classList.add('active-tab');
    });

    collectorsTab.addEventListener('click', function(e) {
        e.preventDefault();
        resetTabs();
        hideAllSections();
        e.target.classList.add('active-tab');
    });
});


let currentPage = 1;  // 当前页数
let rowsPerPage = 6;  // 每页显示的行数
let totalPages; //中共
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
        console.log('66',playlistInfo)
        if(playlistInfo===null){

        }else{
            console.log("playlistInfo歌单信息：" + playlistInfo)
            console.log("playlistInfo.image:" + playlistInfo.playlist.avatar)
            console.log("playlistInfo.name:" + playlistInfo.playlist.name)
            //console.log("")
            currentPlaylistId = playlistInfo.playlist.id;
            document.getElementById('playlist-image').src = "/upload/" + playlistInfo.playlist.avatar;
            document.getElementById('playlist-creator').innerText = playlistInfo.creator.nickname;
            document.getElementById('creator-image').src = "/upload/" + playlistInfo.creator.avatar;
            document.getElementById('playlist-title').innerText = playlistInfo.playlist.name;

            document.getElementById('playlist-date').innerText = playlistInfo.playlist.created_time;
            document.getElementById('play-count').innerText = playlistInfo.playlist.play_count;
            const creatorImage = document.getElementById('creator-image');
            const playlistCreatorLink = document.getElementById('playlist-creator');
            // 移除之前的点击事件监听器
            if(creatorImage._clickEvent) {
                creatorImage.removeEventListener('click', creatorImage._clickEvent);
            }

            if(playlistCreatorLink._clickEvent) {
                playlistCreatorLink.removeEventListener('click', playlistCreatorLink._clickEvent);
            }

            // 添加新的点击事件监听器
            creatorImage._clickEvent = function (e) {
                e.preventDefault();
                console.log('1点击主页的ID：', playlistInfo.creator.id)
                toggleDisplay(playlistInfo.creator);
            };
            const collect = document.getElementById('collect');
            if(currentUserId==playlistInfo.creator.id){
                collect.style.display = 'none';
            }

            playlistCreatorLink._clickEvent = function (e) {
                e.preventDefault();
                console.log('2点击主页的ID：', playlistInfo.creator.id)
                toggleDisplay(playlistInfo.creator);
            };
            creatorImage.addEventListener('click', creatorImage._clickEvent);
            playlistCreatorLink.addEventListener('click', playlistCreatorLink._clickEvent);
        }

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
            insertSongRow(songList[i]);
        } else {
            break;
        }
    }

    let prevElement = document.createElement('span');
    prevElement.innerText = "上一页";
    if (currentPage > 1) {
        prevElement.addEventListener('click', function () {
            currentPage--;
            paginate(currentPage, rowsPerPage);
        });
    } else {
        prevElement.className = 'disabled';
    }
    paginator.appendChild(prevElement);

    let firstElement = document.createElement('span');
    firstElement.innerText = 1;
    firstElement.addEventListener('click', function () {
        currentPage = 1;
        paginate(currentPage, rowsPerPage);
    });
    if (currentPage === 1) {
        firstElement.className = 'active';
    }
    paginator.appendChild(firstElement);

    if (currentPage - 3 > 2) {
        let dots = document.createElement('span');
        dots.innerText = '..';
        paginator.appendChild(dots);
    }

    for (let i = Math.max(2, currentPage - 3); i <= Math.min(totalPages - 1, currentPage + 3); i++) {
        let pageElement = document.createElement('span');
        pageElement.innerText = i;
        pageElement.addEventListener('click', function () {
            currentPage = i;
            paginate(currentPage, rowsPerPage);
        });
        if (i === page) {
            pageElement.className = 'active';
        }
        paginator.appendChild(pageElement);
    }

    if (currentPage + 3 < totalPages) {
        let dots = document.createElement('span');
        dots.innerText = '..';
        paginator.appendChild(dots);
    }

    if (totalPages > 1) {
        let lastElement = document.createElement('span');
        lastElement.innerText = totalPages;
        lastElement.addEventListener('click', function () {
            currentPage = totalPages;
            paginate(currentPage, rowsPerPage);
        });
        if (currentPage === totalPages) {
            lastElement.className = 'active';
        }
        paginator.appendChild(lastElement);
    }


    let nextElement = document.createElement('span');
    nextElement.innerText = "下一页";
    if (currentPage < totalPages) {
        nextElement.addEventListener('click', function () {
            currentPage++;
            paginate(currentPage, rowsPerPage);
        });
    } else {
        nextElement.className = 'disabled';  // style for disabled button
    }
    paginator.appendChild(nextElement);
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

let isPanelShown = false; // 初始状态为隐藏

$(".footer-left").on("click", function() {
    if (!isPanelShown) {
        // 延迟显示面板
            $(".lyrics-panel").css({
                'height': `calc(100vh - ${footerHeight}px)`,
                'bottom': `${footerHeight}px`
            });
            $(".lyrics-panel").show();
        isPanelShown = true; // 更新状态为显示
    } else {
        // 隐藏面板
        $(".lyrics-panel").css('bottom', '100%');
        setTimeout(() => {
            $(".lyrics-panel").hide();
        }, 400); // 延迟隐藏，根据动画的时间调整
        isPanelShown = false; // 更新状态为隐藏
    }
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
        console.log("添加 playlistId：" + playlistId);
        console.log("添加 songId：" + songId);

        // 将 songId 转换为浮点数
        const parsedSongId = parseFloat(songId);

        // 发送 POST 请求
        return axios.post('/Music1_0_war/playlist/playlist_song', { playlistId: playlistId, songId: parsedSongId });
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
            playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar,song.is_member_song);
        });

        songTable.appendChild(songRow);
    }

    document.querySelector('.total1 > #totalSongs').textContent = listsongs.length;
    // 播放第一首歌
    let firstSong = listsongs[0];
    console.log("播放第一首歌："+JSON.stringify(firstSong, null, 2));
    playSong(firstSong.id, firstSong.filepath, firstSong.name, firstSong.artist, firstSong.lyric, firstSong.avatar,firstSong.is_member_song);
});



// 全局函数定义，这样其他地方也可以使用
function createContextMenu(playlist, div, contextMenu) {
    div.deletePlaylistId = null;
    const div2 = document.getElementById('2');
    const div3 = document.getElementById('3');
    // 当div被点击时，调用fetchPlaylistAndSongs1函数并显示播放列表详情界面
    div.addEventListener('click', function() {
        div2.style.display = 'block';
        div3.style.display = 'none';
        console.log("点击了")
        console.log(playlist.id)
        deleteplaylistId = playlist.id
        fetchPlaylistAndSongs1(playlist.id); // 使用当前播放列表的id调用函数
    });
    div.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        console.log("歌单id:" + playlist.id);
        div.deletePlaylistId = playlist.id;
        contextMenu.style.display = 'block';
    });

    window.addEventListener('click', function(e) {
        if (!contextMenu.contains(e.target) && !div.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });
    document.getElementById('delete-button').addEventListener('click', function(e) {
        div.remove();
    });
}


let currentID =null;//当前用户
/*******我的主页****/
function toggleDisplay(user) {
    let userId  = user.id;
    console.log("获取的Id66666666666666:" + userId)
    // 获取 div 元素
    currentID =  user.id;
    var div1 = document.getElementById('1');
    var div2 = document.getElementById('2');
    var div3 = document.getElementById('3');
    var div4 = document.getElementById('4');
    var div5 = document.getElementById('5');
    var div8 = document.getElementById('8');
    var div9 = document.getElementById('9');
    var div10 = document.getElementById('10');


    var playlistTitle1 = document.getElementById('playlist-title1');
    var email1 = document.getElementById('email1');
    var account = document.getElementById('account');
    var playlistImage1 = document.getElementById('playlist-image1');
    var followerCount = document.getElementsByClassName('followerCount')[0];
    var followingCount = document.getElementsByClassName('followingCount')[0];
    var playlistsContainer = document.getElementById('playlists-container');
    var playlistsContainer1 = document.getElementById('playlists-container1');
    var songListTab = document.getElementById('song-list-tab1');
    var songListTab1 = document.getElementById('comments-tab1');
    const editInfoLink = document.getElementById('edit-info');
    const followLink = document.getElementById('edit-info1');

    // 清除内容
    playlistTitle1.textContent = '';
    email1.textContent = '';
    account.textContent = '';
    playlistImage1.src = '';
    followerCount.textContent = '';
    followingCount.textContent = '';
    playlistsContainer.innerHTML = '';
    playlistsContainer1.innerHTML = '';

    div1.style.display = "none";
    div2.style.display = "none"
    div4.style.display = "none";
    div5.style.display = "none";
    div8.style.display = "none";
    div9.style.display = "none";
    div10.style.display = "none";


    // 切换 div 的显示状态
    div3.style.display = div3.style.display === "none" ? "block" : "none";

    userId = parseInt(userId);
    currentUserId = parseInt(currentUserId);
    console.log("userID:" + userId)
    console.log("currentUserId:" + currentUserId)
    console.log(userId === currentUserId)

    editInfoLink.style.display = (userId === currentUserId) ? "block" : "none";
    followLink.style.display = (userId === currentUserId) ? "none" : "block";
    const followingLink = document.querySelector("#followingCount").parentNode;
    const followerLink = document.querySelector("#followerCount").parentNode;

    if (userId === currentUserId) {
        // Enable the links
        followingLink.style.pointerEvents = "auto";
        followerLink.style.pointerEvents = "auto";
        followingLink.style.cursor = "pointer";
        followerLink.style.cursor = "pointer";
        followingLink.style.opacity = "1";
        followerLink.style.opacity = "1";
    } else {
        // Disable the links
        followingLink.style.pointerEvents = "none";
        followerLink.style.pointerEvents = "none";
        followingLink.style.cursor = "default";
        followerLink.style.cursor = "default";
        followingLink.style.opacity = "0.7";
        followerLink.style.opacity = "0.7";
    }


// 在这里添加检查用户是否已关注这个用户的代码
    axios({
        method: "post",
        url: "/Music1_0_war/playlist/judgmentFollowUser",
        data: {
            userId: currentUserId,
            followedId: userId
        },
        headers: {"Content-Type": "application/json"},
    }).then(function (response) {
        if (response.data === true) {
            document.getElementById('edit-info1').textContent = "已关注";
        }
    }).catch(function (error) {
        console.error('Error:', error);
    });

    fetchUserDetails(userId);


    fetchFollowCounts(userId);


    handlePlayListActions(userId, songListTab, playlistsContainer, songListTab1, playlistsContainer1);

    handleUserLinkActions(currentUserId, user, followingLink, followerLink);

}
// 使用上述函数

const userName = document.querySelector('#user-name');
const displayDiv = document.getElementById('9');
const followingLink = document.querySelector('#followingCount').parentNode;
const followerLink = document.querySelector('#followerCount').parentNode;
const followsList = document.getElementById('follows-list');
const followerList = document.getElementById('followller-list');
// 创建关注链接的事件处理函数

function createFollowingLinkHandler(user) {
    return function(e) {
        e.preventDefault();
        console.log('点击了吗',55)
        axios({
            method: "get",
            url: "/Music1_0_war/search/getfollowsUser",
            params: {
                userId: currentUserId
            },
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            console.log('关注信息：', response.data);
            const followsListDiv = document.getElementById('follows-list');
            followsListDiv.innerHTML = ''; // 清空先前的列表内容
            let ul = document.createElement('ul');
            ul.style.marginTop = '30px';

            response.data.forEach(user => {
                let li = document.createElement('li');
                // 添加li的样式
                li.style.width = '25%';
                li.style.textAlign = 'center';
                li.style.boxSizing = 'border-box';
                li.style.float = 'left';
                // 为li添加点击事件
                li.addEventListener('click', function() {
                    toggleDisplay(user);
                });
                let img = document.createElement('img');
                img.src = '/upload/'+user.avatar;
                img.alt = user.nickname;

                // 设置图片样式
                img.style.borderRadius = '50%';
                img.style.transition = 'transform 0.3s ease';
                img.style.width = '200px';  // 你可以根据需要设置这个值
                img.style.height = '200px';  // 你可以根据需要设置这个值
                img.style.objectFit = 'cover';  // 确保图片内容都在边界内

                img.onmouseover = function() {
                    img.style.transform = 'scale(1.1)';
                }
                img.onmouseout = function() {
                    img.style.transform = 'scale(1.0)';
                }

                let span = document.createElement('span');
                span.textContent = user.nickname;

                li.appendChild(img);
                li.appendChild(span);
                ul.appendChild(li);
            });
            followsListDiv.appendChild(ul);
        }).catch(function (error) {
            console.log(error);
        });
        userName.textContent = `${user.nickname}的关注`;
        followsList.style.display = 'block';           // Show the follows list
        followerList.style.display = 'none';           // Hide the follower list
        displayDiv.style.display = 'block';            // Show the main div
        div1.style.display = 'none';
        div2.style.display = 'none';
        div3.style.display = 'none';
        div4.style.display = 'none';
        div5.style.display = 'none';
        div6.style.display = 'none';
        div8.style.display = 'none';
    };
}

// 创建粉丝链接的事件处理函数
function createFollowerLinkHandler(user) {
    return function(e) {
        e.preventDefault();
        console.log('点击了吗',66)
        axios({
            method: "get",
            url: "/Music1_0_war/search/getfollowersUser",
            params: {
                userId: currentUserId
            },
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            console.log('关注信息：', response.data);
            const followsListDiv = document.getElementById('followller-list');
            followsListDiv.innerHTML = ''; // 清空先前的列表内容
            let ul = document.createElement('ul');
            ul.style.marginTop = '30px';

            response.data.forEach(user => {
                let li = document.createElement('li');
                // 添加li的样式
                li.style.width = '25%';
                li.style.textAlign = 'center';
                li.style.boxSizing = 'border-box';
                li.style.float = 'left';
                // 为li添加点击事件
                li.addEventListener('click', function() {
                    toggleDisplay(user);
                });
                let img = document.createElement('img');
                img.src = '/upload/'+user.avatar;
                img.alt = user.nickname;

                // 设置图片样式
                img.style.borderRadius = '50%';
                img.style.transition = 'transform 0.3s ease';
                img.style.width = '200px';  // 你可以根据需要设置这个值
                img.style.height = '200px';  // 你可以根据需要设置这个值
                img.style.objectFit = 'cover';  // 确保图片内容都在边界内

                img.onmouseover = function() {
                    img.style.transform = 'scale(1.1)';
                }
                img.onmouseout = function() {
                    img.style.transform = 'scale(1.0)';
                }

                let span = document.createElement('span');
                span.textContent = user.nickname;

                li.appendChild(img);
                li.appendChild(span);
                ul.appendChild(li);
            });
            followsListDiv.appendChild(ul);
        }).catch(function (error) {
            console.log(error);
        });
        userName.textContent = `${user.nickname}的粉丝`; // Change the text content of h1
        followsList.style.display = 'none';            // Hide the follows list
        followerList.style.display = 'block';          // Show the follower list
        displayDiv.style.display = 'block';            // Show the main div
        div1.style.display = 'none';
        div2.style.display = 'none';
        div3.style.display = 'none';
        div4.style.display = 'none';
        div5.style.display = 'none';
        div6.style.display = 'none';
        div8.style.display = 'none';
    };
}

// 处理用户链接的动作
function handleUserLinkActions(userId, user, followingLink, followerLink) {
    // 首先移除旧的事件监听器
    if (followingLink._clickHandler) {
        followingLink.removeEventListener('click', followingLink._clickHandler);
    }

    if (followerLink._clickHandler) {
        followerLink.removeEventListener('click', followerLink._clickHandler);
    }

    // 创建并绑定事件处理函数
    followingLink._clickHandler = createFollowingLinkHandler(user);
    followerLink._clickHandler = createFollowerLinkHandler(user);

    followingLink.addEventListener('click', followingLink._clickHandler);
    followerLink.addEventListener('click', followerLink._clickHandler);
}




const followLink1 = document.getElementById('edit-info1');
// 定义关注和取消关注用户的方法
function toggleArtistCollection1(userId, followID, isCollecting) {
    console.log('usweId',userId)
    console.log('followID',followID)
    var url = isCollecting
        ? "/Music1_0_war/playlist/FollowUser"
        : "/Music1_0_war/playlist/unfollowUser";
    axios({
        method: "post",
        url: url,
        data: {
            userId: userId,
            followedId: followID
        },
        headers: {"Content-Type": "application/json"},
    }).then(function (response) {
        if (response.data === true) {
            var message = isCollecting
                ? '已关注'
                : '关注';
            followLink1.textContent = message;

            var messageDisplay = isCollecting
                ? 'collectMessage'
                : 'successMessage';
            const messageElement = document.getElementById(messageDisplay);
            messageElement.style.display = "block";
            setTimeout(function() {
                messageElement.style.display = "none";
            }, 1000);

            // 更新关注和粉丝数量
            fetchFollowCounts(followID);
        } else {
            const failMessage = document.getElementById('failcollectMessage');
            failMessage.style.display = "block";
            setTimeout(function() {
                failMessage.style.display = "none";
            }, 1000);
        }
    }).catch(function (error) {
        console.error('Error:', error);
    });
}


followLink1.addEventListener('click', function() {
    var isCollecting = followLink1.textContent !== "已关注";
    if (!isCollecting) {
        var confirmAction = confirm("确定要取消关注吗？");
        if (confirmAction != true) {
            return;
        }
    }
    toggleArtistCollection1(currentUserId, currentID, isCollecting);
});

function fetchUserDetails(userId) {
    axios.get('/Music1_0_war/user/edit1', {
        params: {
            userId: userId
        }
    }).then(response => {
        console.log(response.data)
        document.getElementById('playlist-title1').textContent = response.data.nickname;
        document.getElementById('email1').textContent = response.data.email;
        document.getElementById('account').textContent = response.data.username;
        console.log("哈哈哈哈哈：" + response.data.avatar)
        document.getElementById('playlist-image1').src = "/upload/" + response.data.avatar;
    });
}

function fetchFollowCounts(userId) {
    axios.get('/Music1_0_war/user/getFollowerCount', {
        params: {
            userId: userId
        }
    }).then(response => {
        console.log(response.data)
        console.log("关注信息："+JSON.stringify(response.data, null, 2));
        document.getElementsByClassName('followerCount')[0].textContent = response.data.followerCount;
        document.getElementsByClassName('followingCount')[0].textContent = response.data.followingCount;
    });
}

function handlePlayListActions(userId, songListTab, playlistsContainer, songListTab1, playlistsContainer1) {
// 首先移除旧的事件监听器
    if (songListTab._clickEvent) {
        songListTab.removeEventListener('click', songListTab._clickEvent);
    }

    if (songListTab1._clickEvent) {
        songListTab1.removeEventListener('click', songListTab1._clickEvent);
    }

// 然后添加新的事件监听器
    songListTab._clickEvent = function(e) {
        handleSongListClick(e, 'song-list-tab1', userId, '/Music1_0_war/playlist/playlistsCreatedByUser', playlistsContainer, songListTab1, playlistsContainer1);
    };
    songListTab.addEventListener('click', songListTab._clickEvent);

    songListTab1._clickEvent = function(e) {
        handleSongListClick(e, 'comments-tab1', userId, '/Music1_0_war/playlist/collectPlaylistsCreatedByUser', playlistsContainer1, songListTab, playlistsContainer);
    };
    songListTab1.addEventListener('click', songListTab1._clickEvent);

}

function clearOtherTab(activeTabId, otherTab, containerToClear) {
    if (activeTabId === otherTab.id) {
        otherTab.classList.remove('active-tab');
    }
    containerToClear.innerHTML = '';
    containerToClear.style.display = "none";
}

function handleSongListClick(e, tabId, userId, url, container, otherTab, otherContainer) {
    e.preventDefault();

    document.getElementById('song-list-tab1').classList.remove('active-tab');
    document.getElementById('comments-tab1').classList.remove('active-tab');

    document.getElementById(tabId).classList.add('active-tab');
    clearOtherTab(tabId, otherTab, otherContainer);
    container.style.display = "flex";

    axios.get(url, {
        params: {
            userId: userId
        }
    }).then(response => {
        console.log(response.data);
        container.innerHTML = '';
        populatePlaylists(response.data, container);
    });
}


function populatePlaylists(data, container) {
    for (let i = 0; i < data.length; i++) {
        let playlist = data[i];

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

        let div = document.createElement('div');
        div.className = 'playlist2';
        div.appendChild(img);
        div.appendChild(playIcon);
        div.appendChild(playlistName);
        div.appendChild(span);

        var contextMenu = document.createElement('ul');
        contextMenu.className = 'context-menu';
        contextMenu.style.display = 'none';

        createContextMenu(playlist, div, contextMenu);

        container.appendChild(div);
    }
}

function displayPlaylist(playlistData) {
    var playlistsContainer = document.getElementById('playlists-container');

    let playlist = playlistData;

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

    let div = document.createElement('div');
    div.className = 'playlist2';
    div.appendChild(img);
    div.appendChild(playIcon);
    div.appendChild(playlistName);
    div.appendChild(span);

    var contextMenu = document.createElement('ul');
    contextMenu.className = 'context-menu';
    contextMenu.style.display = 'none';

    createContextMenu(playlist, div, contextMenu);

    playlistsContainer.appendChild(div);
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
    avatarImage.src = "/upload/默认头像.png";

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
        var formData = new FormData();
        formData.append("name", playlistTitle.value);
        formData.append("creator", currentUserId);
        formData.append("avatar", avatarInput.files[0]);

        axios({
            method: "post",
            url: "/Music1_0_war/playlist/createdPlaylistLnfo",
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = "block";

            setTimeout(function() {
                successMessage.style.display = "none";
            }, 2000);

            displayPlaylist(response.data);
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

function fetchPlaylistAndSongs1(playlistId) {


    console.log("playlistId" + playlistId)
    currentPlaylistId = playlistId;
    axios.get('/Music1_0_war/playlist/playlistInfoByplistId', {
        params: {
            playlistId: playlistId
        },
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(function (response) {
        // 歌单信息
        const playlistInfo = response.data;
        console.log("playlistInfo:" + playlistInfo)
        console.log("playlistInfo.image:" + playlistInfo.playlist.avatar)
        console.log("playlistInfo.name:" + playlistInfo.playlist.name)
        document.getElementById('playlistName').value = playlistInfo.playlist.name;
        document.getElementById('tags3').innerText = playlistInfo.playlist.tags;
        document.getElementById('avatarImage3').src = "/upload/" + playlistInfo.playlist.avatar;
        //console.log("")
        editplaylistId = playlistInfo.playlist.id;
        document.getElementById('playlist-image').src = "/upload/" + playlistInfo.playlist.avatar;
        document.getElementById('playlist-creator').innerText = playlistInfo.creator.nickname;
        document.getElementById('creator-image').src = "/upload/" + playlistInfo.creator.avatar;
        document.getElementById('playlist-title').innerText = playlistInfo.playlist.name;
        document.getElementById('tags').innerText = playlistInfo.playlist.tags;
        document.getElementById('playlist-date').innerText = playlistInfo.playlist.created_time;
        document.getElementById('play-count').innerText = playlistInfo.playlist.play_count+1;

        const collect = document.getElementById('collect');
        const creatorImage = document.getElementById('creator-image');
        const playlistCreatorLink = document.getElementById('playlist-creator');

        if(currentUserId==playlistInfo.creator.id){
            collect.style.display = 'none';
        }

        // 获取"编辑"和"删除"按钮
        const editButton = document.getElementById('edit-button');
        const deleteButton = document.getElementById('delete-button');

        axios({
            method: "post",
            url: "/Music1_0_war/playlist/judgmentCollectPlaylistPost",
            data: {
                userId: currentUserId,
                playlistId: playlistInfo.playlist.id
            },
            headers: {"Content-Type": "application/json"},
        }).then(function (response) {
            if (response.data === true) {
                collect.textContent = "已收藏";
                collect.href = "javascript:void(0);";
                collect.onclick = null;
            }
        }).catch(function (error) {
            console.error('Error:', error);
        });

        collect.addEventListener('click', function() {
            if (collect.textContent === "已收藏") {
                var confirmAction = confirm("确定要取消收藏吗？");
                if (confirmAction == true) {
                    axios({
                        method: "post",
                        url: "/Music1_0_war/playlist/cancelCollectPlaylist",
                        data: {
                            userId: currentUserId,
                            playlistId: playlistInfo.playlist.id
                        },
                        headers: {"Content-Type": "application/json"},
                    }).then(function (response) {
                        if (response.data === true) {
                            collect.textContent = "收藏";
                            const successMessage = document.getElementById('successMessage');
                            successMessage.style.display = "block";
                            setTimeout(function() {
                                successMessage.style.display = "none";
                            }, 1000);
                        } else {
                            const failMessage = document.getElementById(' failMessage');
                            failMessage.style.display = "block";
                            setTimeout(function() {
                                failMessage.style.display = "none";
                            }, 1000);
                        }
                    }).catch(function (error) {
                        console.error('Error:', error);
                    });
                }
            }else{
                axios({
                    method: "post",
                    url: "/Music1_0_war/playlist/collectPlaylist",
                    data: {
                        userId: currentUserId,
                        playlistId: playlistInfo.playlist.id
                    },
                    headers: {"Content-Type": "application/json"},
                }).then(function (response) {
                    if (response.data === true) {
                        collect.textContent = "已收藏";
                        collect.onclick = null;  // 移除点击事件
                        const collectMessage = document.getElementById('collectMessage');
                        collectMessage.style.display = "block";
                        setTimeout(function() {
                            console.log("执行来吗")
                            collectMessage.style.display = "none";
                        }, 1000);
                    }else{
                        const failMessage = document.getElementById('failcollectMessage');
                        failMessage.style.display = "block";
                        setTimeout(function() {
                            failMessage.style.display = "none";
                        }, 1000);
                    }
                }).catch(function (error) {
                    console.error('Error:', error);
                });
            }
        });


        userId = parseInt(playlistInfo.creator.id);
        if (userId === currentUserId) {
            // 如果用户ID和当前用户ID相等，则显示"编辑"和"删除"按钮
            editButton.style.display = 'inline-block';
            deleteButton.style.display = 'inline-block';
            collect.style.display = 'none';
        } else {
            // 否则，隐藏它们
            editButton.style.display = 'none';
            deleteButton.style.display = 'none';
            collect.style.display = 'inline-block';
        }
        // 移除之前的点击事件监听器
        if(creatorImage._clickEvent) {
            creatorImage.removeEventListener('click', creatorImage._clickEvent);
        }

        if(playlistCreatorLink._clickEvent) {
            playlistCreatorLink.removeEventListener('click', playlistCreatorLink._clickEvent);
        }

        // 添加新的点击事件监听器
        creatorImage._clickEvent = function (e) {
            e.preventDefault();
            console.log('1点击主页的ID：', playlistInfo.creator.id)
            toggleDisplay(playlistInfo.creator);
        };

        playlistCreatorLink._clickEvent = function (e) {
            e.preventDefault();
            console.log('2点击主页的ID：', playlistInfo.creator.id)
            toggleDisplay(playlistInfo.creator);
        };

        creatorImage.addEventListener('click', creatorImage._clickEvent);
        playlistCreatorLink.addEventListener('click', playlistCreatorLink._clickEvent);

        document.getElementById('delete-button').addEventListener('click', function(e) {
            e.preventDefault();  // 阻止<a>元素的默认行为，也就是阻止跳转
            axios.delete('/Music1_0_war/playlist/deletePlaylist', {
                params: {
                    playlistId: playlistId
                }
            }).then(response => {
                console.log(response.data);
                if (response.data === "删除成功") {
                    const successMessage = document.getElementById('successMessage');
                    successMessage.style.display = "block";

                    setTimeout(function() {
                        successMessage.style.display = "none";
                    }, 2000);
                    //打开某个人主页信息，把id传过去
                    console.log('3点击主页的ID：',playlistInfo.creator.id)
                    toggleDisplay(playlistInfo.creator);
                } else {
                    alert('删除失败');
                }
            }).catch(error => {
                console.log("Error occurred while deleting playlist: " + error.message);
            });
        });


// 获取歌曲列表
        axios.post('/Music1_0_war/playlist/playlist_songs', {playlistId: playlistInfo.playlist.id}, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(function (response) {
            // 歌曲信息
            songList = response.data;  // 保存歌曲列表
            console.log("songList:" + songList)
            console.log("后端传来我喜欢的音乐：" + JSON.stringify(songList, null, 2));
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

    // Delay function for 2 seconds
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    console.log("playlistId66666："+playlistId)
    setTimeout(() => {
        axios({
            method: "post",
            url: "/Music1_0_war/playlist/updatePlaylistTimes",
            data: {
                playlistId: playlistId
            },
            headers: { "Content-Type": "application/json" },
        }).then(function (response) {
            console.log("更新播放次数：" + response.data);
            // 检查更新是否成功
            if (response.data) {
                console.log('播放次数更新成功');
            } else {
                console.log('播放次数更新失败');
            }
        });
    }, 2000);

}




function formatTime(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 因为getMonth() 返回的是0-11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function organizeCommentsIntoNestedStructure(commentsArray) {
    const commentsById = {};
    const topLevelComments = [];

    // 将每个评论按照其ID映射
    commentsArray.forEach(comment => {
        comment.replies = [];
        commentsById[comment.id] = comment;
    });

    commentsArray.forEach(comment => {
        if (comment.parent_id) {
            const parentComment = commentsById[comment.parent_id];
            if (parentComment) {
                parentComment.replies.push(comment);
            }
        } else {
            topLevelComments.push(comment);
        }
    });

    return topLevelComments;
}

// 这是一个模拟的generateEmojis()函数，您需要根据实际情况进行修改
function generateEmojis() {
    return [
        { src: '/upload/1.png', alt: 'emoji1' },
        { src: '/upload/2.png', alt: 'emoji1' },
        { src: '/upload/3.png', alt: 'emoji1' },
        { src: '/upload/31.png', alt: 'emoji1' },
        { src: '/upload/4.png', alt: 'emoji1' },
        { src: '/upload/5.png', alt: 'emoji1' },
        { src: '/upload/6.png', alt: 'emoji1' },
        { src: '/upload/7.png', alt: 'emoji1' },
        { src: '/upload/8.png', alt: 'emoji1' },
        { src: '/upload/9.png', alt: 'emoji1' },
        { src: '/upload/10.png', alt: 'emoji1' },
        { src: '/upload/11.png', alt: 'emoji1' },
        { src: '/upload/12.png', alt: 'emoji1' },
        { src: '/upload/13.png', alt: 'emoji1' },
        { src: '/upload/14.png', alt: 'emoji1' },
        { src: '/upload/17.png', alt: 'emoji1' },
        { src: '/upload/15.png', alt: 'emoji1' },
        { src: '/upload/18.png', alt:'emoji1' },
        { src: '/upload/19.png', alt: 'emoji1' },
        { src: '/upload/20.png', alt: 'emoji1' },
        { src: '/upload/21.png', alt: 'emoji1' },
        { src: '/upload/22.png', alt: 'emoji1' },
        { src: '/upload/23.png', alt: 'emoji1' },
        { src: '/upload/24.png', alt: 'emoji1' },
        { src: '/upload/25.png', alt: 'emoji1' },
        { src: '/upload/26.png', alt: 'emoji1' },
        { src: '/upload/27.png', alt: 'emoji1' },
        { src: '/upload/28.png', alt: 'emoji1' },
        { src: '/upload/29.png', alt: 'emoji1' },
        { src: '/upload/30.png', alt: 'emoji1' },
        { src: '/upload/156.gif', alt: 'emoji1' },
        { src: '/upload/178.gif', alt: 'emoji1' },
        { src: '/upload/16.png', alt: 'emoji1' },
        { src: '/upload/16.png', alt: 'emoji1' },
    ];
}
let replyTarget = null;  // 新增的变量，用于保存当前的回复对象
// 创建嵌套的评论结构
let comments = [];  // 存储所有的顶级评论

const MAX_COMMENTS = 2;
const createNestedComment = (comment, level = 0, showAll = false, displayCount = MAX_COMMENTS) => {
    comment.replies = comment.replies || [];

    const li = document.createElement('li');
    li.setAttribute("data-comment-id", comment.id);
    li.style.borderBottom = '1px solid #ccc';
    li.style.paddingBottom = '10px';
    li.style.marginBottom = '10px';

    const commentContainer = document.createElement('div');
    commentContainer.className = 'comment-container';
    commentContainer.style.paddingLeft = (level * 20) + 'px';

    const user = comment.user;

    // 头像
    const avatar = document.createElement('img');
    avatar.src = user ? '/upload/' + user.avatar : comment.avatar;
    avatar.alt = user ? user.nickname + "'s avatar" : comment.nickname + "'s avatar";
    avatar.className = 'avatar-large';
    avatar.style.cursor = 'pointer';
    commentContainer.appendChild(avatar);

    const commentContentContainer = document.createElement('div');
    commentContentContainer.className = 'comment-content-container';

    // 昵称
    const nickname = document.createElement('span');
    nickname.className = 'nickname-large';
    nickname.style.color = 'purple';
    nickname.style.cursor = 'pointer';
    if (comment.parent && comment.parent.nickname) {
        nickname.innerText = (user ? user.nickname : comment.nickname) + ' -> ' + comment.parent.nickname;
    } else {
        nickname.innerText = user ? user.nickname : comment.nickname;
    }
    commentContentContainer.appendChild(nickname);


    function handleToggleDisplay() {

        toggleDisplay(user);

    }

    // 清除先前的监听事件
    avatar.removeEventListener('click', handleToggleDisplay);
    nickname.removeEventListener('click', handleToggleDisplay);

    // 添加新的监听事件
    avatar.addEventListener('click', handleToggleDisplay);
    nickname.addEventListener('click', handleToggleDisplay);

    // 内容
    const content = document.createElement('p');
    content.innerHTML = comment.content;
    content.className = 'content-style';
    content.style.backgroundColor = 'white';
    commentContentContainer.appendChild(content);


    // 时间
    const date = document.createElement('span');
    date.className = 'date-large';
    date.innerText = formatTime(comment.comment_time);
    commentContentContainer.appendChild(date);

    commentContainer.appendChild(commentContentContainer);

    // 回复按钮
    const replyButton = document.createElement('button');
    replyButton.innerText = '回复';
    replyButton.className = 'reply-button';
    replyButton.addEventListener('click', function(e) {
        replyTarget = comment;  // 将点击的评论设为当前的回复对象
        const replyPopup = document.getElementById('reply-popup');
        const replyInput = document.getElementById('reply-input');

        /*        // 更新弹出输入框的内容
                replyInput.value = '@' + (user ? user.nickname : comment.nickname) + ' ';*/

        // 设定弹出框位置
        const rect = replyButton.getBoundingClientRect();
        replyPopup.style.left = rect.left + 'px';
        replyPopup.style.top = (rect.bottom + 10) + 'px'; // 10px offset

        // 显示弹出框
        replyPopup.style.display = 'block';

        // 将焦点放在输入框上
        replyInput.focus();
    });


    commentContainer.appendChild(replyButton);

    li.appendChild(commentContainer);

    console.log(comment.replies.length)
    // 回复列表
    if (comment.replies.length > 0) {
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.marginLeft = '20px';

        const visibleReplies = showAll ? comment.replies : comment.replies.slice(0, displayCount);
        for (let reply of visibleReplies) {
            ul.appendChild(createNestedComment(reply, level + 1, showAll));
        }

// 处理显示更多或收回按钮
        if (comment.replies.length > displayCount && !showAll) {
            const showMoreButton = document.createElement('button');
            showMoreButton.innerText = '显示更多';
            showMoreButton.addEventListener('click', function() {
                // 当点击显示更多时，展开更多的评论，增加displayCount
                const expandedComment = createNestedComment(comment, level, false, displayCount + MAX_COMMENTS);
                li.parentNode.replaceChild(expandedComment, li);
            });
            ul.appendChild(showMoreButton);
        } else if (showAll || comment.replies.length > MAX_COMMENTS) { // 这里修改了条件，当展示的评论超过MAX_COMMENTS时也显示收回按钮
            const showLessButton = document.createElement('button');
            showLessButton.innerText = '收回';
            showLessButton.addEventListener('click', function() {
                // 当点击收回时，只展示MAX_COMMENTS数量的评论
                const collapsedComment = createNestedComment(comment, level, false, MAX_COMMENTS);
                li.parentNode.replaceChild(collapsedComment, li);
            });
            ul.appendChild(showLessButton);
        }

        li.appendChild(ul);

    }


    return li;
}


// 拖动弹出的回复框功能
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

document.getElementById('reply-popup').addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - parseInt(this.style.left || 0);
    offsetY = e.clientY - parseInt(this.style.top || 0);
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    const replyPopup = document.getElementById('reply-popup');
    replyPopup.style.left = (e.clientX - offsetX) + 'px'; // 400px left offset is added here
    replyPopup.style.top = (e.clientY - offsetY) + 'px';
});


document.addEventListener('mouseup', function() {
    isDragging = false;
});

document.getElementById('cancel').addEventListener('click', function() {
    document.getElementById('reply-popup').style.display = 'none';
});

window.addEventListener('DOMContentLoaded', (event) => {


    // 绑定评论标签的点击事件
    const songListTab = document.getElementById('song-list-tab');
    const commentsTab = document.getElementById('comments-tab');
    const collectorsTab = document.getElementById('collectors-tab');
    const songList = document.getElementById('song-list1');
    const paginator = document.getElementById('paginator');
    const commentSection = document.getElementById('comment-section');

    function resetTabs() {
        songListTab.classList.remove('active-tab');
        commentsTab.classList.remove('active-tab');
        collectorsTab.classList.remove('active-tab');
    }


    collectorsTab.addEventListener('click', function(e) {
        e.preventDefault();
        resetTabs();
        e.target.classList.add('active-tab');
        songList.style.display = 'none';
        paginator.style.display = 'none';
        commentSection.style.display = 'none';

    });

    commentsTab.addEventListener('click', function(e) {
        e.preventDefault();
        resetTabs();
        e.target.classList.add('active-tab');
        commentSection.style.display = 'block';
        songList.style.display = 'none';
        paginator.style.display = 'none';

        // 获取评论记录
        axios({
            method: "get",
            url: "/Music1_0_war/user/getPlaylistComments",
            params: {
                playlist_id: currentPlaylistId
            },
            headers: { "Content-Type": "application/json" }
        }).then(function(response) {
            const flatComments = response.data;  // 从服务器获取的扁平评论数组
            console.log("Flat comments from server:", JSON.stringify(flatComments, null, 2));

            // 使用 organizeCommentsIntoNestedStructure 函数处理评论
            const nestedComments = organizeCommentsIntoNestedStructure(flatComments);
            // 将从服务器获得的嵌套评论更新到你的本地 comments 数组
            comments = nestedComments;
            console.log("Processed nested comments:", JSON.stringify(nestedComments, null, 2));

            const commentDisplay = document.getElementById('comment-display');

            // 清空现有的评论
            while (commentDisplay.firstChild) {
                commentDisplay.removeChild(commentDisplay.firstChild);
            }
            // 使用处理后的嵌套评论数组来渲染评论
            nestedComments.forEach(comment => {
                const commentElement = createNestedComment(comment);
                commentDisplay.appendChild(commentElement);
            });
        }).catch(function(error) {
            console.error('Error fetching comments:', error);
        });

    });

    const commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const commentInput = document.getElementById('comment-input');
        submitComment(commentInput.innerHTML);  // 使用新的submitComment函数
        commentInput.innerHTML = '';
    });

    const replySendButton = document.getElementById('reply-send');
    replySendButton.addEventListener('click', function() {
        const replyInput = document.getElementById('reply-input');
        submitComment(replyInput.innerHTML);  // 使用新的submitComment函数
        replyInput.innerHTML = '';
        // 关闭小输入框
        const replyPopup = document.getElementById('reply-popup');
        replyPopup.style.display = 'none';
    });
    const commentInput = document.getElementById('comment-input');
    function submitComment(replyText) {
        if (replyText.trim() !== '') {
            const content = replyText;
            const newReply = {
                avatar: '/upload/' + userss.avatar,
                nickname: userss.nickname,
                comment_time: new Date().toLocaleString(),
                content: content,
                user_id: userss.id,  // 从当前登录的用户对象中获取
                playlist_id: currentPlaylistId,  // 假设你在前端已经有了当前歌单的 ID
                parent_id: replyTarget ? replyTarget.id : null,  // 如果有回复对象，则发送其 ID 作为 parent_id
                /*                parent: replyTarget.parent ? replyTarget.parent : null,*/
                replies: []  // 初始化为空数组
            };
            console.log(newReply)
            // 向服务器发送评论数据以保存

            // 向服务器发送评论数据以保存
            axios({
                method: "post",
                url: "/Music1_0_war/user/saveComment",
                data: newReply,
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            }).then(function(response) {
                console.log('Comment saved:', response.data);
                const savedComment = response.data;  // 假设后端返回整个评论对象，其中包括 ID
                newReply.id = savedComment.id;  // 将新生成的 ID 保存到前端的评论对象中

                console.log('Comment saved:', savedComment);
                console.log(replyTarget ? replyTarget.id : 'No reply target');
                // 如果 replyTarget 不是 null，将新回复添加到回复对象的回复列表中
                if (replyTarget) {
                    if (!Array.isArray(replyTarget.replies)) {
                        replyTarget.replies = [];
                    }

                    newReply.level = replyTarget.level + 1;  // 设置新回复的嵌套级别
                    console.log("7雪回复的："+newReply)
                    replyTarget.replies.push(newReply);
                    console.log("After pushing the new reply:", replyTarget.replies);
                    replyTarget = null;
                } else {
                    console.log("雪回复的："+newReply)
                    comments.push(newReply);
                }
                // 渲染评论
                const commentDisplay = document.getElementById('comment-display');
                while (commentDisplay.firstChild) {
                    commentDisplay.removeChild(commentDisplay.firstChild);
                }
                for (let comment of comments) {
                    commentDisplay.appendChild(createNestedComment(comment));
                }

                // 清空输入并重置replyTarget
                commentInput.innerHTML = '';
                replyTarget = null;
            }).catch(function(error) {
                console.error('Error saving comment:', error);
            });
        }
    }



// 记录当前激活的输入框
    let activeInput = null;

// 绑定表情选择器按钮的点击事件
    ['emoji-button', 'emoji-button1'].forEach(buttonId => {
        document.getElementById(buttonId).addEventListener('click', function(e) {
            e.preventDefault();
            const emojiPicker = document.getElementById('emoji-picker');
            if (emojiPicker.style.display === 'none') {
                emojiPicker.style.display = 'block';
                emojiPicker.innerHTML = generateEmojis().map(emoji =>
                    `<img class="emoji" src="${emoji.src}" alt="${emoji.alt}"  />`
                ).join('');

                // 设置当前激活的输入框
                activeInput = buttonId === 'emoji-button' ? 'comment-input' : 'reply-input';
            } else {
                emojiPicker.style.display = 'none';
            }
            // 停止冒泡，防止点击表情选择器按钮时也触发了文档的点击事件
            e.stopPropagation();
        });
    });

// 在文档上绑定点击事件，用于关闭表情选择器
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('emoji') && e.target.id !== 'emoji-button' && e.target.id !== 'emoji-button1') {
            document.getElementById('emoji-picker').style.display = 'none';
        }
    });

// 在文档上绑定点击事件，用于插入表情
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('emoji')) {
            e.preventDefault();
            const inputEl = document.getElementById(activeInput);
            const emojiImg = `<img src="${e.target.src}" alt="${e.target.alt}" style="height: 40px; vertical-align: middle;" />`;
            inputEl.innerHTML += emojiImg;
        }
    });

});





// 插入歌曲行，接收一个歌曲对象
function insertSongRow(song) {
    let tbody = document.getElementById('song-data');
    let row = document.createElement('tr');
    row.dataset.songId = song.id;
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
            playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar,song.is_member_song);
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
        // 创建右键菜单
        let contextMenu = document.createElement('ul');
        contextMenu.className = 'context-menu';

        let deleteItem = document.createElement('li');
        deleteItem.textContent = '从歌单中删除';
        deleteItem.addEventListener('click', function() {
            console.log("被删除歌曲歌单的ID："+deleteplaylistId)
            deleteSongFromPlaylist(song.id,deleteplaylistId);
        });

        let addToPlaylistItem = document.createElement('li');
        addToPlaylistItem.textContent = '添加到歌单';
        deleteItem.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.4)';
        addToPlaylistItem.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.4)';
// 鼠标悬停时创建子菜单
        addToPlaylistItem.addEventListener('mouseenter', function() {
            axios.get('/Music1_0_war/playlist/playlistsCreatedByUser', {
                params: {
                    userId: currentUserId
                }
            }).then(response => {
                console.log(response.data);

                // 创建子菜单ul并添加样式
                let subMenu = document.createElement('ul');
                subMenu.style.display = 'block';
                subMenu.style.position = 'absolute';
                subMenu.style.left = '100%';
                subMenu.style.top = '50%';
                subMenu.style.zIndex = '1';
                subMenu.style.border = '1px solid #000';
                subMenu.style.borderRadius = '7px'; // 圆角边框
                subMenu.style.backgroundColor = '#fff'; // 白色背景
                subMenu.style.padding = '5px'; // 内边距
                subMenu.style.width = 'max-content'; // 自适应宽度
                subMenu.style.whiteSpace = 'nowrap'; // 防止文字折行
                subMenu.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.2)';

                response.data.forEach(function(playlist) {
                    let playlistItem = document.createElement('li');
                    console.log("子菜单："+playlist.name)
                    playlistItem.textContent = playlist.name;
                    // 纵向排列
                    playlistItem.style.display = 'block';
                    playlistItem.style.marginRight = '5px'; // 添加右边距
                    playlistItem.style.color = 'black';

                    // 如果已经有旧的监听器，则先移除
                    if (playlistItem._clickEvent) {
                        playlistItem.removeEventListener('click', playlistItem._clickEvent);
                    }

                    // 添加新的监听器，并保存在元素的属性中
                    playlistItem._clickEvent = function() {
                        addToPlaylist(song.id, playlist.id);
                    };
                    playlistItem.addEventListener('click', playlistItem._clickEvent);

                    // 对于 addToPlaylistItem 的监听器，也用同样的方法处理
                    if (addToPlaylistItem._mouseOverEvent) {
                        addToPlaylistItem.removeEventListener('mouseover', addToPlaylistItem._mouseOverEvent);
                    }
                    if (addToPlaylistItem._mouseOutEvent) {
                        addToPlaylistItem.removeEventListener('mouseout', addToPlaylistItem._mouseOutEvent);
                    }

                    addToPlaylistItem._mouseOverEvent = function() {
                        subMenu.style.display = 'block';
                    };
                    addToPlaylistItem.addEventListener('mouseover', addToPlaylistItem._mouseOverEvent);

                    addToPlaylistItem._mouseOutEvent = function() {
                        subMenu.style.display = 'none';
                    };
                    addToPlaylistItem.addEventListener('mouseout', addToPlaylistItem._mouseOutEvent);

                    subMenu.appendChild(playlistItem);
                });

                let oldSubMenu = addToPlaylistItem.querySelector('ul');
                if (oldSubMenu) {
                    addToPlaylistItem.removeChild(oldSubMenu);
                }

                addToPlaylistItem.appendChild(subMenu);
            })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        });
        contextMenu.appendChild(deleteItem);
        contextMenu.appendChild(addToPlaylistItem);
        document.body.appendChild(contextMenu);

        row.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';
            contextMenu.style.display = 'block';
        });

        window.addEventListener('click', function(e) {
            if (!contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
        });
        contextMenu.addEventListener('mouseleave', function() {
            contextMenu.style.display = 'none';
        });
    });
    tbody.appendChild(row);
}



/****编辑歌单信息****/
document.addEventListener('DOMContentLoaded', function() {
    // 添加处理“编辑”按钮点击事件的代码
    document.getElementById('edit-button').addEventListener('click', function(e) {
        e.preventDefault();
        // 显示编辑弹窗
        document.getElementById('modal2').style.display = 'block';
    });

    document.getElementById('addTag').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('tagPopup').style.display = 'block';
    });

    document.getElementById('cancelBtn').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('playlistName').value = '';
        document.getElementById('tags3').innerHTML = '';
        document.getElementById('avatarImage3').src = '';
        document.getElementById('saveBtn').disabled = true;
        document.getElementById('modal2').style.display = 'none';
    });

    document.querySelectorAll('.tag-option').forEach(function (tag) {
        tag.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('tags3').innerHTML = this.innerHTML;
            document.getElementById('tagPopup').style.display = 'none';
            checkValidity();
        });
    });

    document.getElementById('playlistName').addEventListener('input', checkValidity);
    document.getElementById('avatar3').addEventListener('change', checkValidity);

    document.getElementById('avatarImage3').onclick = function () {
        document.getElementById('avatar3').click();
    };

    document.getElementById('avatar3').onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                document.getElementById('avatarImage3').src = reader.result;
            };
        }
        checkValidity();
    };

    function checkValidity() {
        let playlistName = document.getElementById('playlistName').value;
        let imageUpload = document.getElementById('avatar3').value;
        let tag = document.getElementById('tags3').innerHTML;
        if (playlistName && imageUpload && tag) {
            document.getElementById('saveBtn').disabled = false;
        } else {
            document.getElementById('saveBtn').disabled = true;
        }
    }

    document.getElementById('saveBtn').addEventListener('click', function(e) {
        e.preventDefault();

        var playlistName = document.getElementById('playlistName').value;
        var tags3 = document.getElementById('tags3').innerHTML;
        var avatar3 = document.getElementById('avatar3').files[0];

        var formData = new FormData();
        formData.append("name", playlistName);
        formData.append("tags", tags3);
        formData.append("avatar", avatar3);
        console.log("有id吗:"+editplaylistId)
        formData.append("playlistId", editplaylistId);
        axios({
            method: "post",
            url: "/Music1_0_war/playlist/editPlaylistLnfo",
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            // 处理响应
            console.log("更新歌单信息："+JSON.stringify(response.data, null, 2));
            console.log(response.data.id)
            console.log(response.data.avatar)
            console.log(response.data.name)
            // 关闭弹窗，清理数据等操作
            document.getElementById('playlist-image').src = "/upload/"+response.data.avatar;
            document.getElementById('playlist-title').innerText = response.data.name;
            document.getElementById('tags').innerText =  response.data.tags;
            document.getElementById('saveBtn').disabled = true;
            document.getElementById('modal2').style.display = 'none';
        })
            .catch(function (error) {
                // 处理错误
                console.log(error);
            });
    });
});


function deleteSongFromPlaylist(songId, playlistId) {
    let formData = new FormData();
    formData.append('songId', songId);
    formData.append('playlistId', playlistId);

    axios({
        method: 'post',
        url: `/Music1_0_war/playlist/deleteSongFromPlaylist`,
        data: formData,
        headers: {"Content-Type": "multipart/form-data"},
    }).then(function (response) {
        console.log("删除歌曲："+JSON.stringify(response.data, null, 2));
        // 在歌单列表中删除该歌曲

        // 重新获取播放列表和歌曲
        fetchPlaylistAndSongs1(playlistId);
        let tbody = document.getElementById('song-data');
        let rows = Array.from(tbody.getElementsByTagName('tr'));

        let songRow = rows.find(row => row.dataset.songId === String(songId));
        console.log("songRow:"+songRow)
        if (songRow) {
            tbody.removeChild(songRow);
        }
    })
        .catch(function (error) {
            console.log(error);
        });
}
// 将歌曲添加到歌单的方法
function addToPlaylist(songId, playlistId) {
    const formData = new URLSearchParams();
    formData.append('songId', songId);
    formData.append('playlistId', playlistId);

    axios.post('/Music1_0_war/playlist/addToPlaylist', formData, {
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    }).then(response => {
        console.log(response.data);
        if (response.data.status === "success") {
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = "block";
            setTimeout(function () {
                successMessage.style.display = "none";
            }, 1000);
            // toggleDisplay(currentUserId);
        } else {
            const failMessage = document.getElementById('failMessage');
            failMessage.style.display = "block";
            setTimeout(function () {
                failMessage.style.display = "none";
            }, 1000);
        }
    }).catch((error) => {
        console.error(error);
    });
}

document.querySelector('.clear-link').addEventListener('click', function(event) {
    // 阻止链接的默认行为
    event.preventDefault();

    // 清空播放记录数组
    playLogs = [];

    // 清空表单
    let songTable = document.getElementById('song-data4');
    while (songTable.firstChild) {
        songTable.firstChild.remove();
    }
});

/*****最近播放列表****/
// 时钟更新函数
// 用于更新页面显示的函数
function updateDisplay() {
    var tbody = document.getElementById('song-data4');

    // 清空当前的 tbody
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }


    // 按播放时间从新到旧排序
    playLogs.sort(function(a, b) {
        return new Date(b.play_time) - new Date(a.play_time);
    });

/*    console.log('最近播放',playLogs)*/

    // 更新歌曲数量
    var songCountElement = document.querySelector('.song-count');
    songCountElement.textContent = playLogs.length + '首';

    playLogs.forEach(function(playLog) {
        // 创建新的行元素
        var row = document.createElement('tr');

// 创建并设置新的单元格元素
        var cellSongName = document.createElement('td');
        var cellArtistName = document.createElement('td');
        var cellPlayTime = document.createElement('td');

// 创建一个 div 容器元素
        var divContainer = document.createElement('div');
        divContainer.style.display = 'flex';
        divContainer.style.alignItems = 'center'; // 将元素垂直居中

        // 创建一个 img 元素来显示歌曲的头像
        var img = document.createElement('img');
        img.src = "/upload/" + playLog.songs.avatar;
        img.alt = playLog.songs.name;
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.borderRadius = "50%";

        // 创建一个 span 元素用于显示歌曲名
        var spanSongName = document.createElement('span');
        spanSongName.textContent = ' ' + playLog.songs.name;

        // 将 img 和 span 元素添加到 div 容器中
        divContainer.appendChild(img);
        divContainer.appendChild(spanSongName);

        // 将 div 容器添加到 cellSongName 中
        cellSongName.appendChild(divContainer);

        cellArtistName.textContent = playLog.songs.artist;
        cellPlayTime.textContent = playLog.play_time_text;


        // 把新创建的单元格添加到行元素中
        row.appendChild(cellSongName);
        row.appendChild(cellArtistName);
        row.appendChild(cellPlayTime);

        // 为行添加点击事件，点击则播放此行代表的歌曲
        row.addEventListener('click', function() {
            playSong(playLog.songs.id, playLog.songs.filepath, playLog.songs.name, playLog.songs.artist, playLog.songs.lyric, playLog.songs.avatar,playLog.songs.is_member_song);
        });
        // 把新创建的行添加到 tbody 中
        tbody.appendChild(row);
    });


}
function updatePlayTime() {
    for (var i = 0; i < playLogs.length; i++) {
        var playTime = new Date(playLogs[i].play_time);
        var currentTime = new Date();
        var diffInSeconds = Math.round((currentTime - playTime) / 1000);

        if (diffInSeconds < 60) {
            playLogs[i].play_time_text =  '刚刚';
        } else if (diffInSeconds < 3600) {
            playLogs[i].play_time_text = Math.round(diffInSeconds / 60) + '分钟前';
        } else if (diffInSeconds < 86400) {
            playLogs[i].play_time_text = Math.round(diffInSeconds / 3600) + '小时前';
        } else {
            playLogs[i].play_time_text = Math.round(diffInSeconds / 86400) + '天前';
        }
    }

    // 更新页面显示
    updateDisplay();
}

// 事件监听器
document.getElementById('music4').addEventListener('click', function(event) {
    event.preventDefault();

    var div1 = document.getElementById('1');
    var div2 = document.getElementById('2');
    var div3 = document.getElementById('3');
    var div4 = document.getElementById('4');
    var div5 = document.getElementById('5');
    var div6 = document.getElementById('6');
    var div8 = document.getElementById('8');
    var div10 = document.getElementById('10');

    // 隐藏所有的子div
    const children = document.querySelectorAll('.main-right > div');
    children.forEach(child => {
        child.style.display = 'none';
    });

        div4.style.display = 'block';
        div1.style.display = 'none';
        div2.style.display = 'none';
        div3.style.display = 'none';
        div5.style.display = 'none';
        div6.style.display = 'none';
        div8.style.display = 'none';
        div10.style.display = 'none';
        div11.style.display = 'none';
        div12.style.display = 'none';
    document.getElementById('music4').classList.toggle('active');
    document.getElementById('music1').classList.remove('active');
    document.getElementById('music2').classList.remove('active');
    document.getElementById('music6').classList.remove('active');
    document.getElementById('music3').classList.remove('active');
    document.getElementById('music7').classList.remove('active');
    document.getElementById('music9').classList.remove('active');
    document.getElementById('music10').classList.remove('active');
    // 更新播放时间和页面显示
    updatePlayTime();
});

// 立即更新播放时间和页面显示
updatePlayTime();

// 每分钟更新一次播放时间和页面显示
setInterval(updatePlayTime, 1000);


// 获取"退出"元素
let logoutLink = document.getElementById('logout');

// 添加点击事件处理器
logoutLink.addEventListener('click', function(event) {
    // 阻止默认的链接点击行为，因为我们想在用户点击链接后先执行一些代码，然后再跳转
    event.preventDefault();

    // 调用你的退出登录函数
    logout();

    // 手动导航到登录页面
    window.location.href = 'login.html';
});

// 退出登录时，保存播放列表到 localStorage
function logout() {
    // 保存播放列表到localStorage
    localStorage.setItem('listsongs-' + currentUserId, JSON.stringify(listsongs));

    // 保存播放记录
    savePlayLogs();
}

// 每隔五分钟自动保存播放记录
setInterval(savePlayLogs, 5 * 60 * 1000);


function savePlayLogs() {
    const userIdInt = parseInt(currentUserId);
    console.log('userIdInt',userIdInt)
    const playLogsData = playLogs.map(log => {
        return {
            user_id: log.user_id,
            song_id: log.songs.id,
            play_time: log.play_time
        };
    });
    console.log("playLogsData:"+JSON.stringify(playLogsData))
    // 使用 Axios 向后端发送保存播放记录的请求
    axios({
        method: "post",
        url: "/Music1_0_war/user/savePlayLogs",
        data: {
            user_id: userIdInt, // 将 user_id 添加到 data 对象中
            playLogs: JSON.stringify(playLogsData)
        },
        headers: {"Content-Type": "application/json"},
    }).then(function (response) {
        console.log('播放记录保存成功');
    }).catch(function (error) {
        console.error('播放记录保存失败:', error);
    });
}

// 获取播放全部按钮
let playAllButton4 = document.getElementById('play-all4');

// 监听播放全部按钮的点击事件
playAllButton4.addEventListener('click', function(e) {
    // 阻止按钮的默认行为（导航到新页面或刷新页面）
    e.preventDefault();

    // 清空原来的播放列表
    listsongs = [];
    // 清空歌曲列表的 DOM
    document.getElementById('songTable').innerHTML = '';
    // 遍历所有歌曲
    for(let i = 0; i < playLogs.length; i++) {
        let song = playLogs[i].songs;
        console.log("获取播放全部按钮："+JSON.stringify( song, null, 2));
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
            playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar,song.is_member_song);
        });

        songTable.appendChild(songRow);
    }

    document.querySelector('.total1 > #totalSongs').textContent = listsongs.length;
    // 播放第一首歌
    let firstSong = listsongs[0];
    console.log("播放第一首歌："+JSON.stringify(firstSong, null, 2));
    playSong(firstSong.id, firstSong.filepath, firstSong.name, firstSong.artist, firstSong.lyric, firstSong.avatar,firstSong.is_member_song);
});



/*****我的收藏***/
let artists5 = [];


// 请求收藏的歌手列表
document.getElementById('music6').addEventListener('click', function(event) {
    event.preventDefault();

console.log("点击了吗")
    var div1 = document.getElementById('1');
    var div2 = document.getElementById('2');
    var div3 = document.getElementById('3');
    var div4 = document.getElementById('4');
    var div5 = document.getElementById('5');
    var div6 = document.getElementById('6');
    var div10 = document.getElementById('10');
    const children = document.querySelectorAll('.main-right > div');
    children.forEach(child => {
        child.style.display = 'none';
    });
        div5.style.display = 'block';
        div1.style.display = 'none';
        div2.style.display = 'none';
        div3.style.display = 'none';
        div4.style.display = 'none';
        div6.style.display = 'none';
        div10.style.display = 'none';
        div11.style.display = 'none';


    document.getElementById('music6').classList.toggle('active');
    document.getElementById('music1').classList.remove('active');
    document.getElementById('music2').classList.remove('active');
    document.getElementById('music4').classList.remove('active');
    document.getElementById('music3').classList.remove('active');
    document.getElementById('music7').classList.remove('active');

    axios({
        method: "post",
        url: "/Music1_0_war/playlist/getCollectartist",
        data: {
            userId: currentUserId,
        },
        headers: {"Content-Type": "application/json"},
    }).then(function (response) {
        artists5 = response.data;
    }).catch(function (error) {
        console.error('Error:', error);
    });
});

// 显示歌手列表并添加特效
document.getElementById('artists-tab').addEventListener('click', function(event) {
    event.preventDefault();

    // 加载歌手列表
    loadArtists5(artists5);

    // 增加特效
    this.classList.add('active-tab');
});


// 显示歌手列表的函数
function loadArtists5(artists5) {
    const artistList = document.getElementById('artist-list5');
    artistList.innerHTML = ''; // 清空artist-list元素

// 创建一个 ul 元素并设置其样式
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.display = 'grid';
    ul.style.gridTemplateColumns = 'repeat(5, 1fr)';
    ul.style.gridAutoRows = '250px';
    ul.style.gap = '10px';

    artists5.forEach(artist => {
        // 创建一个 li 元素并设置其样式
        const li = document.createElement('li');
        li.style.marginTop = '20px';

        // 创建一个 img 元素并设置其 src 和样式属性
        const img = document.createElement('img');
        img.src = "/upload/" + artist.avatar;
        img.style.width = '300px';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.transition = 'transform 0.3s';
        img.onmouseover = function() {
            this.style.transform = 'scale(1.1)';
        };
        img.onmouseout = function() {
            this.style.transform = 'scale(1)';
        };

        // 创建一个 p 元素并设置其 textContent 和样式属性
        const p = document.createElement('p');
        p.textContent = artist.nickname + " - " + artist.songs.length + ' 首';
        p.style.textAlign = 'center';
        p.style.marginTop = '10px';
        p.style.marginRight = '120px';

        // 为div添加点击事件处理器
        li.addEventListener('click', function(event) {
            var div5 = document.getElementById('5');
            div5.style.display = 'none';
            // 填充歌手信息到 #6 元素
            document.getElementById('playlist-image6').src = "/upload/" + artist.avatar;
            document.getElementById('playlist-title6').textContent = artist.nickname;
            document.getElementById('num').textContent = artist.songs.length;
            artistInfo = artist.bio; //歌手简介
            console.log("看到了发："+artistInfo)
            // 发送请求获取歌手的歌单信息
            axios.get('/Music1_0_war/playlist/getArtistsPlaylists', {
                params: {
                    artistId: artist.id
                }
            }).then(function(response) {
                // 将返回的数据保存到 artistsPlaylists
                artistsPlaylists = response.data;
                console.log("歌手歌单信息："+artistsPlaylists)
                document.getElementById('playList-num').textContent = artistsPlaylists.length;

                document.getElementById('artists-playlist').innerHTML = '';
                document.getElementById('bio').innerHTML = '';
                // 检查用户是否已收藏这个艺术家

                axios({
                    method: "post",
                    url: "/Music1_0_war/playlist/judgmentCollectartistPost",
                    data: {
                        userId: currentUserId,
                        artistId:  artist.id
                    },
                    headers: {"Content-Type": "application/json"},
                }).then(function (response) {
                    if (response.data === true) {
                        document.getElementById('collectButton').textContent = "已收藏";
                    }else{
                        document.getElementById('collectButton').textContent = "收藏";
                    }
                }).catch(function (error) {
                    console.error('Error:', error);
                });
                // 显示元素 #6
                document.getElementById('6').style.display = 'block';
                document.getElementById('1').style.display = 'none';

            }).catch(function(error) {
                console.error('获取歌手歌单信息失败:', error);
            });
        });
        // 将 img 和 p 添加到 li
        li.appendChild(img);
        li.appendChild(p);

        // 将 li 添加到 ul
        ul.appendChild(li);
    });

// 清空 artistList 的内容并将 ul 添加到 artistList
    artistList.appendChild(ul);

}

/*****歌手******/


// 找到所有的链接
let tabLinks = document.querySelectorAll('.main-right-tab a');

// 找到所有的语种和首字母选项
let languageSpans = document.querySelectorAll('#language-filter2 span');
let letterSpans = document.querySelectorAll('#letter-filter2 span');

let selectedLanguage = '全部';
let selectedLetter = '全部';


let rendered = false;//标记是否渲染
let showCount = 10;
let totalRows = [];

const plistList = document.getElementById('plist-list');

const languageSpans3 = document.querySelectorAll('#language-filter3 span');

languageSpans3.forEach(span => {
    // 初始样式
    span.style.border = '1px solid transparent';
    span.style.padding = '4px';
    span.style.cursor = 'pointer';
    span.style.borderRadius = '5px'; // 设置边框圆角
    span.style.color = 'black'; // 默认字体颜色

    span.addEventListener('click', function() {
        // 移除所有其他span的选中样式
        languageSpans3.forEach(s => {
            s.style.border = '1px solid transparent'; // 移除边框
            s.style.color = 'black'; // 恢复默认字体颜色
        });

        // 为当前被点击的span设置选中样式
        this.style.border = '1px solid red';  // 红色边框
        this.style.color = 'red';  // 红色字体

        filterPlaylistsByLanguage(this.textContent);
    });
});



document.querySelector('.classfic').addEventListener('click', function(e) {
    e.preventDefault();
    if (!rendered) {
        renderPlaylists(allplaylist);
        rendered = true;
    } else {
        updateDisplayedPlaylists();
    }
});

function renderPlaylists(playlists) {
    totalRows = [];
    playlists.forEach((item, index) => {
        const row = createPlaylistRow(item, index);
        totalRows.push(row);
    });
    updateDisplayedPlaylists();
}

function updateDisplayedPlaylists() {
    plistList.innerHTML = '';
    for(let i = 0; i < showCount && i < totalRows.length; i++) {
        plistList.appendChild(totalRows[i]);
    }
    const toggleBtn = createToggleBtn();
    plistList.appendChild(toggleBtn);
}

function filterPlaylistsByLanguage(language) {
    if (language === '全部') {
        renderPlaylists(allplaylist);
    } else {
        const filteredPlaylists = allplaylist.filter(item => item.playlist.tags.includes(language));
        renderPlaylists(filteredPlaylists);
    }
}

function createPlaylistRow(item, index) {
    const row = document.createElement('div');

    // 为div元素添加样式
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.padding = '10px';
    row.style.marginBottom = '10px';
    row.style.backgroundColor = index % 2 === 0 ? '#f5f5f5' : '#e0e0e0';
    row.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.5)';
    row.style.transition = 'background-color 0.3s'; // 添加过渡效果
    row.style.marginLeft = '150px'; // 将行元素向左移动150px

    // 添加鼠标悬停效果
    row.onmouseover = function() {
        this.style.backgroundColor = '#d0d0d0';
    };
    row.onmouseout = function() {
        this.style.backgroundColor = index % 2 === 0 ? '#f5f5f5' : '#e0e0e0';
    };

    // 创建头像元素
    const avatar = document.createElement('img');
    avatar.src = '/upload/' + item.playlist.avatar;
    avatar.alt = 'Playlist Avatar';
    avatar.style.width = '100px';
    avatar.style.height = '100px';
    avatar.style.marginRight = '10px';

    // 创建标题元素
    const title = document.createElement('span');
    title.textContent = item.playlist.name;
    title.style.fontWeight = 'bold';
    title.style.fontSize = '16px';
    title.style.marginLeft = '20px'; // 设置距离头像的距离

    // 创建容器来放置头像和标题
    const leftContainer = document.createElement('div');
    leftContainer.style.display = 'flex';
    leftContainer.style.alignItems = 'center';

    // 将头像和标题添加到容器
    leftContainer.appendChild(avatar);
    leftContainer.appendChild(title);

    // 创建播放次数元素
    const playCount = document.createElement('span');
    playCount.textContent = item.playlist.play_count + '次';

    // 添加元素到行中
    row.appendChild(leftContainer);
    row.appendChild(playCount);
    // 为整行添加点击事件
    row.addEventListener('click', function() {
        fetchPlaylistAndSongs1(item.playlist.id);

        // 获取指定 id 的 div，并修改其显示属性
        const targetDiv = document.getElementById('2');
        if (targetDiv) {
            targetDiv.style.display = 'block'; // 显示div
        }
        const ts = document.getElementById('1');
        if (ts) {
            ts.style.display = 'none';
        }
    });
    return row;
}


function createToggleBtn() {
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = showCount === 10 ? "展开" : "收回";
    toggleBtn.addEventListener('click', function() {
        if (showCount === 10) {
            showCount += 4;
        } else {
            showCount = 10;
        }
        updateDisplayedPlaylists();
    });
    return toggleBtn;
}

let selectedLanguage1 = '全部';
let selectedLetter1 = '全部';


// 给每一个链接添加点击事件处理器
tabLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // 阻止链接的默认点击行为

        // 移除所有链接的 'active-link' 类
        tabLinks.forEach(function(innerLink) {
            innerLink.classList.remove('active-link');
        });

        // 给被点击的链接添加 'active-link' 类
        this.classList.add('active-link');

        // 控制页面元素的显示和隐藏
        if (this.textContent === '精选') {
            document.querySelector('.carousel').style.display = 'block';
            document.querySelectorAll('.main-right-hot').forEach(function(div) {
                div.style.display = 'block';
            });
            document.getElementById('language-filter').style.display = 'none';
            document.getElementById('letter-filter').style.display = 'none';
            document.getElementById('language').style.display = 'none';
            document.getElementById('artist-list').style.display = 'none';
            document.getElementById('plist-list').style.display = 'none';
            document.getElementById('6').style.display = 'none';
            document.getElementById('7').style.display = 'none';
        } else if (this.textContent === '歌手') {
            document.getElementById('language').style.display = 'none';
            document.querySelector('.carousel').style.display = 'none';
            document.querySelectorAll('.main-right-hot').forEach(function(div) {
                div.style.display = 'none';
            });
            document.getElementById('language-filter').style.display = 'flex';
            document.getElementById('letter-filter').style.display = 'flex';
            document.getElementById('artist-list').style.display = 'block';
            document.getElementById('plist-list').style.display = 'none';
            document.getElementById('6').style.display = 'none';
            document.getElementById('7').style.display = 'none';
        }else if (this.textContent === '分类歌单') {
            document.querySelector('.carousel').style.display = 'none';
            document.querySelectorAll('.main-right-hot').forEach(function(div) {
                div.style.display = 'none';
            });
            document.getElementById('language-filter').style.display = 'none';
            document.getElementById('letter-filter').style.display = 'none';
            document.getElementById('artist-list').style.display = 'none';
            document.getElementById('6').style.display = 'none';


            document.getElementById('language').style.display ='flex';
            document.getElementById('plist-list').style.display = 'block';
            document.getElementById('7').style.display = 'none';
        }else if (this.textContent === '排行') {
            document.getElementById('language').style.display = 'none';
            document.querySelector('.carousel').style.display = 'none';
            document.getElementById('7').style.display = 'block';
            document.querySelectorAll('.main-right-hot').forEach(function (div) {
                div.style.display = 'none';
            });
            document.getElementById('language-filter').style.display = 'none';
            document.getElementById('letter-filter').style.display = 'none';
            document.getElementById('artist-list').style.display = 'none';
            document.getElementById('plist-list').style.display = 'none';
            document.getElementById('6').style.display = 'none';
        }


    });
});

document.getElementById('singer-link').addEventListener('click', function(event) {
    // Prevent the default behavior of the anchor link
    event.preventDefault();

    let selectedLanguage = null;
    let selectedLetter = null;

// 添加事件监听器以处理语种的选择
    document.getElementById('language-filter2').addEventListener('click', function(event) {
        const target = event.target;

        if (target.tagName.toLowerCase() === 'span') {
            // 清除先前的选中状态
            const prevSelected = document.querySelector('#language-filter2 .selected-filter');
            if (prevSelected) {
                prevSelected.classList.remove('selected-filter');
            }

            // 设置当前选中状态
            target.classList.add('selected-filter');

            // 更新选中的语种
            selectedLanguage = target.textContent.trim() !== '全部' ? target.textContent.trim() : null;

            // 重新加载列表
            loadArtists();
        }
    });

// 添加事件监听器以处理字母的选择
    document.getElementById('letter-filter2').addEventListener('click', function(event) {
        const target = event.target;

        if (target.tagName.toLowerCase() === 'span') {
            // 清除先前的选中状态
            const prevSelected = document.querySelector('#letter-filter2 .selected-filter');
            if (prevSelected) {
                prevSelected.classList.remove('selected-filter');
            }

            // 设置当前选中状态
            target.classList.add('selected-filter');

            // 更新选中的字母
            selectedLetter = target.textContent.trim() !== '全部' ? target.textContent.trim() : null;

            // 重新加载列表
            loadArtists();
        }
    });
    function loadArtists() {
        const artistList = document.getElementById('artist-list');
        artistList.innerHTML = '';
        artistList.style.marginLeft = '100px';
                    let filteredArtists = artists.filter(artist => {
                        let passLanguageFilter = true;
                        let passLetterFilter = true;

                        if (selectedLanguage) {
                            passLanguageFilter = artist.genre === selectedLanguage;
                        }

                        if (selectedLetter) {
                            passLetterFilter = artist.nickname[0].toUpperCase() === selectedLetter;
                        }

                        return passLanguageFilter && passLetterFilter;
                    });

                    // 创建一个 ul 元素并设置其样式
                    let ul = document.createElement('ul');
                    ul.style.listStyle = 'none';
                    ul.style.padding = '0';
                    ul.style.display = 'grid';
                    ul.style.gridTemplateColumns = 'repeat(5, 1fr)';
                    ul.style.gridAutoRows = '250px';
                    ul.style.gap = '10px';

                    let count = 0;

                    filteredArtists.forEach((artist, index) => {
                        const li = document.createElement('li');
                        li.style.marginTop = '20px';
                        li.style.marginLeft = '50px';
                        /*li.style.overflow = 'hidden';*/

                        const img = document.createElement('img');
                        img.src = "/upload/" + artist.avatar;
                        img.style.width = '300px';
                        img.style.height = '200px';

                        // 添加鼠标悬浮效果
                        img.style.transition = 'transform 0.3s';  // 过渡效果让放大看起来平滑

                        // 当鼠标悬浮在图片上时放大
                        img.onmouseover = function() {
                            this.style.transform = 'scale(1.1)';  // 放大到110%
                        };

                        // 当鼠标从图片上移开时恢复原始大小
                        img.onmouseout = function() {
                            this.style.transform = 'scale(1)';  // 恢复到100%
                        };
/*
                        img.style.objectFit = 'cover';
*/
                        const div = document.createElement('div');
                        div.style.display = 'flex';
/*                        div.style.justifyContent = 'space-between';
                        div.style.alignItems = 'center';*/

                        const h4 = document.createElement('h4');
                        h4.textContent = artist.nickname;
                        h4.style.margin = '0';


                        const span = document.createElement('span');
                        span.textContent = artist.songs.length + ' 首';
                        span.style.marginLeft = '30px';

                        div.appendChild(h4);
                        div.appendChild(span);

                        li.appendChild(img);
                        li.appendChild(div);

                        ul.appendChild(li);
                        count++;
                        // 为li添加点击事件处理器
                        li.addEventListener('click', function(event) {
                            document.getElementById('playlist-image6').src = "/upload/" + artist.avatar;
                            document.getElementById('playlist-title6').textContent = artist.nickname;
                            document.getElementById('num').textContent = artist.songs.length;
                             artistInfo = artist.bio;
                            console.log(artistInfo);
                             oneartist = artist;
                            console.log("判断是否为收藏的歌手："+oneartist.id);
                            axios.get('/Music1_0_war/playlist/getArtistsPlaylists', {
                                params: {
                                    artistId: oneartist.id
                                }
                            }).then(function(response) {
                                 artistsPlaylists = response.data;
                                console.log("歌手歌单信息："+artistsPlaylists);
                                document.getElementById('playList-num').textContent = artistsPlaylists.length;

                                document.getElementById('artists-playlist').innerHTML = '';
                                document.getElementById('bio').innerHTML = '';
                                axios({
                                    method: "post",
                                    url: "/Music1_0_war/playlist/judgmentCollectartistPost",
                                    data: {
                                        userId: currentUserId,
                                        artistId:oneartist.id
                                    },
                                    headers: {"Content-Type": "application/json"},
                                }).then(function (response) {
                                    if (response.data === true) {
                                        document.getElementById('collectButton').textContent = "已收藏";
                                    }else{
                                        document.getElementById('collectButton').textContent = "收藏";
                                    }
                                }).catch(function (error) {
                                    console.error('Error:', error);
                                });

                                document.getElementById('6').style.display = 'block';
                                document.getElementById('1').style.display = 'none';

                            }).catch(function(error) {
                                console.error('获取歌手歌单信息失败:', error);
                            });
                        });

                        // 如果有五个艺术家，或者到了数组的最后一个元素，则将ul添加到artistList
                        if (count === 4 || index === filteredArtists.length - 1) {
                            while(count < 4) {
                                const emptyLi = document.createElement('li');
                                emptyLi.style.marginTop = '20px';
                                ul.appendChild(emptyLi);
                                count++;
                            }

                            artistList.appendChild(ul);
                            ul = document.createElement('ul');
                            ul.style.listStyle = 'none';
                            ul.style.padding = '0';
                            ul.style.display = 'grid';
                            ul.style.gridTemplateColumns = 'repeat(5, 1fr)';
                            ul.style.gridAutoRows = '250px';
                            ul.style.gap = '10px';
                            count = 0;
                        }
                    });
                }


            });


const collect1 = document.getElementById('collectButton');
// 定义收藏和取消收藏歌手的方法
function toggleArtistCollection(userId, artistId, isCollecting) {
    var url = isCollecting
        ? "/Music1_0_war/playlist/collectartist"
        : "/Music1_0_war/playlist/cancelCollectartist";

    axios({
        method: "post",
        url: url,
        data: {
            userId: userId,
            artistId: artistId
        },
        headers: {"Content-Type": "application/json"},
    }).then(function (response) {
        if (response.data === true) {
            var message = isCollecting
                ? '已收藏'
                : '收藏';
            collect1.textContent = message;

            var messageDisplay = isCollecting
                ? 'collectMessage'
                : 'successMessage';
            const messageElement = document.getElementById(messageDisplay);
            messageElement.style.display = "block";
            setTimeout(function() {
                messageElement.style.display = "none";
            }, 1000);
        } else {
            const failMessage = document.getElementById('failcollectMessage');
            failMessage.style.display = "block";
            setTimeout(function() {
                failMessage.style.display = "none";
            }, 1000);
        }
    }).catch(function (error) {
        console.error('Error:', error);
    });
}


collect1.addEventListener('click', function() {
    var isCollecting = collect1.textContent !== "已收藏";
    if (!isCollecting) {
        var confirmAction = confirm("确定要取消收藏吗？");
        if (confirmAction != true) {
            return;
        }
    }
    toggleArtistCollection(currentUserId, oneartist.id, isCollecting);
});

/*****歌手详情****/
function displaySongs(songs, limit) {
    let songList = document.createElement('ul');
    songs.slice(0, limit).forEach(song => {
        let li = document.createElement('li');
        let minutes = Math.floor(song.duration / 60);
        let seconds = Math.floor(song.duration % 60).toString().padStart(2, '0');
        li.textContent = song.name + ' ' + minutes + ':' + seconds;
        songList.appendChild(li);
    });
    return songList;
}
function createSongElement(song, index) {
    let li = document.createElement('li');
    li.style.backgroundColor = index % 2 === 0 ? '#f5f5f5' : '#fff'; // 隔行变色
    li.style.padding = '10px 0'; // 增加行高
    li.style.fontSize = '20px'; // 更大的歌曲文字
    li.style.display = 'flex'; // 将此行设为 Flexbox
    li.style.cursor = 'pointer'; // 设置鼠标指针为指针形状

    // Add hover effect
    li.addEventListener('mouseover', function () {
        li.style.backgroundColor = '#d3d3d3'; // 设置悬浮时的背景颜色
    });

    li.addEventListener('mouseout', function () {
        li.style.backgroundColor = index % 2 === 0 ? '#f5f5f5' : '#fff'; // 恢复原始的背景颜色
    });

    let songName = document.createElement('span');
    songName.textContent = song.name;

    let songTime = document.createElement('span');
    songTime.style.position = 'absolute';
    songTime.style.right = '400px'; // 将时间距离最右边固定在400px


    let audio = new Audio("/upload/" + song.filepath);
    audio.addEventListener('loadedmetadata', function () {
        let duration = audio.duration;
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60).toString().padStart(2, '0');
        songTime.textContent = minutes + ':' + seconds;
    });

    li.addEventListener('click', function () {
        playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar,song.is_member_song);
    });

    li.appendChild(songName);
    li.appendChild(songTime);

    return li;
}



function loadPlaylists() {
    const playlistContainer = document.getElementById('artists-playlist');
    playlistContainer.innerHTML = ''; // 清空之前的内容

    artistsPlaylists.forEach((playlist, index) => {
        playlist.expanded = false; // 新增，标记此歌单是否已完全展开
        let additionalSongs = []; // 新增，保存超过六首的歌曲的元素
        // 创建元素
        const div = document.createElement('div');
        div.style.display = 'flex'; // 使用 Flexbox 布局
        div.style.marginBottom = '30px'; // 每个歌单之间的间隔

        const divLeft = document.createElement('div');
        const img = document.createElement('img');
        img.src = "/upload/" + playlist.avatar;
        img.style.width = '400px'; // 更大的图片
        img.style.height = '300px'; // 更大的图片

        const pDate = document.createElement('p');
        pDate.textContent = '创建时间: ' + playlist.created_time;
        pDate.style.fontSize = '20px'; // 更大的文字
        pDate.style.marginTop = '30px'; // 增加10px间隔

        divLeft.appendChild(img);
        divLeft.appendChild(pDate);

        const divRight = document.createElement('div');
        divRight.style.marginLeft = '50px'; // 更大的间距
        divRight.style.flexGrow = '1'; // 允许右侧部分占用剩余空间

        const h4 = document.createElement('h4');
        h4.textContent = playlist.name;
        h4.style.marginLeft = '500px'; // 设置左边距为500px
        h4.style.fontSize = '25px';

        const ul = document.createElement('ul');
        ul.style.listStyle = 'none'; // 去掉列表前的点标记

        playlist.songs.slice(0, 6).forEach((song, index) => {
            ul.appendChild(createSongElement(song, index));
        });

        const a = document.createElement('a');

        a.href = '#';
        a.textContent = '查看所有';
        a.style.fontSize = '20px'; // 更大的链接文字
        a.addEventListener('click', function(event) {
            event.preventDefault();
            if (playlist.expanded) { // 如果已经展开，则收起
                additionalSongs.forEach(songElem => {
                    ul.removeChild(songElem);
                });
                additionalSongs = []; // 清空额外的歌曲列表
                a.textContent = '查看所有';
                playlist.expanded = false;
            } else { // 如果尚未展开，则展开
                playlist.songs.slice(6).forEach((song, index) => {
                    let songElem = createSongElement(song, index + 6);
                    ul.appendChild(songElem);
                    additionalSongs.push(songElem); // 记录此歌曲元素，以便之后移除
                });
                a.textContent = '收回';
                playlist.expanded = true;
            }
        });

        // 构建元素结构
        divRight.appendChild(h4);
        divRight.appendChild(ul);
        divRight.appendChild(a);

        div.appendChild(divLeft);
        div.appendChild(divRight);

        playlistContainer.appendChild(div);
    });
}


document.getElementById('comments-tab2').addEventListener('click', function(event) {
    event.preventDefault();  // 阻止默认行为
    // 改变"个人简介"链接的样式
    this.className = 'active-tab';
    // 恢复"歌单"链接的样式
    document.getElementById('song-list-tab2').className = '';
    // 显示歌手简介
    document.getElementById('bio').textContent = artistInfo;
    // 设置歌手简介为可见
    document.getElementById('bio').style.display = 'block';
    // 设置歌单列表为不可见
    document.getElementById('artists-playlist').style.display = 'none';

});

document.getElementById('song-list-tab2').addEventListener('click', function(event) {
    event.preventDefault(); // 阻止默认行为
    // 当链接被点击时，改变其样式
    this.className = 'active-tab';
    // 恢复"个人简介"链接的样式
    document.getElementById('comments-tab2').className = '';
    // 加载歌单
    loadPlaylists();
    // 设置歌单列表为可见
    document.getElementById('artists-playlist').style.display = 'block';
    // 设置歌手简介为不可见
    document.getElementById('bio').style.display = 'none';

});

function artistClickHandler(artist_id) {
    return function(event) {
        event.stopPropagation();
        console.log("执行了吗"+artist_id)
        var div5 = document.getElementById('5');
        div5.style.display = 'none';
        console.log("歌手门："+artists)
        var artist = artists.find(a => a.id == artist_id);

        // If the artist is not found, you might want to handle that scenario as well
        if (!artist) {
            console.error("Artist not found with id:", artist_id);
            return;
        }

        document.getElementById('playlist-image6').src = "/upload/" + artist.avatar;
        document.getElementById('playlist-title6').textContent = artist.nickname;
        document.getElementById('num').textContent = artist.songs.length;

        artistInfo = artist.bio;
        console.log("看到了发：" + artistInfo);
        oneartist = artist;
        // 发送请求获取歌手的歌单信息
        axios.get('/Music1_0_war/playlist/getArtistsPlaylists', {
            params: {
                artistId: artist_id
            }
        }).then(function(response) {
            // 将返回的数据保存到 artistsPlaylists
            artistsPlaylists = response.data;
            console.log("歌手歌单信息：" + artistsPlaylists);
            document.getElementById('playList-num').textContent = artistsPlaylists.length;

            document.getElementById('artists-playlist').innerHTML = '';
            document.getElementById('bio').innerHTML = '';
            // 检查用户是否已收藏这个艺术家

            axios({
                method: "post",
                url: "/Music1_0_war/playlist/judgmentCollectartistPost",
                data: {
                    userId: currentUserId,
                    artistId: artist_id
                },
                headers: {"Content-Type": "application/json"},
            }).then(function(response) {
                if (response.data === true) {
                    document.getElementById('collectButton').textContent = "已收藏";
                }else{
                    document.getElementById('collectButton').textContent = "收藏";
                }
            }).catch(function(error) {
                console.error('Error:', error);
            });

            // 显示元素 #6
            document.getElementById('6').style.display = 'block';
            document.getElementById('8').style.display = 'none';
            document.getElementById('1').style.display = 'none';

        }).catch(function(error) {
            console.error('获取歌手歌单信息失败:', error);
        });
    };
}




/***排行***/


// 显示第一页的歌曲

let totalPages6 = null;
document.getElementById('artists-tab7').addEventListener('click', function() {
    // 添加红色下划线效果
    this.classList.add('underline-effect');
    document.getElementById('videos-tab7').classList.remove('underline-effect');


// 排序歌曲
    let sortedSongs = [...allsongs].sort((a, b) => {
        let countA = parseInt(a.play_count, 10);
        let countB = parseInt(b.play_count, 10);

        if (countA < countB) return 1;
        if (countA > countB) return -1;
        return 0;
    });

    let totalPages6 = Math.ceil(sortedSongs.length / rowsPerPage7);

    totalPages7  = totalPages6;
    // 调用 showSongsForPage 来显示第一页
    showSongsForPage(currentPage7, sortedSongs);
    console.log('c',currentPage7)
    console.log('s',sortedSongs)

    // 显示歌曲列表，隐藏歌单列表
    document.getElementById('song-list7').style.display = 'block';
    document.getElementById('videos7').style.display = 'none';
});
let rowsPerPage7 = 10; // 每一页
let currentPage7 = 1; // 默认显示第一页
function showSongsForPage(page, sortedSongs) {
    let startRow = (page - 1) * rowsPerPage7;
    let endRow = startRow + rowsPerPage7;
    console.log('s',startRow)
    console.log('e',endRow)

    let tbody = document.getElementById('song-data7');
    tbody.innerHTML = '';  // 清空当前的歌曲列表

// 显示这一页的歌曲
    for (let i = startRow; i < endRow; i++) {
        if (i < sortedSongs.length) {
            let song = sortedSongs[i];
            let row = document.createElement('tr');

            row.dataset.songId = song.id;
            let audio = new Audio("/upload/" + song.filepath);
            audio.addEventListener('loadedmetadata', function() {
                let duration = audio.duration;
                let minutes = Math.floor(duration / 60);
                let seconds = Math.floor(duration % 60).toString().padStart(2, '0');
                row.innerHTML = `
        <td>
            <div style="display: flex; align-items: center;">
                <img src="/upload/${song.avatar}" alt="${song.name}" style="width:50px; height:50px; border-radius: 50%;">
                <span style="margin-left: 10px;">${song.name}</span>
            </div>
        </td>
        <td class="clickable-artist artist-name" style="cursor: pointer;">${song.artist}</td>
        <td>${minutes}:${seconds}</td>
        <td>${song.play_count}</td>
    `;

                let artistCell = row.querySelector('.artist-name');
                artistCell.addEventListener('click', artistClickHandler(song.artist_id));

                tbody.appendChild(row);
                row.addEventListener('click', function(event) {
                    console.log("Row clicked, target:", event.target.className);
                    // 如果点击的是歌手 td，则不执行
                    if (event.target && event.target.classList.contains('artist-name')) {
                        console.log("哈哈撒旦撒海打开")
                        return;
                    }
                    playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar,song.is_member_song);
                });
            });
        } else {
            break;
        }
    }


// 更新分页器
    let paginator = document.createElement('div');
    paginator.className = 'paginator7';

    let oldPaginator = document.querySelector('.paginator7');
    if (oldPaginator) {
        oldPaginator.remove();
    }

    document.getElementById('song-list7').appendChild(paginator);

// 上一页
    let prevElement = document.createElement('span');
    prevElement.innerText = "上一页";
    if (currentPage7 <= 1) {
        prevElement.style.opacity = "0.5"; // 如果是第一页，降低透明度
        prevElement.style.pointerEvents = "none"; // 并禁止点击
    }
    prevElement.addEventListener('click', function() {
        if (currentPage7 > 1) {
            currentPage7--;
            showSongsForPage(currentPage7, sortedSongs);
        }
    });
    paginator.appendChild(prevElement);

// 首页
    let firstElement = document.createElement('span');
    firstElement.innerText = 1;
    firstElement.addEventListener('click', function() {
        currentPage7 = 1;
        showSongsForPage(currentPage7, sortedSongs);
    });
    if (currentPage7 === 1) firstElement.className = 'active';
    paginator.appendChild(firstElement);

// 省略号（如果需要）
    if (currentPage7 > 3) {
        let dots = document.createElement('span');
        dots.innerText = "...";
        paginator.appendChild(dots);
    }

// 中间的页码
    for (let i = Math.max(2, currentPage7 - 2); i <= Math.min(totalPages7 - 1, currentPage7 + 2); i++) {
        let pageElement = document.createElement('span');
        pageElement.innerText = i;
        if (i === currentPage7) pageElement.className = 'active';
        pageElement.addEventListener('click', function() {
            currentPage7 = i;
            showSongsForPage(currentPage7, sortedSongs);
        });
        paginator.appendChild(pageElement);
    }

// 省略号（如果需要）
    if (currentPage7 < totalPages7 - 2) {
        let dots = document.createElement('span');
        dots.innerText = "...";
        paginator.appendChild(dots);
    }

// 最后一页
    if (totalPages7 > 1) {
        let lastElement = document.createElement('span');
        lastElement.innerText = totalPages7;
        lastElement.addEventListener('click', function() {
            currentPage7 = totalPages7;
            showSongsForPage(currentPage7, sortedSongs);
        });
        if (currentPage7 === totalPages7) lastElement.className = 'active';
        paginator.appendChild(lastElement);
    }

// 下一页
    let nextElement = document.createElement('span');
    nextElement.innerText = "下一页";
    if (currentPage7 >= totalPages7) {
        nextElement.style.opacity = "0.5"; // 如果是最后一页，降低透明度
        nextElement.style.pointerEvents = "none"; // 并禁止点击
    }
    nextElement.addEventListener('click', function() {
        if (currentPage7 < totalPages7) {
            currentPage7++;
            showSongsForPage(currentPage7, sortedSongs);
        }
    });
    paginator.appendChild(nextElement);

}
document.getElementById('videos-tab7').addEventListener('click', function() {
    // 添加红色下划线效果
    this.classList.add('underline-effect');
    document.getElementById('artists-tab7').classList.remove('underline-effect');

    // 隐藏歌曲列表
    document.getElementById('song-list7').style.display = 'none';
    // 显示歌单的内容
    document.getElementById('videos7').style.display = 'block';

    // 使用slice()复制allplaylist数组，然后对这个副本进行降序排序
    const sortedPlaylist = allplaylist.slice().sort((a, b) => b.playlist.play_count - a.playlist.play_count);
    const container = document.getElementById('videos7');
    // 先清空容器
    container.innerHTML = '';

    sortedPlaylist.forEach((item, index) => {
        const row = createPlaylistRow(item, index);
        container.appendChild(row);
    });
});

function createPlaylistRow(item, index) {
    const row = document.createElement('div');

    // 为div元素添加样式
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.padding = '10px';
    row.style.marginBottom = '10px';
    row.style.backgroundColor = index % 2 === 0 ? '#f5f5f5' : '#e0e0e0';
    row.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.7)';
    row.style.transition = 'background-color 0.3s'; // 添加过渡效果
    row.style.marginLeft = '180px'; // 将行元素向左移动150px
    row.style.marginRight = '150px'; // 将行元素向左移动150px

    // 添加鼠标悬停效果
    row.onmouseover = function() {
        this.style.backgroundColor = '#d0d0d0';
    };
    row.onmouseout = function() {
        this.style.backgroundColor = index % 2 === 0 ? '#f5f5f5' : '#e0e0e0';
    };

    // 创建头像元素
    const avatar = document.createElement('img');
    avatar.src = '/upload/' + item.playlist.avatar;
    avatar.alt = 'Playlist Avatar';
    avatar.style.width = '100px';
    avatar.style.height = '100px';
    avatar.style.marginRight = '10px';

    // 创建标题元素
    const title = document.createElement('span');
    title.textContent = item.playlist.name;
    title.style.fontWeight = 'bold';
    title.style.fontSize = '16px';
    title.style.marginLeft = '20px'; // 设置距离头像的距离

    // 创建容器来放置头像和标题
    const leftContainer = document.createElement('div');
    leftContainer.style.display = 'flex';
    leftContainer.style.alignItems = 'center';

    // 将头像和标题添加到容器
    leftContainer.appendChild(avatar);
    leftContainer.appendChild(title);

    // 创建播放次数元素
    const playCount = document.createElement('span');
    playCount.textContent = item.playlist.play_count + '次';

    // 添加元素到行中
    row.appendChild(leftContainer);
    row.appendChild(playCount);
    // 为整行添加点击事件
    row.addEventListener('click', function() {
        fetchPlaylistAndSongs1(item.playlist.id);

        // 获取指定 id 的 div，并修改其显示属性
        const targetDiv = document.getElementById('2');
        if (targetDiv) {
            targetDiv.style.display = 'block'; // 显示div
        }
        const ts = document.getElementById('1');
        if (ts) {
            ts.style.display = 'none';
        }
    });
    return row;
}

/*****搜索*****/

// 绑定事件处理器到输入框的 'keydown' 事件上
document.getElementById('initial-search-input').addEventListener('keydown', function(event) {
    // 判断是否按下了回车键
    if (event.key === 'Enter') {
        // 显示 div
        document.getElementById('8').style.display = 'block';
        document.getElementById('1').style.display = 'none';
        document.getElementById('2').style.display = 'none';
        document.getElementById('3').style.display = 'none';
        document.getElementById('4').style.display = 'none';
        document.getElementById('5').style.display = 'none';
        document.getElementById('6').style.display = 'none';
        document.getElementById('7').style.display = 'none';
        // 获取输入框的搜索内容
        var searchTerm = document.getElementById('initial-search-input').value;
        // 更新 p 标签的内容
        document.getElementById('search-term').innerText = searchTerm;
        // 更新 search-input 输入框的内容
        document.getElementById('search-input').value = searchTerm;
        // 这里你可以根据搜索结果来更新 'result-count' 的内容

        // 模拟对 "单曲" 按钮的点击事件
        document.getElementById('single-track-option').click();
    }
});
// 通过歌曲文件路径获取歌曲时长
function getSongDuration(filepath) {
    return new Promise((resolve) => {
        let audio = new Audio("/upload/" + filepath);
        audio.addEventListener('loadedmetadata', function() {
            let duration = audio.duration;
            let minutes = Math.floor(duration / 60);
            let seconds = Math.floor(duration % 60).toString().padStart(2, '0');
            resolve(`${minutes}:${seconds}`);
        });
    });
}

// 渲染搜索结果
async function renderSearchResults(results) {
    console.log("结果是："+JSON.stringify(results, null, 2));
    let resultsDiv = document.getElementById('单曲');
    resultsDiv.style.display = 'block';

    // 渲染表头
    let html = '<table><colgroup>';
    for(let i = 0; i < 4; i++){
        html += '<col span="1" style="width: 35%;">';
    }
    html += '</colgroup><thead><tr style="padding: 0;background-color: #9fcdff;">';
    html += '<th style="padding: 0px;">歌曲名字</th><th style="padding: 0px;">歌手名字</th><th style="padding: 0px;">播放时间</th><th style="padding: 0px;">播放次数</th>';
    html += '</tr></thead><tbody id="歌曲">';

    let promises = results.map(song => getSongDuration(song.filepath).then(duration => {
        return `<tr onclick="playSong(${song.id}, '${song.filepath}', '${song.name}', '${song.artist}', '${song.lyric}', '${song.avatar}',${song.is_member_song});" style="background-color: ${results.indexOf(song) % 2 === 0 ? '#fff' : '#eee'}; cursor: pointer;">
                <td><img src="/upload/${song.avatar}" style="width: 50px; height: 45px; border-radius: 50%; vertical-align: middle;"> ${song.name}</td>
                <td onclick="artistClickHandler('${song.artist_id}'); event.stopPropagation();">${song.artist}</td>
                <td>${duration}</td>
                <td>${song.play_count}</td>
            </tr>`;
    }));
    // 使用 Promise.all() 等待所有的 Promise 完成
    let rows = await Promise.all(promises);

    // 将每一行的 html 代码添加到整体的 html 中
    rows.forEach(row => {
        html += row;
    });

    html += '</tbody></table>';

    resultsDiv.innerHTML = html;
}


// 渲染歌手信息
function renderPlaylists1(playlists) {
    // 获取存放结果的 div
    var resultsDiv = document.getElementById('歌单');

    // 创建一个 ul 元素并设置其样式
    var ul = document.createElement('ul');
    ul.style.listStyle = 'none';  // 无项目符号
    ul.style.padding = '0';  // 无填充
    ul.style.display = 'grid';  // 使用 grid 布局
    ul.style.gridTemplateColumns = 'repeat(5, 1fr)';  // 一行有五个单元
    ul.style.gridAutoRows = '250px';  // 设置行高
    ul.style.gap = '10px';  // 设置单元格间隙

    // 遍历每个歌单
    for (var i = 0; i < playlists.length; i++) {
        // 创建一个 li 元素并设置其样式
        var li = document.createElement('li');
        li.style.marginTop = '20px';
        // 创建一个 img 元素并设置其 src 和样式属性
        var img = document.createElement('img');
        img.src = '/upload/' + playlists[i].avatar;
        img.style.width = '300px';  // 图片宽度100%
        img.style.height = '200px';  // 图片高度占80%，余下的20%留给文字部分
        img.style.objectFit = 'cover';  // 保持图片比例，同时充满容器

        // 创建一个 p 元素并设置其 textContent 和样式属性
        var p = document.createElement('p');
        p.textContent = playlists[i].name;
        p.style.textAlign = 'center';  // 文本居中
        p.style.marginTop = '10px';  // 为文本部分添加一些上边距
        // 使用自执行函数来捕获每个artist的引用
        (function(playlist) {
            li.onclick = function() {
                document.getElementById('2').style.display = 'block';
                document.getElementById('8').style.display = 'none';
                fetchPlaylistAndSongs1(playlist.id);
            };
        })(playlists[i]);
        // 将 img 和 p 添加到 li
        li.appendChild(img);
        li.appendChild(p);

        // 将 li 添加到 ul
        ul.appendChild(li);

    }

    // 清空 resultsDiv 的内容并将 ul 添加到 resultsDiv
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(ul);
}


// 渲染歌单信息
function renderArtists(artists) {
    // 获取存放结果的 div
    var resultsDiv = document.getElementById('歌手');

    // 创建一个 ul 元素并设置其样式
    var ul = document.createElement('ul');
    ul.style.listStyle = 'none';  // 无项目符号
    ul.style.padding = '0';  // 无填充
    ul.style.display = 'grid';  // 使用 grid 布局
    ul.style.gridTemplateColumns = 'repeat(5, 1fr)';  // 一行有五个单元
    ul.style.gridAutoRows = '250px';  // 设置行高
    ul.style.gap = '10px';  // 设置单元格间隙

    // 遍历每个艺术家
    for (var i = 0; i < artists.length; i++) {
        // 创建一个 li 元素并设置其样式
        var li = document.createElement('li');
        li.style.marginTop = '20px';

        // 创建一个 img 元素并设置其 src 和样式属性
        var img = document.createElement('img');
        img.src = '/upload/' + artists[i].avatar;
        img.style.width = '300px';  // 图片宽度100%
        img.style.height = '200px';  // 图片高度占80%，余下的20%留给文字部分
        img.style.objectFit = 'cover';  // 保持图片比例，同时充满容器

        // 添加鼠标悬浮效果
        img.style.transition = 'transform 0.3s';  // 过渡效果让放大看起来平滑

        // 当鼠标悬浮在图片上时放大
        img.onmouseover = function() {
            this.style.transform = 'scale(1.1)';  // 放大到110%
        };

        // 当鼠标从图片上移开时恢复原始大小
        img.onmouseout = function() {
            this.style.transform = 'scale(1)';  // 恢复到100%
        };

        // 创建一个 p 元素并设置其 textContent 和样式属性
        var p = document.createElement('p');
        p.textContent = artists[i].nickname;
        p.style.textAlign = 'center';  // 文本居中
        p.style.marginTop = '10px';  // 为文本部分添加一些上边距

        // 使用自执行函数来捕获每个artist的引用
        (function(artist) {
            li.onclick = artistClickHandler(artist.id);
        })(artists[i]);

        // 将 img 和 p 添加到 li
        li.appendChild(img);
        li.appendChild(p);

        // 将 li 添加到 ul
        ul.appendChild(li);
    }

    // 清空 resultsDiv 的内容并将 ul 添加到 resultsDiv
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(ul);
}

// 渲染用户信息
function renderUsers(users) {
    // 获取存放结果的 div
    var resultsDiv = document.getElementById('用户');

    resultsDiv.style.display = 'none';
    // 创建一个 ul 元素并设置其样式
    var ul = document.createElement('ul');
    ul.style.listStyle = 'none';  // 无项目符号
    ul.style.padding = '0';  // 无填充
    ul.style.display = 'grid';  // 使用 grid 布局
    ul.style.gridTemplateColumns = 'repeat(5, 1fr)';  // 一行有五个单元
    ul.style.gridAutoRows = '250px';  // 设置行高
    ul.style.gap = '10px';  // 设置单元格间隙

    // 遍历每个用户
    for (var i = 0; i < users.length; i++) {
        // 创建一个 li 元素并设置其样式
        var li = document.createElement('li');
        li.style.marginTop = '20px';

        // 创建一个 img 元素并设置其 src 和样式属性
        var img = document.createElement('img');
        img.src = '/upload/' + users[i].avatar;
        img.style.width = '300px';  // 图片宽度100%
        img.style.height = '200px';  // 图片高度占80%，余下的20%留给文字部分
        img.style.objectFit = 'cover';  // 保持图片比例，同时充满容器

        // 添加鼠标悬浮效果
        img.style.transition = 'transform 0.3s';  // 过渡效果让放大看起来平滑

        // 当鼠标悬浮在图片上时放大
        img.onmouseover = function() {
            this.style.transform = 'scale(1.1)';  // 放大到110%
        };

        // 当鼠标从图片上移开时恢复原始大小
        img.onmouseout = function() {
            this.style.transform = 'scale(1)';  // 恢复到100%
        };

        // 创建一个 p 元素并设置其 textContent 和样式属性
        var p = document.createElement('p');
        p.textContent = users[i].nickname;
        p.style.textAlign = 'center';  // 文本居中
        p.style.marginTop = '10px';  // 为文本部分添加一些上边距

        // 使用自执行函数来捕获每个artist的引用
        // 使用自执行函数来捕获每个user的引用
        (function(user) {
            li.onclick = function() {
                toggleDisplay(user);
            };
        })(users[i]);

        // 将 img 和 p 添加到 li
        li.appendChild(img);
        li.appendChild(p);

        // 将 li 添加到 ul
        ul.appendChild(li);
    }

    // 清空 resultsDiv 的内容并将 ul 添加到 resultsDiv
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(ul);
}



// 发送搜索请求的函数
function searchSongs(keyword) {
    console.log("传进来的："+keyword)
    return axios({
        method: "post",
        url: "/Music1_0_war/search/SearchInfo",
        data: { keyword: keyword }, // 将关键词作为参数发送到后端
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(function (response) {
        // 返回查询结果
        return response.data;
    }).catch(function(error) {
        console.log('Error occurred: ', error);
    });
}

// 搜索按钮点击事件
document.getElementById('search-button').addEventListener('click', function() {
    let keyword = document.getElementById('search-input').value;

    // 更新 p 标签的内容
    document.getElementById('search-term').innerText = keyword;
    searchSongs(keyword).then(function(results) {
        // 渲染每种搜索结果
        console.log("查找结果:"+JSON.stringify(results, null, 2));
        console.log("查找歌手data:"+JSON.stringify(results.songs, null, 2));
        renderSearchResults(results.songs);
        renderArtists(results.artists);
        renderPlaylists1(results.playlists);
        renderUsers(results.users);
    });

});

// 搜索框按回车键事件
document.getElementById('initial-search-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        let keyword = e.target.value;
            searchSongs(keyword).then(function(results) {
                // 渲染每种搜索结果
                console.log("查找结果:"+JSON.stringify(results, null, 2));
                console.log("查找歌手data:"+JSON.stringify(results.songs, null, 2));
                renderSearchResults(results.songs);
                renderArtists(results.artists);
                renderPlaylists1(results.playlists);
                renderUsers(results.users);
            });
    }
});


function addOptionEventHandlers(results) {
    // 获取所有的 option 按钮
    var options = document.getElementsByClassName('option');
    // 获取所有的 result-list div
    var resultLists = document.getElementsByClassName('result-list');

    // 遍历每个 option 按钮
    for (var i = 0; i < options.length; i++) {
        // 添加一个点击事件监听器
        options[i].addEventListener('click', function() {
            // 遍历每个 result-list div 和 option
            for (var j = 0; j < resultLists.length; j++) {
                // 隐藏所有的 result-list div
                resultLists[j].style.display = 'none';
                // 将所有的 option 按钮颜色恢复为默认颜色
                options[j].style.backgroundColor = '';
            }

            // 显示点击的按钮对应的 result-list div
            document.getElementById(this.innerHTML).style.display = 'block';
            // 将点击的按钮颜色变为红色
            this.style.backgroundColor = 'red';

            // 更新搜索结果数量和类型
            let countSpan = document.getElementById('result-count');
            let typeSpan = document.getElementById('result-type');

            switch(this.innerHTML) {
                case "单曲":
                    countSpan.textContent = results.songs.length;
                    typeSpan.textContent = "歌曲";
                    break;
                case "歌手":
                    countSpan.textContent = results.artists.length;
                    typeSpan.textContent = "歌手";
                    break;
                case "歌单":
                    countSpan.textContent = results.playlists.length;
                    typeSpan.textContent = "歌单";
                    break;
                case "用户":
                    countSpan.textContent = results.users.length;
                    typeSpan.textContent = "用户";
                    break;
            }
        });
    }
}

document.getElementById('search-button').addEventListener('click', function() {
    let keyword = document.getElementById('search-input').value;
    searchSongs(keyword).then(function(results) {

        // 渲染每种搜索结果
        renderSearchResults(results.songs);
        renderArtists(results.artists);
        renderPlaylists1(results.playlists);
        renderUsers(results.users);
        // 模拟对 "单曲" 按钮的点击事件
        document.getElementById('single-track-option').click();
        addOptionEventHandlers(results); // 添加事件处理程序
    });
});

document.getElementById('initial-search-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        let keyword = e.target.value;
        searchSongs(keyword).then(function(results) {

            // 渲染每种搜索结果
            renderSearchResults(results.songs);
            renderArtists(results.artists);
            renderPlaylists1(results.playlists);
            renderUsers(results.users);
            // 模拟对 "单曲" 按钮的点击事件
            document.getElementById('single-track-option').click();
            addOptionEventHandlers(results); // 添加事件处理程序

        });
    }
});



/****动态***/
let selectedSong = null;
let selectedPlaylist666 = null;
let selectedFiles = [];//选择的图片文件数据
let sendTime = null;

document.addEventListener("DOMContentLoaded", function() {
    // 获取需要操作的元素
    const link = document.querySelector(".link");
    const dynamicDiv = document.querySelector(".int");

    link.addEventListener("click", function(event) {
        event.preventDefault();  // 阻止默认行为
        selectedSong = null;
       selectedPlaylist666 = null;
        // 清空 <textarea> 的内容
        const contentTextarea = document.getElementById('content666');
        contentTextarea.innerHTML = '';

        // 清空 "show-music" 和 "image-search-list" 的内容
        const showMusic = document.getElementById('show-music');
        showMusic.innerHTML = '';
        const imageSearchList = document.getElementById('image-search-list');
        imageSearchList.innerHTML = '';
        selectedFiles = [];
        dynamicDiv.style.display = "block";  // 显示 <div class="int">
    });




// 我们先添加一个事件监听器给 "分享" 按钮
    document.getElementById('share').addEventListener('click', function() {
        // 获取已选歌曲或歌单的信息

        const showMusicDiv = document.getElementById('show-music');
        console.log('selectedSong',selectedSong)
        console.log('selectedPlaylist',selectedPlaylist666)
        // 显示"上传中"元素
        const uploading = document.getElementById('uploading');
        uploading.style.display = 'block';
        let songInfo = null;
        if (selectedSong) {
            songInfo = {
                type: 'song',
                avatar: selectedSong.avatar,
                name: selectedSong.name,
                artist: selectedSong.artist,
                lyric: selectedSong.lyric,
                id:selectedSong.id,
                filepath:selectedSong.filepath
            };
        } else if (selectedPlaylist666) {
            songInfo = {
                type: 'playlist',
                avatar: selectedPlaylist666.avatar,
                name: selectedPlaylist666.name,
                id:selectedPlaylist666.id,
                creator:selectedPlaylist666.creator,
                play_count:selectedPlaylist666.play_count,
                tags:selectedPlaylist666.tags,
                version:selectedPlaylist666.version
            };
        }


        // 获取已选图片
        const imageList = document.getElementById('image-search-list');
        const images = Array.from(imageList.querySelectorAll('img')).map(img => img.src);

        // 获取用户信息
        const user = {
            id:userss.id,
            avatar:'/upload/'+userss.avatar,
            nickname: userss.nickname
        };
        const shareButton = document.getElementById('share');
// 获取文本内容
        const content = document.getElementById('content666').innerHTML;

        if (content === '' && images.length === 0 && songInfo === null) {
            const successMessage = document.getElementById('failsend');
            successMessage.style.display = "block";
            setTimeout(function() {
                console.log("执行来吗")
                successMessage.style.display = "none";
            }, 2000);
            return;
        }
        if (content != '' || images.length != 0 || songInfo != null) {
            // 禁用分享按钮
            shareButton.disabled = true;

            // 使用 setTimeout 延迟2秒
            setTimeout(function() {
                // 隐藏"上传中"元素
                uploading.style.display = 'none';

                let formData = new FormData();

                //console.log('要发送了sendTime',sendTime)
                console.log('sendTime',userss.id)
                // 添加文本数据到formData中
                formData.append('user_id', userss.id);
                formData.append('content', content);
                formData.append('post_time',  new Date().toLocaleString());
                formData.append('song_id', songInfo && songInfo.type === 'song' ? songInfo.id : null);
              /*  formData.append('artist_id', songInfo && songInfo.type === 'song' ? songInfo.artist_id : null);*/
                formData.append('playlist_id', songInfo && songInfo.type === 'playlist' ? songInfo.id : null);

                console.log('selected',selectedFiles)
                console.log('selected',JSON.stringify(selectedFiles, null, 2))
                // 添加每一个文件到formData中
                selectedFiles.forEach((file, index) => {
                    formData.append('images[]', file, file.name);
                });
                 // 使用axios发送formData到后端
                console.log(formData)
                let p;
                axios({
                    method: "post",
                    url: "/Music1_0_war/search/savePostsInfo",
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data;charset=UTF-8'
                    }
                }).then(function(response) {
                    console.log("保存动态："+response.data.post_id)
                    p = response.data.post_id;
                    console.log('p69',p)
                    console.log('p7',p)
                    // 调用 renderDynamic
                    renderDynamic(p,user, content, songInfo, images);
                    }).catch(function(error) {

                    });
                document.querySelector('.int').style.display = 'none';

                // 启用分享按钮
                shareButton.disabled = false;
            }, 2000);

        }
    });



    document.getElementById('cancell').addEventListener('click', function() {
        const confirmation = window.confirm('你确定要退出编辑吗？');
        if (confirmation) {
            const inputDiv = document.querySelector('.int');
            inputDiv.style.display = 'none';  // 隐藏输入界面
        }
    });



    function showEmojiPicker() {
        const emojis = generateEmojis();
        const emojiPicker = document.createElement('div');
        emojiPicker.setAttribute('id', 'emojiPicker');
        emojiPicker.style.position = 'absolute';
        emojiPicker.style.border = '1px solid #ccc';
        emojiPicker.style.background = '#fff';
        emojiPicker.style.padding = '10px';
        emojiPicker.style.width = '200px';
        emojiPicker.style.overflowY = 'auto';
        emojiPicker.style.webkitScrollbar = 'none';
        emojiPicker.style.maxHeight = '200px';
        emojiPicker.style.zIndex = '10000';

/*        emojis.forEach(emoji => {
            const img = document.createElement('img');
            img.src = emoji.src;
            img.alt = emoji.alt;
            img.style.width = '20px';
            img.style.margin = '5px';
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                const textarea = document.getElementById('content666');
                textarea.value += `![${emoji.alt}](${emoji.src})`;
                emojiPicker.style.display = 'none';
            });
            emojiPicker.appendChild(img);
        });*/
        emojis.forEach(emoji => {
            const img = document.createElement('img');
            img.src = emoji.src;
            img.alt = emoji.alt;
            img.style.width = '20px';
            img.style.margin = '5px';
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                const contentDiv = document.getElementById('content666');
                contentDiv.innerHTML += `<img src="${emoji.src}" alt="${emoji.alt}"  style="width:20px;height: 20px;margin-bottom: -6px">`;
                emojiPicker.style.display = 'none';
            });
            emojiPicker.appendChild(img);
        });

        document.body.appendChild(emojiPicker);
        positionEmojiPicker();
    }

    function positionEmojiPicker() {
        const picker = document.getElementById('emojiPicker');
        const button = document.getElementById('emoji-picker666');
        const rect = button.getBoundingClientRect();

        picker.style.left = `${rect.right}px`;
        picker.style.top = `${rect.bottom}px`;
    }

    document.getElementById('emoji-picker666').addEventListener('click', function(e) {
        const picker = document.getElementById('emojiPicker');
        if (picker && picker.style.display === 'block') {
            picker.style.display = 'none';  // 如果picker是显示状态，那么隐藏它
        } else if (picker) {
            picker.style.display = 'block';  // 如果picker是隐藏状态，那么显示它
        } else {
            showEmojiPicker();
        }
    });


    document.getElementById('img-picker').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.addEventListener('change', function() {
            const imageList = document.getElementById('image-search-list');
            // 使用concat方法追加所选文件到selectedFiles数组
            selectedFiles = selectedFiles.concat(Array.from(input.files));
            Array.from(input.files).forEach(file => {

                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.style.position = 'relative';
                    imgWrapper.style.display = 'inline-block';
                    imgWrapper.style.margin = '5px';

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '50px';
                    img.style.height = '50px';
                    imgWrapper.appendChild(img);

                    const closeIcon = document.createElement('span');
                    closeIcon.innerHTML = 'x';
                    closeIcon.style.position = 'absolute';
                    closeIcon.style.top = '0';
                    closeIcon.style.right = '0';
                    closeIcon.style.background = '#fff';
                    closeIcon.style.cursor = 'pointer';
                    closeIcon.style.display = 'none';  // 默认隐藏
                    closeIcon.addEventListener('click', function() {
                        imageList.removeChild(imgWrapper);
                    });

                    imgWrapper.appendChild(closeIcon);

                    // 显示 closeIcon 当鼠标悬停在 imgWrapper 上
                    imgWrapper.addEventListener('mouseover', function() {
                        closeIcon.style.display = 'block';
                    });

                    // 隐藏 closeIcon 当鼠标移出 imgWrapper
                    imgWrapper.addEventListener('mouseout', function() {
                        closeIcon.style.display = 'none';
                    });

                    imageList.appendChild(imgWrapper);
                };
                reader.readAsDataURL(file);
            });
        });
        input.click();

    });

    document.getElementById('music-choice').addEventListener('click', function() {
        const modal = document.getElementById('musicModal');

        if (modal.style.display === 'block') {
            modal.style.display = 'none';  // 如果musicModal是显示的，那么隐藏它
        } else {
            showMusicModal();
        }
    });

    function showMusicModal() {
        const modal = document.getElementById('musicModal');
        const songList = document.getElementById('songList');

        songList.innerHTML = '';

        // 显示 playLogs
        playLogs.forEach(log => {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-type', 'song'); // 添加 'data-type' 属性
            listItem.innerText = `(歌曲) ${log.songs.name} - ${log.songs.artist}`;
            listItem.style.cursor = 'pointer';
            listItem.style.padding = '10px';

            listItem.addEventListener('click', function() {
                selectSong(log.songs);
                modal.style.display = 'none'; // Hide the modal after selection
            });

            songList.appendChild(listItem);
        });

        // 显示 allplaylist
        allplaylist.forEach(playlistItem => {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-type', 'playlist'); // 添加 'data-type' 属性
            listItem.innerText = `(歌单) ${playlistItem.playlist.name}`;
            listItem.style.cursor = 'pointer';
            listItem.style.padding = '10px';

            listItem.addEventListener('click', function() {
                selectPlaylist(playlistItem.playlist);
                modal.style.display = 'none'; // Hide the modal after selection
            });

            songList.appendChild(listItem);
        });
        modal.style.overflowY = 'auto';
        modal.style.webkitScrollbar = 'none';
        modal.style.display = 'block';
    }

    function selectSong(song) {
        // 保存选中的歌曲信息
        selectedSong = song;
        console.log('歌曲',song)
        console.log(selectedSong)
        selectedPlaylist = null;  // 清除任何已选的歌单
        const showMusicDiv = document.getElementById('show-music');

        const wrapDiv = document.createElement('div');
        setCommonStyles(wrapDiv);

        const avatar = document.createElement('img');
        avatar.src = '/upload/' + song.avatar;
        avatar.alt = song.name;
        setAvatarStyles(avatar);

        const songInfo = document.createElement('span');
        songInfo.innerText = `${song.name} ---- ${song.artist}`;

        showMusicDiv.innerHTML = '';
        wrapDiv.appendChild(avatar);
        wrapDiv.appendChild(songInfo);
        showMusicDiv.appendChild(wrapDiv);
    }

    function selectPlaylist(playlist) {
        // 保存选中的歌单信息
        selectedPlaylist666 = playlist;
        console.log('歌单',playlist)
        console.log(selectedPlaylist666 )
        selectedSong = null;  // 清除任何已选的歌曲
        const showMusicDiv = document.getElementById('show-music');

        const wrapDiv = document.createElement('div');
        setCommonStyles(wrapDiv);

        const avatar = document.createElement('img');
        avatar.src = '/upload/' + playlist.avatar;
        avatar.alt = playlist.name;
        setAvatarStyles(avatar);

        const playlistInfo = document.createElement('span');
        playlistInfo.innerText = `${playlist.name}`;

        showMusicDiv.innerHTML = '';
        wrapDiv.appendChild(avatar);
        wrapDiv.appendChild(playlistInfo);
        showMusicDiv.appendChild(wrapDiv);
    }

    function setCommonStyles(div) {
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.border = '1px solid gray';
        div.style.borderRadius = '10px';
        div.style.padding = '10px';
        div.style.marginTop = '10px';
    }

    function setAvatarStyles(img) {
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.marginRight = '10px';
    }
});



function renderDynamic(post_id,user, content, song, images) {
    const dynamicList = document.getElementById('dynamicList');

    // 创建新的动态元素
    const dynamicItem = document.createElement('li');
    dynamicItem.style.padding = '10px';
    dynamicItem.style.marginTop = '10px';
    dynamicItem.style.width = '100%';  // 设置为100%可以让它占据全部可用宽度
    dynamicItem.style.borderBottom = '1px solid #000000';


    // 第一行：用户信息
    const userInfoDiv = document.createElement('div');
    userInfoDiv.style.display = 'flex';
    userInfoDiv.style.alignItems = 'center';

    // 创建头像
    const avatar = document.createElement('img');
    avatar.src = user.avatar;
    avatar.alt = '用户头像';
    avatar.style.width = '50px';
    avatar.style.height = '50px';
    avatar.style.marginRight = '10px';
    avatar.style.borderRadius = '50%'; // 将边框半径设置为 50%，以实现圆形效果
    userInfoDiv.appendChild(avatar);
    const songtype = document.createElement('span');
    songtype.style.color = 'black';
    if(song) {
        if (song.type === 'song') {
            songtype.textContent = '分享歌曲';
        } else {
            songtype.textContent = '分享歌单';
        }
    }
    // 昵称和时间信息
    const nameTimeDiv = document.createElement('div');
    const nickname = document.createElement('div');
    nickname.textContent = user.nickname+'  ';
    nickname.style.color = 'blue';
    nameTimeDiv.appendChild(nickname);
    nickname.appendChild(songtype);

    const time = document.createElement('div');
    sendTime = new Date().toLocaleString();  // 当前时间
    time.textContent =  sendTime;
    nameTimeDiv.appendChild(time);

    userInfoDiv.appendChild(nameTimeDiv);
    dynamicItem.appendChild(userInfoDiv);

    // 第二行：内容部分
    const contentDiv = document.createElement('div');
    contentDiv.style.marginTop = '30px';
    contentDiv.style.marginLeft = '55px';
    contentDiv.innerHTML = filter.filter(content);  // 这将渲染文本和表情
    dynamicItem.appendChild(contentDiv);

    // 第三行：歌曲或歌单部分
    if (song) {

        const songDiv = document.createElement('div');
        songDiv.style.display = 'flex';
        songDiv.style.alignItems = 'center';
        songDiv.style.marginTop = '10px';
        songDiv.style.marginLeft = '55px';

        const songAvatar = document.createElement('img');
        songAvatar.src = '/upload/'+song.avatar;
        songAvatar.style.width = '50px';
        songAvatar.style.height = '55px';
        songAvatar.style.marginRight = '10px';
        songDiv.style.borderRadius = '15px';    // 圆角边框
        songDiv.style.padding = '10px';        // padding 使内部元素与边框有些许间距
        songDiv.style.backgroundColor = '#e0e0e0';  // 灰色背景
        songDiv.onmouseover = function() {      // 鼠标悬停效果
            this.style.backgroundColor = '#c0c0c0';  // 较深的灰色
        };
        songDiv.onmouseout = function() {
            this.style.backgroundColor = '#e0e0e0';
        };

        songDiv.appendChild(songAvatar);
        const songtype = document.createElement('span');
        songtype.textContent = '歌单';
        const songInfo = document.createElement('div');
        const songName = document.createElement('div');
        songName.textContent = song.name;
        const handleSongClick = function() {
            if (song.type === 'song') {
                playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar,song.is_member_song);
            } else if (song.type === 'playlist') {
                var div1 = document.getElementById('1');
                var div2 = document.getElementById('2');
                var div10 = document.getElementById('10');
                div1.style.display = 'none';
                div10.style.display = 'none';
                div2.style.display = 'block';
                fetchPlaylistAndSongs1(song.id);
            }
        };
        // 移除之前的监听器（如果有的话）并添加新的
        songDiv.removeEventListener('click', handleSongClick);
        songDiv.addEventListener('click', handleSongClick)

        if (song.type === 'song') {
            const songArtist = document.createElement('div');
            songArtist.textContent = song.artist;
            const songtype = document.createElement('span');
            songtype.style.color = 'red';
            songtype.textContent = '歌曲';
            songInfo.appendChild(songtype);
            songInfo.appendChild(songArtist);
        }else{
            const songtype = document.createElement('span');
            songtype.style.color = 'red';
            songtype.textContent = '歌单';
            songInfo.appendChild(songtype);

        }
        songInfo.appendChild(songName);
        songDiv.appendChild(songInfo);
        dynamicItem.appendChild(songDiv);
    }

    const imagesDiv = document.createElement('div');
    imagesDiv.style.marginTop = '10px';
    images.forEach(image => {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.display = 'inline-block';
        imgWrapper.style.marginRight = '5px';

        const img = document.createElement('img');
        img.src = image;
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.marginLeft = '50px';
        img.style.borderRadius = '10px';  // 设置圆角

        img.addEventListener('wheel', function(event) {
            // 获取当前图片的大小
            const currentWidth = parseFloat(this.style.width);
            const currentHeight = parseFloat(this.style.height);

            // 根据滚动的方向来调整图片的大小
            if (event.deltaY < 0) {
                // 向前滚动，放大图片
                this.style.width = (currentWidth * 1.1) + 'px';
                this.style.height = (currentHeight * 1.1) + 'px';
            } else {
                // 向后滚动，缩小图片
                this.style.width = (currentWidth * 0.9) + 'px';
                this.style.height = (currentHeight * 0.9) + 'px';
            }

            // 防止页面本身滚动
            event.preventDefault();
        });

        imgWrapper.appendChild(img);

        imagesDiv.appendChild(imgWrapper);
    });



    dynamicItem.appendChild(imagesDiv);
// 点赞部分
    const likeContainer = document.createElement('span');

    const likeLink = document.createElement('a');
    likeLink.href = '#';

    const heartIcon = document.createElement('i');
    heartIcon.className = "fa-regular fa-heart"; // 初始为未点赞的样式
    heartIcon.id = "heart-icon-regular22";
    likeLink.appendChild(heartIcon);

// 样式设置 (可以根据需要调整)
    likeLink.style.textDecoration = 'none';
    likeLink.style.padding = '5px';
    likeLink.style.borderRadius = '5px';
    likeLink.style.border = 'none';
    likeLink.style.marginLeft = '1700px';

    const likeCountSpan = document.createElement('span');
    likeCountSpan.textContent = '(0)'; // 初始值为0，使用括号包裹
    likeCountSpan.style.marginLeft = '5px';


    axios.get('/Music1_0_war/Likes/statistics', {
        params: {
            userId: userss.id,
            postId: post_id
        }
    }).then(response => {
        const data = response.data;
        if (data.userLiked) {
            heartIcon.className = "fa fa-heart fa-bounce";
            heartIcon.style.color = "#d70f2d";
        }
        likeCountSpan.textContent = `(${data.totalLikes})`;
    }).catch(error => {
        console.log('Error fetching like statistics:', error);
    });

    let clickTimes = []; // 存储点击的时间戳

    likeLink.onclick = function(e) {
        e.preventDefault();

        let now = Date.now();
        clickTimes.push(now);
        // 移除5秒之前的点击记录
        clickTimes = clickTimes.filter(time => now - time < 5000);

        // 如果在5秒内点击了5次
        if (clickTimes.length >= 5) {
            alert("操作过于频繁，请1分钟后再试！");
            likeLink.onclick = null; // 取消事件处理函数
            setTimeout(() => {
                likeLink.onclick = arguments.callee; // 1分钟后恢复事件处理函数
            }, 60000);
            return;
        }

        let currentLikeCount = parseInt(likeCountSpan.textContent.slice(1, -1));
        let userId = userss.id;
        let postId = post_id;

        console.log(userId)
        console.log(postId)
        // 判断当前的状态并更改
        if (heartIcon.className.includes('fa-regular')) {
            heartIcon.className = "fa fa-heart fa-bounce";
            heartIcon.style.color = "#d70f2d";
            likeCountSpan.textContent = `(${currentLikeCount + 1})`;
            console.log('66',userId)
            console.log('77',postId)
            axios.post('/Music1_0_war/Likes/likePosts', {
                userId: userId,
                postId: postId,
                action: 'like'
            }, {
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            }).then(response => {
                console.log('相应结果:', response.data);
            }).catch(error => {
                console.log('错误:', error);
            });
        } else {
            heartIcon.className = "fa-regular fa-heart";
            heartIcon.style.color = "";
            likeCountSpan.textContent = `(${currentLikeCount - 1})`;
            console.log('66',userId)
            console.log('77',postId)
            axios.post('/Music1_0_war/Likes/likePosts', {
                userId: userId,
                postId: postId,
                action: 'dislike'   // 这里我们告诉后端我们要取消点赞
            }, {
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            }).then(response => {
                console.log('相应结果:', response.data);
            }).catch(error => {
                console.log('错误:', error);
            });
        }
    };

    likeContainer.appendChild(likeLink);
    likeContainer.appendChild(likeCountSpan);


    dynamicItem.appendChild(likeContainer);

// 评论部分
    const commentContainer = document.createElement('span');

    const commentLink = document.createElement('a');
    commentLink.href = '#';
    /* commentLink.textContent = '评论';*/
    /*<i className="fa-sharp fa-regular fa-comment"></i>*/
    commentLink.className = "fa-sharp fa-regular fa-comment";
// 样式设置 (可以根据需要调整)
    commentLink.style.textDecoration = 'none';
    /*    commentLink.style.backgroundColor = 'gray';*/
    commentLink.style.padding = '5px';
    commentLink.style.borderRadius = '5px';
    commentLink.style.border = 'none';
    commentLink.style.marginLeft = '20px';



    const commentCountSpan = document.createElement('span');
    commentCountSpan.textContent = '(0)'; // 初始值为0，使用括号包裹
    commentCountSpan.style.marginLeft = '5px';

    axios.get('/Music1_0_war/Likes/statisticsPostsComment', {
        params: {
            postId: post_id
        }
    }).then(response => {
        const commentCount = response.data.commentCount;
        commentCountSpan.textContent = `(${commentCount})`;
    }).catch(error => {
        console.error("失败:", error);
    });


    const commentInputContainer = document.createElement('div');
    commentInputContainer.style.width = '100%';  // 撑满父容器
    commentInputContainer.style.padding = '10px';  // 给容器一些内边距
    commentInputContainer.style.boxSizing = 'border-box';  // 保证padding不会让宽度超过100%
    commentInputContainer.style.display = 'none'; // 默认隐藏输入框

    const commentInput = document.createElement('div');
    commentInput.contentEditable = true;  // 使div可编辑
    commentInput.style.width = '80%';
    commentInput.style.height = '50px';
    commentInput.style.marginLeft = '45px';
    commentInput.style.overflowY = 'auto';  // 防止内容溢出
    commentInput.style.border = '1px solid #ccc'; // 给它一个边界，使其看起来像输入框
    commentInput.style.display = 'flex';


    const emojiButton = document.createElement('button');
    emojiButton.textContent = '😀';
    emojiButton.style.marginRight = '10px';
    emojiButton.style.marginLeft = '1400px';

    const submitButton = document.createElement('button');
    submitButton.textContent = '评论';

    commentInputContainer.appendChild(commentInput);
    commentInputContainer.appendChild(emojiButton);
    commentInputContainer.appendChild(submitButton);



    emojiButton.onclick = function(e) {
        e.stopPropagation();  // 阻止事件冒泡，以防其他事件监听器干扰我们的逻辑

        if (emojiPicker.style.display === 'none') {
            emojiPicker.style.display = 'block';

            // 定位emoji选择器正好在emojiButton的下方
            const rect = emojiButton.getBoundingClientRect();
            emojiPicker.style.left = `${rect.left}px`;
            emojiPicker.style.top = `${rect.bottom + 5}px`;

            // 将emoji选择器添加到文档中，以便显示它
            document.body.appendChild(emojiPicker);
        } else {
            emojiPicker.style.display = 'none';
        }
    };

    // 点击页面的其他地方时隐藏emoji选择器
    document.addEventListener('click', function() {
        emojiPicker.style.display = 'none';
    });



    const emojiPicker = document.createElement('div');
    emojiPicker.style.display = 'none';  // 初始状态为隐藏
    emojiPicker.style.position = 'absolute';  // 使其浮动在页面上
    emojiPicker.style.backgroundColor = '#f9f9f9';  // 一个淡色背景
    emojiPicker.style.border = '1px solid #ccc';
    emojiPicker.style.borderRadius = '5px';
    emojiPicker.style.padding = '10px';
    emojiPicker.style.width = '200px';
    emojiPicker.style.zIndex = '1000';  // 确保它在其他元素之上

// 使用generateEmojis函数填充emoji选择器
    const emojis = generateEmojis();
    for (let emoji of emojis) {
        const emojiImg = document.createElement('img');
        emojiImg.src = emoji.src;
        emojiImg.alt = emoji.alt;
        emojiImg.style.cursor = 'pointer';  // 使其看起来像可点击的
        emojiImg.style.margin = '5px';

        emojiImg.onclick = function() {
            commentInput.innerHTML += `<img src="${emoji.src}" alt="${emoji.alt}"style="width: 30px;height: 30px">`;  // 将emoji添加到输入框
            emojiPicker.style.display = 'none';  // 隐藏emoji选择器
        };

        emojiPicker.appendChild(emojiImg);
    }


    // 这个函数创建并返回回复的评论内容和昵称的元素
    function createReplyToContent(nickname, content) {
        console.log(content)
        const replyToDiv = document.createElement('div');
        replyToDiv.style.backgroundColor = 'white';  // 白色背景框
        replyToDiv.style.marginTop = '5px';
        replyToDiv.style.border = '1px solid lightgray'; // 边框
        replyToDiv.style.padding = '5px';  // 内边距
        replyToDiv.style.borderRadius = '5px';  // 边框圆角
        replyToDiv.style.fontSize = '0.8em';
        replyToDiv.style.marginLeft = '50px';
        replyToDiv.style.borderRadius = '10px';

        const nicknameSpan = document.createElement('span');
        nicknameSpan.innerHTML = '@' + nickname;
        nicknameSpan.style.color = 'blue';
        nicknameSpan.style.display = 'inline-block'; // 让span支持高度设置
        nicknameSpan.style.height = '30px';
        nicknameSpan.style.lineHeight = '30px';  // 使文字垂直居中

        const contentSpan = document.createElement('span');
        contentSpan.innerHTML = `: ${content}`;
        contentSpan.style.display = 'inline-block'; // 让span支持高度设置
        contentSpan.style.height = '30px';
        contentSpan.style.lineHeight = '30px';  // 使文字垂直居中

        replyToDiv.appendChild(nicknameSpan);
        replyToDiv.appendChild(contentSpan);


        return replyToDiv;
    }



    function showReplyInput(targetComment, commentText, nickname) {
        // 显示输入框
        commentInputContainer.style.display = 'block';

        // 使用一个属性记录我们正在回复的评论和昵称
        commentInput.setAttribute('data-reply-to', nickname);
        commentInput.setAttribute('data-reply-content', commentText);

        // 设置div为可编辑状态
        commentInput.contentEditable = 'true';

        // 模拟placeholder的效果
        commentInput.innerHTML = `回复 ${nickname}: ${commentText}`;
        commentInput.style.color = 'gray'; // 可以使用灰色来模仿真实的placeholder

        // 当用户点击或聚焦到div时，检查其内容是否为模拟的placeholder，如果是，则清除它
        commentInput.addEventListener('focus', function() {
            if (commentInput.innerHTML === `回复 ${nickname}: ${commentText}`) {
                commentInput.innerHTML = '';
                commentInput.style.color = 'black'; // 更改颜色为正常文本颜色
            }
        });


        // 当div失去焦点时，如果它是空的，重新设置模拟的placeholder
        commentInput.addEventListener('blur', function() {
            if (!commentInput.innerHTML.trim()) {
                commentInput.innerHTML = `回复 ${nickname}: ${commentText}`;
                commentInput.style.color = 'gray';
            }
        });
    }



    const commentsList = document.createElement('div'); // 评论容器
    commentsList.style.marginLeft = '45px';
    commentsList.style.backgroundColor = '#C0C0C0';  // 灰色背景
    commentsList.style.marginRight = '60px';
    commentsList.style.borderRadius = '10px';  // 设置为圆角

    dynamicList.appendChild(commentsList);

    commentLink.onclick = function(e) {
        e.preventDefault();
        if (commentInputContainer.style.display === 'none') {
            console.log("点击了吗")
            commentInputContainer.style.display = 'block'; // 显示输入框
            commentsList.style.display  = 'block';
        } else {
            commentInputContainer.style.display = 'none'; // 隐藏输入框
            commentsList.style.display  = 'none';
        }
    };

    submitButton.onclick = function() {
        const commentDiv = document.createElement('div');
        commentDiv.style.display = 'flex';
        commentDiv.style.flexDirection = 'column';  // 垂直排列
        commentDiv.style.padding = '10px 0';  // 上下边距，使评论有区分度
        commentDiv.style.borderBottom = '1px solid gray';  // 为评论添加底边框



        const commentTopDiv = document.createElement('div');  // 用于包裹头像、昵称和评论内容
        commentTopDiv.style.display = 'flex';
        commentTopDiv.style.alignItems = 'center';  // 垂直居中对齐内容


        // 创建头像
        const avatar = document.createElement('img');
        avatar.src = '/upload/' + userss.avatar;
        avatar.style.width = '50px';
        avatar.style.height = '50px';
        avatar.style.borderRadius = '25px';
        avatar.style.marginRight = '10px';
        avatar.style.cursor = 'pointer';
        avatar.onclick = function() {
            toggleDisplay(userss);
        };
        commentTopDiv.appendChild(avatar);

// 昵称
        const nicknameSpan = document.createElement('span');
        nicknameSpan.textContent = userss.nickname + ' :';
        nicknameSpan.style.color = 'blue';
        nicknameSpan.style.marginRight = '10px';
        nicknameSpan.style.cursor = 'pointer';
        nicknameSpan.onclick = function() {
            toggleDisplay(userss);
        };
        commentTopDiv.appendChild(nicknameSpan);

        // 评论内容
        const commentText = document.createElement('span');
        commentText.innerHTML = commentInput.innerHTML;
        commentText.style.display = 'flex';
        commentTopDiv.appendChild(commentText);

        commentDiv.appendChild(commentTopDiv);

        // 评论时间
        const timeSpan = document.createElement('span');
        timeSpan.textContent = new Date().toLocaleString();
        timeSpan.style.marginTop = '5px';  // 时间与上面内容的间距
        timeSpan.style.fontSize = '0.8em';
        commentDiv.appendChild(timeSpan);
        // 添加回复链接到评论
        const replyLink = document.createElement('a');
        replyLink.innerHTML = '回复';
        replyLink.href = '#';
        replyLink.style.marginLeft = 'auto'; // 自动填充左侧

        commentTopDiv.appendChild(replyLink);

        replyLink.onclick = function(e) {
            e.preventDefault();

            const commentId = commentDiv.getAttribute('data-comment-id'); // 获取当前评论的ID
            const topLevelCommentId = commentDiv.getAttribute('data-top-level-comment-id') || commentId; // 获取顶级评论ID，如果不存在则使用当前评论ID

            commentInput.setAttribute('data-parent-id', commentId); // 设置被回复的评论ID
            commentInput.setAttribute('data-top-level-comment-id', topLevelCommentId); // 设置顶级评论ID

            showReplyInput(commentDiv, commentText.innerHTML, userss.nickname);
        };




        const isReply = commentInput.hasAttribute('data-reply-to'); // 检查是否有data-parent-id属性来判断是否为回复

        let parentId = null;
        let topLevelCommentId = null;

        if (isReply) {
            replyToNickname = commentInput.getAttribute('data-reply-to');
            replyToContent = commentInput.getAttribute('data-reply-content');

            parentId = parseInt(commentInput.getAttribute('data-parent-id')); // 获取父评论ID
            topLevelCommentId = parseInt(commentInput.getAttribute('data-top-level-comment-id')) || parentId; // 如果存在顶级评论ID就取，否则取父评论ID（即回复的是顶级评论）

            // 清除回复相关属性
            commentInput.removeAttribute('data-reply-to');
            commentInput.removeAttribute('data-reply-content');

            commentInput.placeholder = "请输入您的评论...";  // 这里设置为默认占位符


            const replyToDiv = createReplyToContent(replyToNickname, replyToContent);
            commentDiv.insertBefore(replyToDiv, timeSpan);  // 在时间前插入回复内容
        }



        // 评论内容构建
        const commentData = {
            user_id: userss.id,  // 发送者ID
            user_posts_id: post_id, // 动态ID
            content: filter.filter(commentInput.innerHTML), // 评论内容
            comment_time: new Date().toISOString(), // 评论时间
            parent_id: parentId,
            top_level_comment_id: topLevelCommentId,
        };

        console.log(commentData)

        axios.post('/Music1_0_war/Likes/comments', commentData, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then(response => {
            console.log(response.data)
            if (response.data.success) {
                console.log("评论保存成功！");

                const currentCount = parseInt(commentCountSpan.textContent.match(/\d+/)[0]);
                console.log(currentCount)
                const newCount = currentCount + 1;
                commentCountSpan.textContent = `(${newCount})`;

                const newCommentId = response.data.comment_id;
                commentDiv.setAttribute('data-comment-id', newCommentId); // 保存评论ID

                const parentId = response.data.parent_id; // 如果存在的话
                const topLevelCommentId = response.data.top_level_comment_id; // 如果存在的话

                if (parentId !== undefined && parentId !== null) {
                    commentDiv.setAttribute('data-parent-id', parentId); // 设置父评论ID
                }
                if (topLevelCommentId !== undefined && topLevelCommentId !== null) {
                    commentDiv.setAttribute('data-top-level-comment-id', topLevelCommentId); // 设置顶级评论ID
                }


            } else {
                console.error("保存评论失败：", response.data.message);
            }
        }).catch(error => {
            console.error("保存评论时出错：", error);
        });

        if (commentsList.firstChild) {
            commentsList.insertBefore(commentDiv, commentsList.firstChild);
        } else {
            commentsList.appendChild(commentDiv);
        }
        commentInput.innerHTML = '';  // 清空输入框

        commentInputContainer.style.display = 'none'; // 提交评论后隐藏输入框
    };






    commentContainer.appendChild(commentLink);
    commentContainer.appendChild(commentCountSpan);
    dynamicItem.appendChild(commentContainer);
    dynamicList.appendChild(dynamicItem);



    console.log('11user.id',user.id)
    console.log('11currentUserId',currentUserId)
    if(user.id == currentUserId){
        const deleteLink = document.createElement('a');
        deleteLink.href = '#';
        /* deleteLink.textContent = '删除';*/
        deleteLink.className = "fa fa-trash"
        /*deleteLink.style.position = 'absolute';  // 设置为绝对位置以放置在右下角*/
        deleteLink.style.marginLeft = '20px';
        deleteLink.style.bottom = '10px';
        deleteLink.style.right = '10px';
        deleteLink.style.textDecoration = 'none';  // 去掉下划线
        /*        deleteLink.style.backgroundColor = 'gray';*/
        deleteLink.style.padding = '5px';
        deleteLink.style.borderRadius = '5px';  // 圆角
        deleteLink.style.border = 'none';  // 无边框
        deleteLink.onclick = function(e) {
            e.preventDefault();
            console.log('post_id',post_id)
            axios({
                method: "post",
                url: "/Music1_0_war/search/deletePosts",
                headers: {
                    'Content-Type': 'multipart/form-data;charset=UTF-8'
                },
                data: { post_id: post_id }  // 发送post_id作为请求的数据
            }).then(function (response) {
                dynamicList.removeChild(dynamicItem);
            }).catch(function (error) {
                console.error("Error deleting post:", error);
            });
        };

        dynamicItem.appendChild(deleteLink);
        dynamicItem.style.position = 'relative';  // 为了使删除链接的绝对位置相对于它
    }

    // 将新的动态元素添加到列表的顶部
    if (dynamicList.firstChild) {
        dynamicList.insertBefore(dynamicItem, dynamicList.firstChild);
    } else {
        dynamicList.appendChild(dynamicItem);
    }
}




function renderDynamic1(post_id,Time,user, content, song, images,totalLikes) {
    const dynamicList = document.getElementById('dynamicList');

    // 创建新的动态元素
    const dynamicItem = document.createElement('li');
    dynamicItem.style.padding = '10px';
    dynamicItem.style.marginTop = '10px';
    dynamicItem.style.width = '100%';  // 设置为100%可以让它占据全部可用宽度
    dynamicItem.style.borderBottom = '1px solid #000000';


    // 第一行：用户信息
    const userInfoDiv = document.createElement('div');
    userInfoDiv.style.display = 'flex';
    userInfoDiv.style.alignItems = 'center';

    // 创建头像
    const avatar = document.createElement('img');
    avatar.src = user.avatar;
    avatar.alt = '用户头像';
    avatar.style.width = '50px';
    avatar.style.height = '50px';
    avatar.style.marginRight = '10px';
    avatar.style.borderRadius = '50%'; // 将边框半径设置为 50%，以实现圆形效果
    userInfoDiv.appendChild(avatar);
    const songtype = document.createElement('span');
    songtype.style.color = 'black';
    if(song) {
        if (song.type === 'song') {
            songtype.textContent = '分享歌曲';
        } else {
            songtype.textContent = '分享歌单';
        }
    }
    // 昵称和时间信息
    const nameTimeDiv = document.createElement('div');
    const nickname = document.createElement('div');
    nickname.textContent = user.nickname+'  ';
    nickname.style.color = 'blue';
    nameTimeDiv.appendChild(nickname);
    nickname.appendChild(songtype);

    const time = document.createElement('div');
    Time = convertDateFormat(Time);
    sendTime = Time;  // 当前时间
    time.textContent =  sendTime;
    nameTimeDiv.appendChild(time);

    userInfoDiv.appendChild(nameTimeDiv);
    dynamicItem.appendChild(userInfoDiv);

    // 第二行：内容部分
    const contentDiv = document.createElement('div');
    contentDiv.style.marginTop = '30px';
    contentDiv.style.marginLeft = '55px';
    contentDiv.innerHTML = content;  // 这将渲染文本和表情
    dynamicItem.appendChild(contentDiv);

    // 第三行：歌曲或歌单部分
    if (song) {
        const songDiv = document.createElement('div');
        songDiv.style.display = 'flex';
        songDiv.style.alignItems = 'center';
        songDiv.style.marginTop = '10px';
        songDiv.style.marginLeft = '55px';
        songDiv.style.marginBottom = '20px';

        const songAvatar = document.createElement('img');
        songAvatar.src = '/upload/'+song.avatar;
        songAvatar.style.width = '50px';
        songAvatar.style.height = '55px';
        songAvatar.style.marginRight = '10px';
        songDiv.style.borderRadius = '15px';    // 圆角边框
        songDiv.style.padding = '10px';        // padding 使内部元素与边框有些许间距
        songDiv.style.backgroundColor = '#e0e0e0';  // 灰色背景
        songDiv.onmouseover = function() {      // 鼠标悬停效果
            this.style.backgroundColor = '#c0c0c0';  // 较深的灰色
        };
        songDiv.onmouseout = function() {
            this.style.backgroundColor = '#e0e0e0';
        };

        songDiv.appendChild(songAvatar);
        const songtype = document.createElement('span');
        songtype.textContent = '歌单';
        const songInfo = document.createElement('div');
        const songName = document.createElement('div');
        songName.textContent = song.name;
        const handleSongClick = function() {
            if (song.type === 'song') {
                playSong(song.id, song.filepath, song.name, song.artist, song.lyric, song.avatar,song.is_member_song);
            } else if (song.type === 'playlist') {
                var div1 = document.getElementById('1');
                var div2 = document.getElementById('2');
                var div10 = document.getElementById('10');
                div1.style.display = 'none';
                div10.style.display = 'none';
                div2.style.display = 'block';
                fetchPlaylistAndSongs1(song.id);
            }
        };
        // 移除之前的监听器（如果有的话）并添加新的
        songDiv.removeEventListener('click', handleSongClick);
        songDiv.addEventListener('click', handleSongClick)

        if (song.type === 'song') {
            const songArtist = document.createElement('div');
            songArtist.textContent = song.artist;
            const songtype = document.createElement('span');
            songtype.style.color = 'red';
            songtype.textContent = '歌曲';
            songInfo.appendChild(songtype);
            songInfo.appendChild(songArtist);
        }else{
            const songtype = document.createElement('span');
            songtype.style.color = 'red';
            songtype.textContent = '歌单';
            songInfo.appendChild(songtype);

        }
        songInfo.appendChild(songName);
        songDiv.appendChild(songInfo);
        dynamicItem.appendChild(songDiv);
    }



    const imagesDiv = document.createElement('div');
    imagesDiv.style.marginTop = '10px';
    images.forEach(image => {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.display = 'inline-block';
        imgWrapper.style.marginRight = '5px';

        const img = document.createElement('img');
        img.src = '/upload/'+image;
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.marginLeft = '50px';
        img.style.borderRadius = '10px';  // 设置圆角

        img.addEventListener('wheel', function(event) {
            // 获取当前图片的大小
            const currentWidth = parseFloat(this.style.width);
            const currentHeight = parseFloat(this.style.height);

            // 根据滚动的方向来调整图片的大小
            if (event.deltaY < 0) {
                // 向前滚动，放大图片
                this.style.width = (currentWidth * 1.1) + 'px';
                this.style.height = (currentHeight * 1.1) + 'px';
            } else {
                // 向后滚动，缩小图片
                this.style.width = (currentWidth * 0.9) + 'px';
                this.style.height = (currentHeight * 0.9) + 'px';
            }

            // 防止页面本身滚动
            event.preventDefault();
        });

        imgWrapper.appendChild(img);

        imagesDiv.appendChild(imgWrapper);
    });


    dynamicItem.appendChild(imagesDiv);
// 点赞部分
    const likeContainer = document.createElement('span');

    const likeLink = document.createElement('a');
    likeLink.href = '#';

    const heartIcon = document.createElement('i');
    heartIcon.className = "fa-regular fa-heart"; // 初始为未点赞的样式
    heartIcon.id = "heart-icon-regular22";
    likeLink.appendChild(heartIcon);

// 样式设置 (可以根据需要调整)
    likeLink.style.textDecoration = 'none';
    likeLink.style.padding = '5px';
    likeLink.style.borderRadius = '5px';
    likeLink.style.border = 'none';
    likeLink.style.marginLeft = '1500px';

    const likeCountSpan = document.createElement('span');
    likeCountSpan.textContent = '(0)'; // 初始值为0，使用括号包裹
    likeCountSpan.style.marginLeft = '5px';

/*    likeCountSpan.textContent = `(${totalLikes})`;*/

    axios.get('/Music1_0_war/Likes/statistics', {
        params: {
            userId: userss.id,
            postId: post_id
        }
    }).then(response => {
        const data = response.data;
        if (data.userLiked) {
            heartIcon.className = "fa fa-heart fa-bounce";
            heartIcon.style.color = "#d70f2d";
        }
        likeCountSpan.textContent = `(${data.totalLikes})`;
    }).catch(error => {
        console.log('Error fetching like statistics:', error);
    });

    let clickTimes = []; // 存储点击的时间戳

    likeLink.onclick = function(e) {
        e.preventDefault();

        let now = Date.now();
        clickTimes.push(now);
        // 移除5秒之前的点击记录
        clickTimes = clickTimes.filter(time => now - time < 5000);

        // 如果在5秒内点击了5次
        if (clickTimes.length >= 5) {
            alert("操作过于频繁，请1分钟后再试！");
            likeLink.onclick = null; // 取消事件处理函数
            setTimeout(() => {
                likeLink.onclick = arguments.callee; // 1分钟后恢复事件处理函数
            }, 60000);
            return;
        }

        let currentLikeCount = parseInt(likeCountSpan.textContent.slice(1, -1));
        let userId = userss.id;
        let postId = post_id;

        console.log(userId)
        console.log(postId)
        // 判断当前的状态并更改
        if (heartIcon.className.includes('fa-regular')) {
            heartIcon.className = "fa fa-heart fa-bounce";
            heartIcon.style.color = "#d70f2d";
            likeCountSpan.textContent = `(${currentLikeCount + 1})`;
            console.log('66',userId)
            console.log('77',postId)
            axios.post('/Music1_0_war/Likes/likePosts', {
                userId: userId,
                postId: postId,
                action: 'like'
            }, {
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            }).then(response => {
                console.log('相应结果:', response.data);
            }).catch(error => {
                console.log('错误:', error);
            });
        } else {
            heartIcon.className = "fa-regular fa-heart";
            heartIcon.style.color = "";
            likeCountSpan.textContent = `(${currentLikeCount - 1})`;
            console.log('66',userId)
            console.log('77',postId)
            axios.post('/Music1_0_war/Likes/likePosts', {
                    userId: userId,
                    postId: postId,
                    action: 'dislike'   // 这里我们告诉后端我们要取消点赞
                }, {
                    headers: { "Content-Type": "application/json; charset=UTF-8" }
                }).then(response => {
                console.log('相应结果:', response.data);
            }).catch(error => {
                console.log('错误:', error);
            });
        }
    };

    likeContainer.appendChild(likeLink);
    likeContainer.appendChild(likeCountSpan);


    dynamicItem.appendChild(likeContainer);

// 评论部分
    const commentContainer = document.createElement('span');

    const commentLink = document.createElement('a');
    commentLink.href = '#';
   /* commentLink.textContent = '评论';*/
    /*<i className="fa-sharp fa-regular fa-comment"></i>*/
    commentLink.className = "fa-sharp fa-regular fa-comment";
// 样式设置 (可以根据需要调整)
    commentLink.style.textDecoration = 'none';
/*    commentLink.style.backgroundColor = 'gray';*/
    commentLink.style.padding = '5px';
    commentLink.style.borderRadius = '5px';
    commentLink.style.border = 'none';
    commentLink.style.marginLeft = '20px';



    const commentCountSpan = document.createElement('span');
    commentCountSpan.textContent = '(0)'; // 初始值为0，使用括号包裹
    commentCountSpan.style.marginLeft = '5px';

    axios.get('/Music1_0_war/Likes/statisticsPostsComment', {
        params: {
            postId: post_id
        }
    }).then(response => {
        const commentCount = response.data.commentCount;
        commentCountSpan.textContent = `(${commentCount})`;
    }).catch(error => {
        console.error("失败:", error);
    });


    const commentInputContainer = document.createElement('div');
    commentInputContainer.style.width = '100%';  // 撑满父容器
    commentInputContainer.style.padding = '10px';  // 给容器一些内边距
    commentInputContainer.style.boxSizing = 'border-box';  // 保证padding不会让宽度超过100%
    commentInputContainer.style.display = 'none'; // 默认隐藏输入框

    const commentInput = document.createElement('div');
    commentInput.contentEditable = true;  // 使div可编辑
    commentInput.style.width = '80%';
    commentInput.style.height = '50px';
    commentInput.style.marginLeft = '45px';
    commentInput.style.overflowY = 'auto';  // 防止内容溢出
    commentInput.style.border = '1px solid #ccc'; // 给它一个边界，使其看起来像输入框
    commentInput.style.display = 'flex';


    const emojiButton = document.createElement('button');
    emojiButton.textContent = '😀';
    emojiButton.style.marginRight = '10px';
    emojiButton.style.marginLeft = '1400px';

    const submitButton = document.createElement('button');
    submitButton.textContent = '评论';

    commentInputContainer.appendChild(commentInput);
    commentInputContainer.appendChild(emojiButton);
    commentInputContainer.appendChild(submitButton);



    emojiButton.onclick = function(e) {
        e.stopPropagation();  // 阻止事件冒泡，以防其他事件监听器干扰我们的逻辑

        if (emojiPicker.style.display === 'none') {
            emojiPicker.style.display = 'block';

            // 定位emoji选择器正好在emojiButton的下方
            const rect = emojiButton.getBoundingClientRect();
            emojiPicker.style.left = `${rect.left}px`;
            emojiPicker.style.top = `${rect.bottom + 5}px`;

            // 将emoji选择器添加到文档中，以便显示它
            document.body.appendChild(emojiPicker);
        } else {
            emojiPicker.style.display = 'none';
        }
    };

    // 点击页面的其他地方时隐藏emoji选择器
    document.addEventListener('click', function() {
        emojiPicker.style.display = 'none';
    });



    const emojiPicker = document.createElement('div');
    emojiPicker.style.display = 'none';  // 初始状态为隐藏
    emojiPicker.style.position = 'absolute';  // 使其浮动在页面上
    emojiPicker.style.backgroundColor = '#f9f9f9';  // 一个淡色背景
    emojiPicker.style.border = '1px solid #ccc';
    emojiPicker.style.borderRadius = '5px';
    emojiPicker.style.padding = '10px';
    emojiPicker.style.width = '200px';
    emojiPicker.style.zIndex = '1000';  // 确保它在其他元素之上

// 使用generateEmojis函数填充emoji选择器
    const emojis = generateEmojis();
    for (let emoji of emojis) {
        const emojiImg = document.createElement('img');
        emojiImg.src = emoji.src;
        emojiImg.alt = emoji.alt;
        emojiImg.style.cursor = 'pointer';  // 使其看起来像可点击的
        emojiImg.style.margin = '5px';

        emojiImg.onclick = function() {
            commentInput.innerHTML += `<img src="${emoji.src}" alt="${emoji.alt}"style="width: 30px;height: 30px">`;  // 将emoji添加到输入框
            emojiPicker.style.display = 'none';  // 隐藏emoji选择器
        };

        emojiPicker.appendChild(emojiImg);
    }


    // 这个函数创建并返回回复的评论内容和昵称的元素
    function createReplyToContent(nickname, content) {
        console.log(content)
        const replyToDiv = document.createElement('div');
        replyToDiv.style.backgroundColor = 'white';  // 白色背景框
        replyToDiv.style.marginTop = '5px';
        replyToDiv.style.border = '1px solid lightgray'; // 边框
        replyToDiv.style.padding = '5px';  // 内边距
        replyToDiv.style.borderRadius = '5px';  // 边框圆角
        replyToDiv.style.fontSize = '0.8em';
        replyToDiv.style.marginLeft = '50px';
        replyToDiv.style.borderRadius = '10px';

        const nicknameSpan = document.createElement('span');
        nicknameSpan.innerHTML = '@' + nickname;
        nicknameSpan.style.color = 'blue';
        nicknameSpan.style.display = 'inline-block'; // 让span支持高度设置
        nicknameSpan.style.height = '30px';
        nicknameSpan.style.lineHeight = '30px';  // 使文字垂直居中

        const contentSpan = document.createElement('span');
        contentSpan.innerHTML = `: ${content}`;
        contentSpan.style.display = 'inline-block'; // 让span支持高度设置
        contentSpan.style.height = '30px';
        contentSpan.style.lineHeight = '30px';  // 使文字垂直居中

        replyToDiv.appendChild(nicknameSpan);
        replyToDiv.appendChild(contentSpan);


        return replyToDiv;
    }



    function showReplyInput(targetComment, commentText, nickname) {
        // 显示输入框
        commentInputContainer.style.display = 'block';

        // 使用一个属性记录我们正在回复的评论和昵称
        commentInput.setAttribute('data-reply-to', nickname);
        commentInput.setAttribute('data-reply-content', commentText);

        // 设置div为可编辑状态
        commentInput.contentEditable = 'true';

        // 模拟placeholder的效果
        commentInput.innerHTML = `回复 ${nickname}: ${commentText}`;
        commentInput.style.color = 'gray'; // 可以使用灰色来模仿真实的placeholder

        // 当用户点击或聚焦到div时，检查其内容是否为模拟的placeholder，如果是，则清除它
        commentInput.addEventListener('focus', function() {
            if (commentInput.innerHTML === `回复 ${nickname}: ${commentText}`) {
                commentInput.innerHTML = '';
                commentInput.style.color = 'black'; // 更改颜色为正常文本颜色
            }
        });


        // 当div失去焦点时，如果它是空的，重新设置模拟的placeholder
        commentInput.addEventListener('blur', function() {
            if (!commentInput.innerHTML.trim()) {
                commentInput.innerHTML = `回复 ${nickname}: ${commentText}`;
                commentInput.style.color = 'gray';
            }
        });
    }



    const commentsList = document.createElement('div'); // 评论容器
    commentsList.style.display = 'none';
    commentsList.style.marginLeft = '45px';
    commentsList.style.marginRight = '60px';
    commentsList.style.backgroundColor = '#C0C0C0';  // 灰色背景



    // 假设你已经创建了其他前面提到的元素和函数

    axios.get('/Music1_0_war/Likes/getPostComment', {
        params: {
            postId: post_id
        }
    }).then(response => {
        const commentsData = response.data;

        console.log("评论大全：",JSON.stringify(commentsData, null, 2))

// 创建一个查找表
        const commentLookup = {};
        commentsData.forEach(comment => {
            commentLookup[comment.id] = {
                username: comment.nickname,
                content: comment.content
            };
        });

        commentsData.forEach(comment => {
            renderComment(comment, commentLookup);
        });
    }).catch(error => {
        console.error("加载评论时出错：", error);
    });

    function renderComment(comment, commentLookup) {
        const commentDiv = document.createElement('div');
        commentDiv.style.display = 'flex';
        commentDiv.style.flexDirection = 'column';
        commentDiv.style.padding = '10px 0';
        commentDiv.style.borderBottom = '1px solid gray';

        const commentTopDiv = document.createElement('div');
        commentTopDiv.style.display = 'flex';
        commentTopDiv.style.alignItems = 'center';

        // 创建头像
        const avatar = document.createElement('img');
        avatar.src = '/upload/' + comment.avatar;
        avatar.style.width = '50px';
        avatar.style.height = '50px';
        avatar.style.borderRadius = '25px';
        avatar.style.marginRight = '10px';
        avatar.style.cursor = 'pointer';
        avatar.onclick = function() {
            toggleDisplay(userss);
        };
        commentTopDiv.appendChild(avatar);

// 昵称
        const nicknameSpan = document.createElement('span');
        nicknameSpan.textContent = comment.nickname + ' :';
        nicknameSpan.style.color = 'blue';
        nicknameSpan.style.marginRight = '10px';
        nicknameSpan.style.cursor = 'pointer';
        nicknameSpan.onclick = function() {
            toggleDisplay(userss);
        };
        commentTopDiv.appendChild(nicknameSpan);

        const commentText = document.createElement('span');
        commentText.innerHTML = comment.content;
        commentText.style.display = 'flex';
        commentTopDiv.appendChild(commentText);

        commentDiv.appendChild(commentTopDiv);

        const timeSpan = document.createElement('span');
        timeSpan.textContent = convertDateFormat(comment.commentTime);
        timeSpan.style.marginTop = '5px';
        timeSpan.style.fontSize = '0.8em';
        commentDiv.appendChild(timeSpan);

        // 设置评论的ID、父评论ID和顶级评论ID
        commentDiv.setAttribute('data-comment-id', comment.id);
        if (comment.parentId !== undefined && comment.parentId !== null) {
            commentDiv.setAttribute('data-parent-id', comment.parentId);
        }
        if (comment.topLevelCommentId !== undefined && comment.topLevelCommentId !== null) {
            commentDiv.setAttribute('data-top-level-comment-id', comment.topLevelCommentId);
        }

        if (comment.parentId) {
            const parentCommentData = commentLookup[comment.parentId];
            console.log(parentCommentData)
            const replyToDiv = createReplyToContent(parentCommentData.username, parentCommentData.content);
            commentDiv.insertBefore(replyToDiv, timeSpan);
        }

        // 为每个评论添加回复功能
        const replyLink = document.createElement('a');
        replyLink.innerHTML = '回复';
        replyLink.href = '#';
        replyLink.style.marginLeft = 'auto';
        commentTopDiv.appendChild(replyLink);

        replyLink.onclick = function(e) {
            e.preventDefault();

            const commentId = commentDiv.getAttribute('data-comment-id');
            const topLevelCommentId = commentDiv.getAttribute('data-top-level-comment-id') || commentId;

            commentInput.setAttribute('data-parent-id', commentId);
            commentInput.setAttribute('data-top-level-comment-id', topLevelCommentId);

            showReplyInput(commentDiv, comment.content, comment.nickname);
        };

        if (commentsList.firstChild) {
            commentsList.insertBefore(commentDiv, commentsList.firstChild);
        } else {
            commentsList.appendChild(commentDiv);
        }
    }



    dynamicList.appendChild(commentsList);


    submitButton.onclick = function() {
        const commentDiv = document.createElement('div');
        commentDiv.style.display = 'flex';
        commentDiv.style.flexDirection = 'column';  // 垂直排列
        commentDiv.style.padding = '10px 0';  // 上下边距，使评论有区分度
        commentDiv.style.borderBottom = '1px solid gray';  // 为评论添加底边框



        const commentTopDiv = document.createElement('div');  // 用于包裹头像、昵称和评论内容
        commentTopDiv.style.display = 'flex';
        commentTopDiv.style.alignItems = 'center';  // 垂直居中对齐内容


        // 创建头像
        const avatar = document.createElement('img');
        avatar.src = '/upload/' + userss.avatar;
        avatar.style.width = '50px';
        avatar.style.height = '50px';
        avatar.style.borderRadius = '25px';
        avatar.style.marginRight = '10px';
        avatar.style.cursor = 'pointer';
        avatar.onclick = function() {
            toggleDisplay(userss);
        };
        commentTopDiv.appendChild(avatar);

// 昵称
        const nicknameSpan = document.createElement('span');
        nicknameSpan.textContent = userss.nickname + ' :';
        nicknameSpan.style.color = 'blue';
        nicknameSpan.style.marginRight = '10px';
        nicknameSpan.style.cursor = 'pointer';
        nicknameSpan.onclick = function() {
            toggleDisplay(userss);
        };
        commentTopDiv.appendChild(nicknameSpan);


        // 评论内容
        const commentText = document.createElement('span');
        commentText.innerHTML = filter.filter(commentInput.innerHTML);
        commentText.style.display = 'flex';
        commentTopDiv.appendChild(commentText);

        commentDiv.appendChild(commentTopDiv);

        // 评论时间
        const timeSpan = document.createElement('span');
        timeSpan.textContent = new Date().toLocaleString();
        timeSpan.style.marginTop = '5px';  // 时间与上面内容的间距
        timeSpan.style.fontSize = '0.8em';
        commentDiv.appendChild(timeSpan);
        // 添加回复链接到评论
        const replyLink = document.createElement('a');
        replyLink.innerHTML = '回复';
        replyLink.href = '#';
        replyLink.style.marginLeft = 'auto'; // 自动填充左侧

        commentTopDiv.appendChild(replyLink);

        replyLink.onclick = function(e) {
            e.preventDefault();

            const commentId = commentDiv.getAttribute('data-comment-id'); // 获取当前评论的ID
            const topLevelCommentId = commentDiv.getAttribute('data-top-level-comment-id') || commentId; // 获取顶级评论ID，如果不存在则使用当前评论ID

            commentInput.setAttribute('data-parent-id', commentId); // 设置被回复的评论ID
            commentInput.setAttribute('data-top-level-comment-id', topLevelCommentId); // 设置顶级评论ID

            showReplyInput(commentDiv, commentText.innerHTML, userss.nickname);
        };




        const isReply = commentInput.hasAttribute('data-reply-to'); // 检查是否有data-parent-id属性来判断是否为回复

        let parentId = null;
        let topLevelCommentId = null;

        if (isReply) {
            replyToNickname = commentInput.getAttribute('data-reply-to');
            replyToContent = commentInput.getAttribute('data-reply-content');

            parentId = parseInt(commentInput.getAttribute('data-parent-id')); // 获取父评论ID
            topLevelCommentId = parseInt(commentInput.getAttribute('data-top-level-comment-id')) || parentId; // 如果存在顶级评论ID就取，否则取父评论ID（即回复的是顶级评论）

            // 清除回复相关属性
            commentInput.removeAttribute('data-reply-to');
            commentInput.removeAttribute('data-reply-content');

            commentInput.placeholder = "请输入您的评论...";  // 这里设置为默认占位符
            const replyToDiv = createReplyToContent(replyToNickname, replyToContent);
            commentDiv.insertBefore(replyToDiv, timeSpan);  // 在时间前插入回复内容
        }



        // 评论内容构建
        const commentData = {
            user_id: userss.id,  // 发送者ID
            user_posts_id: post_id, // 动态ID
            content: filter.filter(commentInput.innerHTML), // 评论内容
            comment_time: new Date().toISOString(), // 评论时间
            parent_id: parentId,
            top_level_comment_id: topLevelCommentId,
        };

        console.log(commentData)

        axios.post('/Music1_0_war/Likes/comments', commentData, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then(response => {
            console.log(response.data)
            if (response.data.success) {
                console.log("评论保存成功！");

                const currentCount = parseInt(commentCountSpan.textContent.match(/\d+/)[0]);
                console.log(currentCount)
                const newCount = currentCount + 1;
                commentCountSpan.textContent = `(${newCount})`;

                const newCommentId = response.data.comment_id;
                commentDiv.setAttribute('data-comment-id', newCommentId); // 保存评论ID

                const parentId = response.data.parent_id; // 如果存在的话
                const topLevelCommentId = response.data.top_level_comment_id; // 如果存在的话

                if (parentId !== undefined && parentId !== null) {
                    commentDiv.setAttribute('data-parent-id', parentId); // 设置父评论ID
                }
                if (topLevelCommentId !== undefined && topLevelCommentId !== null) {
                    commentDiv.setAttribute('data-top-level-comment-id', topLevelCommentId); // 设置顶级评论ID
                }


            } else {
                console.error("保存评论失败：", response.data.message);
            }
        }).catch(error => {
                console.error("保存评论时出错：", error);
            });

                if (commentsList.firstChild) {
                    commentsList.insertBefore(commentDiv, commentsList.firstChild);
                } else {
                    commentsList.appendChild(commentDiv);
                }
        commentInput.innerHTML = '';  // 清空输入框

        commentInputContainer.style.display = 'none'; // 提交评论后隐藏输入框
    };



    commentLink.onclick = function(e) {
        e.preventDefault();
        if (commentInputContainer.style.display === 'none') {
            commentInputContainer.style.display = 'block'; // 显示输入框
            commentsList.style.display  = 'block';
        } else {
            commentInputContainer.style.display = 'none'; // 隐藏输入框
            commentsList.style.display  = 'none';
        }
    };



    commentContainer.appendChild(commentLink);
    commentContainer.appendChild(commentCountSpan);
    dynamicItem.appendChild(commentContainer);
    dynamicList.appendChild(dynamicItem);

    console.log('11user.id',user.id)
    console.log('11currentUserId',currentUserId)
    if(user.id == currentUserId){
        const deleteLink = document.createElement('a');
        deleteLink.href = '#';
       /* deleteLink.textContent = '删除';*/
        deleteLink.className = "fa fa-trash"
        /*deleteLink.style.position = 'absolute';  // 设置为绝对位置以放置在右下角*/
        deleteLink.style.marginLeft = '20px';
        deleteLink.style.bottom = '10px';
        deleteLink.style.right = '10px';
        deleteLink.style.textDecoration = 'none';  // 去掉下划线
/*        deleteLink.style.backgroundColor = 'gray';*/
        deleteLink.style.padding = '5px';
        deleteLink.style.borderRadius = '5px';  // 圆角
        deleteLink.style.border = 'none';  // 无边框
        deleteLink.onclick = function(e) {
            e.preventDefault();
            console.log('post_id',post_id)
            axios({
                method: "post",
                url: "/Music1_0_war/search/deletePosts",
                headers: {
                    'Content-Type': 'multipart/form-data;charset=UTF-8'
                },
                data: { post_id: post_id }  // 发送post_id作为请求的数据
            }).then(function (response) {
                dynamicList.removeChild(dynamicItem);
            }).catch(function (error) {
                console.error("Error deleting post:", error);
            });
        };

        dynamicItem.appendChild(deleteLink);
        dynamicItem.style.position = 'relative';  // 为了使删除链接的绝对位置相对于它
    }

    dynamicItem.appendChild(commentInputContainer);  // 确保添加到dynamicItem的最下方
    dynamicItem.appendChild(commentsList);
    // 将新的动态元素添加到列表中
    dynamicList.appendChild(dynamicItem);
}

class DFAFilter {
    constructor() {
        this.root = {};
    }

    // 添加敏感词到DFA
    addWord(word) {
        let node = this.root;
        for (let char of word) {
            if (!node[char]) {
                node[char] = {};
            }
            node = node[char];
        }
        node.isEnd = true;
    }

    // 检测文本并替换敏感词
    filter(text) {
        let i = 0;
        while (i < text.length) {
            let node = this.root;
            let j = i;

            // 深入DFA结构进行匹配
            while (j < text.length && node[text[j]]) {
                node = node[text[j]];
                j++;
            }

            if (node.isEnd) {
                // 找到敏感词，进行替换
                text = text.substring(0, i) + '*'.repeat(j - i) + text.substring(j);
                i = j;  // 跳过检测到的敏感词
            } else {
                i++;
            }
        }
        return text;
    }
}

// 使用示例
let filter = new DFAFilter();

function convertDateFormat(inputTime) {
    let sendTime = new Date(inputTime);

    let year = sendTime.getFullYear();
    let month = sendTime.getMonth() + 1;  // getMonth返回的月份是从0开始的
    let date = sendTime.getDate();
    let hours = sendTime.getHours();
    let minutes = sendTime.getMinutes();
    let seconds = sendTime.getSeconds();

    return `${year}/${month}/${date} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/****上传音乐***/
document.getElementById('Uploaded-music').addEventListener('click', function(event) {
    event.preventDefault();
// 获取音频标签下拉选框元素
    const tagSelect = document.getElementById('tagSelect');

// 使用Axios获取所有的标签并填充到下拉选框
    axios.get('/Music1_0_war/manage/gettags')
        .then(response => {
            const tags = response.data;

            // 清空原有的选项
            tagSelect.innerHTML = '';

            // 创建并添加选项到下拉选框
            for (const tag of tags) {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                tagSelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error("Error fetching tags:", error);
        });

    // 显示背景遮罩和上传面板
    document.getElementById('overlay').style.display = 'block';
    document.querySelector('.upload-panel').style.display = 'block';
});

document.getElementById('songFile').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        var fileName = file.name;
        var parts = fileName.split(' - '); // 使用 ' - ' 分割字符串

        if (parts.length >= 2) {
            var artistName = parts[0].trim();
            var songName = parts[1].split('.')[0].trim(); // 去除扩展名

            document.getElementById('artistName').value =songName;
            document.getElementById('songName').value = artistName ;
        }
    }
});

// 点击取消上传
document.getElementById('cancelUpload').addEventListener('click', function() {
    // 隐藏上传面板和背景遮罩
    document.querySelector('.upload-panel').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

// 获取所有的输入元素和文件输入元素
var songNameInput = document.getElementById('songName');
var artistNameInput = document.getElementById('artistName');
var songFileInput = document.getElementById('songFile');
var lyricFileInput = document.getElementById('lyricFile');
var avatarFileInput = document.getElementById('avatarFile');
// 获取音频标签下拉选框元素
var tagSelect = document.getElementById('tagSelect');

// 当用户点击上传按钮时触发此函数
document.getElementById('submit').addEventListener('click', function(event) {
    // 阻止默认的提交行为
    event.preventDefault();

    console.log("点击了吗")
    // 创建一个 FormData 对象
    var formData = new FormData();

    // 获取选中的标签值
    const selectedTag = tagSelect.value;

    // 将选中的标签值添加到 FormData 对象中
    formData.append('selectedTag', selectedTag);

    // 将输入的歌曲名、歌手名和用户ID添加到 FormData 对象中
    formData.append('songName', songNameInput.value);
    formData.append('artistName', artistNameInput.value);
    formData.append('user_id', currentUserId);

    // 将文件添加到 FormData 对象中
    formData.append('songFile', songFileInput.files[0]);
    formData.append('lyricFile', lyricFileInput.files[0]);
    formData.append('avatarFile', avatarFileInput.files[0]);




    // 使用axios发送formData到后端
    axios({
        method: "post",
        url: "/Music1_0_war/Uploadedmusic/Uploadedmusic",
        data: formData,
        headers: {"Content-Type": "multipart/form-data"},
    }).then(function (response) {
        console.log(response.data);
        // 这里处理服务器返回的响应，例如通知用户上传成功
        if(response.data.status==='上传成功') {
            alert(response.data.status);
            // 隐藏上传面板和背景遮罩
            document.querySelector('.upload-panel').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';

            const songInfo = response.data.songInfoJson;

            populateUploadedMusic(response.data.songInfoJson);
        }
        }).catch(function (error) {
        // 处理上传过程中的错误
        console.error("Error uploading:", error);
        alert('上传失败，请重试。');
    });
});

// 图片预览
document.getElementById('avatarFile').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var preview = document.getElementById('avatarPreview');
            preview.src = e.target.result;
            preview.style.display = '';
        };
        reader.readAsDataURL(file);
    }
});


function populateUploadedMusic(songInfo) {
    // 创建并设置音频元素
    let audio = new Audio("/upload/" + songInfo.filepath);
    audio.addEventListener('loadedmetadata', function () {
        let duration = audio.duration;
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60).toString().padStart(2, '0');

        // 使用提取的歌曲时长创建新的表格行并填充数据
        let newRow = document.createElement("tr");

        // 如果songInfo.status为"已通过"，为该行添加一个点击事件
        if (songInfo.status === "已通过") {
            newRow.onclick = function() {
                playSong(songInfo.id, songInfo.filepath, songInfo.name, songInfo.artist, songInfo.lyric, songInfo.avatar,songInfo.is_member_song);
            };
            newRow.style.cursor = "pointer"; // 更改鼠标样式为“指针”以指示它是可点击的
        }

        let nameCell = document.createElement("td");
        // 创建图像元素并设置属性
        let avatarImg = document.createElement("img");
        avatarImg.src = '/upload/' + songInfo.avatar;
        avatarImg.alt = 'Avatar for ' + songInfo.name;
        avatarImg.style.height = '50px';  // 示例高度，根据实际需求调整
        avatarImg.style.width = '50px';
        avatarImg.style.verticalAlign = 'middle';  // 使图像垂直居中

        // 创建span元素，用于显示歌曲名
        let nameSpan = document.createElement("span");
        nameSpan.innerText = songInfo.name;
        nameSpan.style.marginLeft = '10px';  // 添加一些间距

        // 将图像和span添加到td
        nameCell.appendChild(avatarImg);
        nameCell.appendChild(nameSpan);
        newRow.appendChild(nameCell);

        let artistCell = document.createElement("td");
        artistCell.innerText = songInfo.artist;
        newRow.appendChild(artistCell);

        let timeCell = document.createElement("td");
        timeCell.innerText = `${minutes}:${seconds}`;  // 使用计算出的分钟和秒钟
        newRow.appendChild(timeCell);

        let statusCell = document.createElement("td");
        statusCell.innerText = songInfo.status;
        newRow.appendChild(statusCell);

        document.getElementById('upload-music').appendChild(newRow);

        document.querySelector('.upload-panel').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    });

    // 加载音频文件的元数据
    audio.load();
}


/****审核****/
document.getElementById("music9").addEventListener("click", function() {
    // 隐藏所有的子div
    const children = document.querySelectorAll('.main-right > div');
    children.forEach(child => {
        child.style.display = 'none';
    });
    document.getElementById("1").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("2").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("3").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("4").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("5").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("6").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("8").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("9").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("11").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("10").style.display = "none"; // 显示歌曲审核列表
    document.getElementById("12").style.display = ""; // 显示歌曲审核列表
    music9.classList.toggle('active');
    music1.classList.remove('active');
    music4.classList.remove('active');
    music6.classList.remove('active');
    music3.classList.remove('active');
    music7.classList.remove('active');
    music2.classList.remove('active');
    music10.classList.remove('active');
});


document.addEventListener("DOMContentLoaded", function () {
    const songReviewButton = document.getElementById("songReviewButton");
    const imageReviewButton = document.getElementById("imageReviewButton");
    const songsReviewButton = document.getElementById("songsReviewButton");
    const artistReviewButton = document.getElementById("artistReviewButton");

    const songReviewList = document.getElementById("songReviewList");
    const songsReviewList = document.getElementById("songsReviewList");
    const artistReviewList = document.getElementById("artistReviewList");

    function resetTabs() {
        // 重置所有选项卡样式
        songReviewButton.classList.remove("active-tab");
        imageReviewButton.classList.remove("active-tab");
        songsReviewButton.classList.remove("active-tab");
        artistReviewButton.classList.remove("active-tab");
    }


        // 点击事件处理
        songReviewButton.addEventListener("click", function () {
            resetTabs();
            // 添加当前选项卡样式
            songReviewButton.classList.add("active-tab");
            const songsPerPage = 10; // 每页显示的歌曲数量
            let currentPage = 1; // 当前页码
            let totalPageCount; // 总页数
            let songsData; // 所有歌曲数据
            // 获取歌曲列表
            axios.get("/Music1_0_war/Uploadedmusic/getAllUploadedmusic")
                .then(response => {
                    const songs = response.data.songs;
                    console.log(songs)
                    let htmlContent = "";
                    let loadedCount = 0;

                    songs.forEach(song => {
                        let audio = new Audio("/upload/" + song.filepath);

                        audio.addEventListener('loadedmetadata', function() {
                            let duration = audio.duration;
                            let minutes = Math.floor(duration / 60);
                            let seconds = Math.floor(duration % 60).toString().padStart(2, '0');

                            htmlContent += `
                    <tr id="songRow_${song.id}" onclick="playSong('${song.id}', '${song.filepath}', '${song.name}', '${song.artist}', '${song.lyric}', '${song.avatar}', '${song.is_member_song}')" oncontextmenu="showContextMenu(event, '${song.id}'); return false;">
                        <td>
                            <img src="/upload/${song.avatar}" alt="Avatar" style="width: 50px; height: 50px; vertical-align: middle;">
                            <span style="vertical-align: middle;">${song.name}</span>
                        </td>
                        <td>${song.artist}</td>
                        <td>${minutes}:${seconds}</td>
                        <td>${song.status}</td>
                    </tr>
                `;
                            loadedCount++;

                            if(loadedCount === songs.length) {
                                document.getElementById("songReview-List").innerHTML = htmlContent;
                                document.getElementById("12").style.display = "block"; // 显示歌曲审核列表
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error("获取歌曲时出错:", error);
                });

            const songReviewList = document.getElementById("songReviewList");
            // 如果songReviewList当前是隐藏的，那么我们显示它；如果它是显示的，那么我们隐藏它。
            if (songReviewList.style.display === "none" || songReviewList.style.display === "") {
                songReviewList.style.display = "block";
            } else {
                songReviewList.style.display = "none";
            }

            songsReviewList.style.display = "none";
            artistReviewList.style.display = "none";
        });

    imageReviewButton.addEventListener("click", function () {
        resetTabs();
        // 添加当前选项卡样式
       imageReviewButton.classList.add("active-tab");
        // 在这里处理其他按钮的点击事件，类似地切换显示和隐藏
        songsReviewList.style.display = "none";
        artistReviewList.style.display = "none";
        songReviewList.style.display = "none";

    });

    songsReviewButton.addEventListener("click", function () {
        resetTabs();
        // 添加当前选项卡样式
        songsReviewButton.classList.add("active-tab");
        songsReviewList.style.display = "block";
/*        const children = document.querySelectorAll('.main-right > div');
        children.forEach(child => {
            child.style.display = 'none';
        });
        document.getElementById("12").style.display = ""; // 显示歌曲审核列表*/
        axios({
            method: "post",
            url: "/Music1_0_war/user/getAllSongsInfo",
            headers: { "Content-Type": "application/json" },
        }).then(function (response) {
            let data = response.data;
            console.log("所有歌曲信息data:", JSON.stringify(data, null, 2));
            allsongs= data;
        })
            .catch(function(error) {
                console.log('Error occurred: ', error);
            });

        let htmlContent = "";
        let loadedCount = 0;

        allsongs.forEach(song => {
            let audio = new Audio("/upload/" + song.filepath);

            audio.addEventListener('loadedmetadata', function() {
                let duration = audio.duration;
                let minutes = Math.floor(duration / 60);
                let seconds = Math.floor(duration % 60).toString().padStart(2, '0');
                console.log("是会员歌曲吗:"+JSON.stringify(song, null, 2));
                console.log(song.is_member_song)
                htmlContent += `
                <tr id="songRow_${song.id}" onclick="playSong(${song.id}, '${song.filepath}', '${song.name}', '${song.artist}', '${song.lyric}', '${song.avatar}', ${song.is_member_song})" oncontextmenu="showContextMenu1(event, '${song.id}'); return false;">
                    <td>
                        <img src="/upload/${song.avatar}" alt="Avatar" style="width: 50px; height: 50px; vertical-align: middle;">
                        <span style="vertical-align: middle;">${song.name}</span>
                    </td>
                    <td>${song.artist}</td>
                    <td>${minutes}:${seconds}</td>
                   <td><span style="color: ${song.is_member_song ? 'red' : 'black'}">${song.is_member_song ? '会员' : '普通'}</span></td>

                </tr>
            `;

                loadedCount++;
                document.getElementById("songsReview-List").innerHTML = htmlContent;
                document.getElementById("12").style.display = "block"; // 显示歌曲审核列表
/*                if(loadedCount === allsongs.length) {

                }*/
            });
        });
        songReviewList.style.display = "none";
        artistReviewList.style.display = "none";
    });

    artistReviewButton.addEventListener("click", function () {

        // 设置跳转的 URL
        const url = "/Music1_0_war/handle_authentication_records.html";

        // 在新窗口中打开页面
        window.open(url, "_blank");
    });

});

function showContextMenu1(event, songId) {
    // 隐藏现有的右键菜单
    contextMenu.style.display = 'none';
    event.preventDefault();

    // 根据鼠标位置设置右键菜单的位置
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.display = 'block';

    // 确保右键菜单的操作是针对正确的 songId
    upgradeToMemberItem.onclick = () => upgradeToMember(songId);
    downgradeToNormalItem.onclick = () => downgradeToNormal(songId);

    // 当点击其他地方时隐藏右键菜单
    document.addEventListener('click', function hideMenu() {
        contextMenu.style.display = 'none';
        document.removeEventListener('click', hideMenu);
    });
}

// 创建右键菜单
let contextMenu = document.createElement('ul');
contextMenu.className = 'context-menu';

let upgradeToMemberItem = document.createElement('li');
upgradeToMemberItem.textContent = '升级为会员';

let downgradeToNormalItem = document.createElement('li');
downgradeToNormalItem.textContent = '降级为普通';

let deleteNormalItem = document.createElement('li');
deleteNormalItem.textContent = '删除歌曲';

contextMenu.appendChild(upgradeToMemberItem);
contextMenu.appendChild(downgradeToNormalItem);
contextMenu.appendChild(deleteNormalItem);
document.body.appendChild(contextMenu);

function upgradeToMember(songId) {
    // 实现升级为会员的逻辑
    console.log("已升级为会员:", songId);


    let formData = new FormData();
    formData.append('song_id', songId);
    axios({
        method: "post",
        url: "/Music1_0_war/user/Upgrades",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
    }).then(function (response) {

        if (response.data === "success") {
            // 更新显示
            let statusElement = document.getElementById(`status_${songId}`);
            if (statusElement) {
                statusElement.textContent = '会员';
                statusElement.style.color = 'red';
            }
        }
    })
        .catch(function (error) {
            console.error("操作出错:", error);

        });

}

function downgradeToNormal(songId) {
    // 实现降级为普通的逻辑
    console.log("已降级为普通:", songId);


    let formData = new FormData();
    formData.append('song_id', songId);
    axios({
        method: "post",
        url: "/Music1_0_war/user/TierDown",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
    }).then(function (response) {
        if (response.data === "success") {
            // 降级成功，更新界面
            let statusElement = document.getElementById(`status_${songId}`);
            if (statusElement) {
                statusElement.textContent = '普通';
                statusElement.style.color = 'black';
            }
        } else {

        }
    }).catch(function (error) {
        console.error("操作出错:", error);

    });
}


function showContextMenu(event, songId) {
    // 隐藏现有的右键菜单
    contextMenu1.style.display = 'none';
    event.preventDefault();

    console.log("处理的id：" + songId);
    // 根据鼠标位置设置右键菜单的位置
    contextMenu1.style.left = `${event.pageX}px`;
    contextMenu1.style.top = `${event.pageY}px`;
    contextMenu1.style.display = 'block';

    // 确保右键菜单的操作是针对正确的 songId
    rejectItem.onclick = () => rejectSong(songId);
    acceptItem.onclick = () => acceptSong(songId);

    // 当点击其他地方时隐藏右键菜单
    document.addEventListener('click', function hideMenu() {
        contextMenu1.style.display = 'none';
        document.removeEventListener('click', hideMenu);
    });
}

// 创建右键菜单
let contextMenu1 = document.createElement('ul');
contextMenu1.className = 'context-menu';

let rejectItem = document.createElement('li');
rejectItem.textContent = '拒绝';

let acceptItem = document.createElement('li');
acceptItem.textContent = '通过';

contextMenu1.appendChild(rejectItem);
contextMenu1.appendChild(acceptItem);
document.body.appendChild(contextMenu1);

function rejectSong(songId) {
    // 实现拒绝歌曲的逻辑
    console.log("已拒绝歌曲:", songId);
    // 删除对应的行
    let rowElement = document.getElementById(`songRow_${songId}`);
    if (rowElement) {
        rowElement.remove();
    }
}

function acceptSong(songId) {
    // 实现接受歌曲的逻辑
    console.log("已接受歌曲:", songId);
    // 使用 FormData 发送数据
    let formData = new FormData();
    formData.append('song_id', songId);

    axios({
        method: "post",
        url: "/Music1_0_war/Uploadedmusic/handlemusic",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
    })
        .then(function (response) {
            if (response.data.status === "success") {
                alert("歌曲已被接受！");
                // 这里可以添加其他的逻辑，例如重新加载页面或更新列表等
            } else {
                alert("操作失败，请稍后重试。");
            }
        })
        .catch(function (error) {
            console.error("操作出错:", error);
            alert("操作失败，请稍后重试。");
        });

    // 删除对应的行
    let rowElement = document.getElementById(`songRow_${songId}`);
    if (rowElement) {
        rowElement.remove();
    }
}


/***敏感词汇****/

/*
console.log(filter.filter("这是一个敏感词测试，禁止传播！"));*/
// 输出：这是一个***测试，**传播！

let wordsHashSet = new Set();
// 将所有敏感词汇添加到DFA



function loadWordsFromDb(){
    // 使用Axios获取所有的敏感词汇并更新到HashSet
    axios.get('/Music1_0_war/manage/getAllWords')
        .then(response => {
            console.log(response.data);
            wordsHashSet = new Set(response.data);
            wordsHashSet.forEach(word => filter.addWord(word));
            displayWords();
        })
        .catch(error => {
            console.error("Error fetching words:", error);
        });

// 添加新的敏感词到数据库，并同步到HashSet
}

function addWordToDb() {
    const wordInput = document.getElementById('newWord');
    const word = wordInput.value.trim();

    console.log(word)
    if (word && !wordsHashSet.has(word)) {
        axios.post('/Music1_0_war/manage/addWord', { word: word }, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then(response => {
                if (response.data.success) {
                    wordsHashSet.add(word);
                    displayWords();
                    wordInput.value = '';
                } else {
                    alert('添加失败！');
                }
            });
    } else {
        alert('请输入敏感词或确保词汇不存在！');
    }
}

// 从HashSet中查询敏感词
function searchWordInDb() {
    const searchInput = document.getElementById('searchWord');
    const word = searchInput.value.trim();

    if (word) {
        if (wordsHashSet.has(word)) {
            alert('该词汇存在！');
        } else {
            alert('该词汇不存在！');
        }
    } else {
        alert('请输入要查询的敏感词！');
    }
}

// 显示所有的敏感词汇
function displayWords() {
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';
    Array.from(wordsHashSet).forEach((word) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${word}</td>
            <td><button onclick="removeWordFromDb('${word}')">删除</button></td>
        `;
        wordList.appendChild(tr);
    });
}

// 从数据库中删除一个敏感词，并同步到HashSet
function removeWordFromDb(word) {

    console.log(word)
    axios.post('/Music1_0_war/manage/removeWord',  { word: word }, {
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    }).then(response => {
            if (response.data.success) {
                wordsHashSet.delete(word);
                displayWords();
            } else {
                alert('删除失败！');
            }
        });
}

// 初始加载时从数据库获取所有的敏感词汇
loadWordsFromDb();


function showSensitiveWords() {
    // 隐藏所有的子div
    const children = document.querySelectorAll('.main-right > div');
    children.forEach(child => {
        child.style.display = 'none';
    });

// 使用上面的函数来简化代码
    const removeActiveIds = ['music1', 'music2', 'music6', 'music3', 'music7', 'music9', 'music4'];
    const toggleActiveIds = ['music10'];

    modifyClass(removeActiveIds, 'remove');
    modifyClass(toggleActiveIds, 'toggle');
    // 显示id为13的div
    document.getElementById('13').style.display = 'block';
}

/****购买会员****/
function showPayment() {
    const container = document.getElementById("14");
    const backdrop = document.getElementById("modalBackdrop66");

    container.style.display = "block";
    backdrop.style.display = "block";
}

function simulatePayment(status) {
    let userId = userss.id;  // 这是你提到的购买者ID

    if(status === 'SUCCESS') {
        alert("支付成功！");
        console.log(userId)
        axios.post('/Music1_0_war/membership/buysuccess', { user_id: userId })
            .then(response => {
                console.log(response.data); //
                userss = response.data;
            })
            .catch(error => {
                console.error("出错了: ", error);
            });
    } else {
        alert("支付失败，请稍后再试。");
      /*  axios.post('/Music1_0_war/membership/buyfail', { user_id: userId })
            .catch(error => {
                console.error("出错了: ", error);
            });*/
    }
}

document.getElementById("modalBackdrop66").addEventListener('click', hidePayment);

function hidePayment() {
    const container = document.getElementById("14");
    const backdrop = document.getElementById("modalBackdrop66");

    container.style.display = "none";
    backdrop.style.display = "none";
}

/****成为歌手****/

document.addEventListener("DOMContentLoaded", function() {
    const music12 = document.getElementById("music12");

    music12.addEventListener("click", function() {


        const userInfoString = encodeURIComponent(JSON.stringify(userss));
        window.location.href = "authentication.html?user=" + userInfoString;
    });
});

const music15 = document.getElementById("music15");
const music16 = document.getElementById("music16");


music15.addEventListener("click", function () {
    // 设置跳转的 URL
    const url = "/Music1_0_war/LabelManagement.html";

    // 在新窗口中打开页面
    window.open(url, "_blank");
});

music16.addEventListener("click", function () {
    const userInfoString = encodeURIComponent(JSON.stringify(userss));
    // 设置跳转的 URL
    const url ="/Music1_0_war/manage.html?user=" + userInfoString;


    // 在新窗口中打开页面
    window.open(url, "_blank");
});
