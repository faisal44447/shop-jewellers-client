import axios from "axios";

const axiosSecure = axios.create({
    baseURL: "https://shop-jewellers-server.vercel.app",
});

const useAxiosSecure = () => {

    // ✅ REQUEST INTERCEPTOR (TOKEN ADD)
    axiosSecure.interceptors.request.use(config => {
        const token = localStorage.getItem("access-token");
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    });

    // ✅ RESPONSE INTERCEPTOR (ERROR HANDLE)
    axiosSecure.interceptors.response.use(
        res => res,
        err => {
            console.error("API ERROR:", err);
            return Promise.reject(err);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;