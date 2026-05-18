import axios from "axios";
import { useEffect, useMemo } from "react"; // 👈 এখানে useMemo ইমপোর্ট করা হয়েছে
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const baseURL = "https://shop-jewellers-server.vercel.app";

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth();

    // 👑 useMemo ব্যবহার করার ফলে axiosSecure ইনস্ট্যান্সটি বারবার তৈরি হবে না, মেমোরিতে ফিক্সড থাকবে।
    const axiosSecure = useMemo(() => {
        return axios.create({
            baseURL: baseURL,
        });
    }, []); // 👈 খালি অ্যারে মানে এটি অ্যাপে মাত্র একবারই তৈরি হবে

    useEffect(() => {
        // ১. রিকোয়েস্ট ইন্টারসেপ্টর: প্রতি রিকোয়েস্টে কারেন্ট টোকেন পুশ করবে
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

        // ২. রেসপন্স ইন্টারসেপ্টর: ৪০১ বা ৪০৩ এরর আসলে অটো লগআউট
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

        // ক্লিনআপ ফাংশন: ইন্টারসেপ্টর রিমুভ করা
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut, navigate, axiosSecure]); // 👈 এখন আর কোনো ইনফিনিট লুপের চান্স নেই

    return axiosSecure;
};

export default useAxiosSecure;