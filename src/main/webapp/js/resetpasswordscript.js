function validateInput(type, value) {
    var toastBody = document.querySelector('#myToast .toast-body');
    var myToast = document.getElementById('myToast');
    if (type === 'email') {
        var emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
        if (!emailPattern.test(value)) {
            toastBody.innerHTML = "<i class='fas fa-times-circle mr-2'></i>请提供有效的电子邮件地址";
            $(myToast).toast('show');
        }
    } else if (type === 'password') {
        var passwordPattern = /^[A-Za-z0-9]{8,}$/;  // 密码至少需要8个字符
        if (!passwordPattern.test(value)) {
            toastBody.innerHTML = "<i class='fas fa-times-circle mr-2'></i>密码必须至少8个字符";
            $(myToast).toast('show');
        }
    } else if (type === 'confirmPassword') {
        var password = document.getElementById("password").value;
        if (value !== password) {
            toastBody.innerHTML = "<i class='fas fa-times-circle mr-2'></i>密码不一致，请确认你的密码";
            $(myToast).toast('show');
        }
    }
}


var countdown = 60;

var savedEmail;

function settime() {
    var email = document.forms["resetForm"]["email"].value;
    var emailRe = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if (!emailRe.test(email)) {
        $('#myToast .toast-body').html("<i class='fas fa-times-circle mr-2'></i>邮箱号不规范");
        $('#myToast').toast('show');
        return;
    }
    var getCodeBtn = document.getElementById("getCodeBtn");
    if (countdown == 0) {
        getCodeBtn.removeAttribute("disabled");
        getCodeBtn.innerHTML = "获取验证码";
        countdown = 60;
        return;
    } else {
        if (countdown == 60) {
            axios.post('/Music1_0_war/sendCode', new URLSearchParams({email: email}))
                .then(function(response) {
                    var symbol = response.data.success === "正确" ? "<i class='fas fa-check-circle mr-2'></i>" : "<i class='fas fa-times-circle mr-2'></i>";
                    $('#myToast .toast-body').html(symbol + response.data.message);
                    $('#myToast').toast('show');
                    setTimeout(function () {
                        $('#myToast').toast('hide');
                    }, 3000);
                    savedEmail = email;
                })
                .catch(function(error) {
                    console.log(error);
                });
            getCodeBtn.setAttribute("disabled", true);
        }
        getCodeBtn.innerHTML = "(" + countdown + ")";
        countdown--;
        setTimeout(settime, 1000);
    }
}

function resetPassword() {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("text/html;charset=UTF-8");
    xhr.open("POST", "/Music1_0_war/validateCode", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var email = document.forms["resetForm"]["email"].value;
    if (email !== savedEmail) {
        $('#myToast .toast-body').html("<i class='fas fa-times-circle mr-2'></i>邮箱号和验证码不匹配");
        $('#myToast').toast('show');
        return false;
    }
    var code = document.forms["resetForm"]["verificationCode"].value;
    var password = document.forms["resetForm"]["password"].value;
    var confirmPassword = document.forms["resetForm"]["confirmPassword"].value;
    if (password !== confirmPassword) {
        $('#myToast .toast-body').html("<i class='fas fa-times-circle mr-2'></i>两次输入的密码不一致");
        $('#myToast').toast('show');
        return false;
    }
    xhr.send("code=" + code + "&email=" + email);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response.data)
            if (response.success === "true") {
                var data = new URLSearchParams();
                data.append('email', email);
                data.append('password', password);
                data.append('code', code);

                axios.post('/Music1_0_war/resetPassword', data)
                    .then(function(response) {
                        console.log(response.data)
                        var symbol = response.data.success == "true" ? "<i class='fas fa-check-circle mr-2'></i>" : "<i class='fas fa-times-circle mr-2'></i>";
                        $('#myToast .toast-body').html(symbol + response.data.message);
                        $('#myToast').toast('show');
                        setTimeout(function() {
                            console.log(response.data.message)
                            console.log(response.data.success)
                            if (response.data.success) {
                                window.location.href = 'login.html';
                            }
                        }, 2000);  // 延迟2秒跳转
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            } else {
                $('#myToast .toast-body').html("<i class='fas fa-times-circle mr-2'></i>" + response.message);
                $('#myToast').toast('show');
                return;
            }
        }
    }
    return false;
}

document.getElementById("resetForm").addEventListener("submit", function(event){
    event.preventDefault();
    resetPassword();
});
