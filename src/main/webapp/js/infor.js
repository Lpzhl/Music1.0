window.onload = function() {
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
            document.querySelector('.user-name').textContent =  response.nickname;
            document.querySelector('.image img').src = "/upload/"+ response.data.avatar
            console.log(response);
        });

    };
};

document.getElementById('back').addEventListener('click', function() {
    window.location.href = 'home.html';
});


var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

document.getElementById('settings-link').addEventListener('click', function(event) {
    event.preventDefault();
    // 这里你可以添加AJAX代码来动态加载个人设置的内容
    modal.style.display = "block";
});

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
