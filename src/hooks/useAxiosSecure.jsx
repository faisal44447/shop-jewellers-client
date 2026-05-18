import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: "https://shop-jewellers-server.vercel.app",
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth();

    useEffect(() => {
        // ১. রিকোয়েস্ট পাঠানোর সময় অটোমেটিক টোকেন যুক্ত করার ইন্টারসেপ্টর
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("access-token");
                if (token) {
                    config.headers.authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // ২. ব্যাকএন্ড থেকে ৪০১ বা ৪০৩ এরর আসলে অটো লগআউট করার ইন্টারসেপ্টor
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    localStorage.removeItem("access-token");
                    await logOut();
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );

        // ক্লিনআপ ফাংশন
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;