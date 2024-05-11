import axios from "axios";
import router from "@/router";


axios.defaults.timeout = 8000;
axios.defaults.baseURL = 'http://localhost:8082';


const http = axios.create();

// 请求拦截器
// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在这里添加你的代码，例如设置token等
    if (!config.url.includes('/user/login')||!config.url.includes('/user/register')) {
        // 对请求进行处理，例如添加token等
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    }
    return config;
}, function (error) {
    // 对请求错误进行处理
    return Promise.reject(error);
});

// 响应拦截器
http.interceptors.response.use(
    response => {
        if (response.data.code === 400) {
            router.replace('/');
            console.log('token 过期');
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);
export default http;
