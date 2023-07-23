//在请求头中添加access token：
axios.interceptors.request.use(function (config) {
    var accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = 'Bearer ' + accessToken;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(undefined, function(error) {
    if (error.response.status === 401) {
        // 如果收到401响应，尝试使用refresh token获取新的access token
        return axios.post('/Music1_0_war/refreshToken', {}, {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('refreshToken')
            }
        }).then(function(response) {
            // 如果成功获取新的access token和，更新sessionStorage并重试原来的请求
            sessionStorage.setItem('accessToken', response.data.accessToken);
            sessionStorage.setItem('refreshToken', response.data.refreshToken);
            error.config.headers.Authorization = 'Bearer ' + response.data.accessToken;
            return axios(error.config);
        }).catch(function(error) {
            // 如果无法获取新的access token，清除sessionStorage并重定向到登录页面
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            window.location.href = 'login.html';
            return Promise.reject(error);
        });
    }
    return Promise.reject(error);
});


var isRefreshing = false;
var failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axios.interceptors.response.use(undefined, function(error) {
    if (error.response.status === 401 && error.config.url === '/Music1_0_war/refreshToken') {
        // 如果refresh token也过期，清除sessionStorage并重定向到登录页面
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = 'login.html';
        return Promise.reject(error);
    } else if (error.response.status === 401 && !isRefreshing) {
        isRefreshing = true;
        return new Promise(function(resolve, reject) {
            axios.post('/Music1_0_war/refreshToken', {}, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('refreshToken')
                }
            }).then(function(response) {
                sessionStorage.setItem('accessToken', response.data.accessToken);
                error.config.headers.Authorization = 'Bearer ' + response.data.accessToken;
                processQueue(null, response.data.accessToken);
                resolve(axios(error.config));
            }).catch(function(error) {
                processQueue(error, null);
                reject(error);
            }).then(function() {
                isRefreshing = false;
            });
        });
    } else if (error.response.status === 401 && isRefreshing) {
        return new Promise(function(resolve, reject) {
            failedQueue.push({resolve, reject});
        }).then(token => {
            error.config.headers.Authorization = 'Bearer ' + token;
            return axios(error.config);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
    return Promise.reject(error);
});
