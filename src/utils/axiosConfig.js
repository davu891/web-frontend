import axios from 'axios';

// Tạo một instance của Axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Đặt base URL cố định
    withCredentials: true, // Đảm bảo gửi cookie với các yêu cầu
});

// Thêm một interceptor để thêm token vào header của mỗi yêu cầu
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
