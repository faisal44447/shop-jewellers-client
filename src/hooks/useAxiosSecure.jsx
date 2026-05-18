import axios from "axios";
import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 👈 useLocation যোগ করা হয়েছে
import useAuth from "./useAuth";

const baseURL = "https://shop-jewellers-server.vercel.app";

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 👈 বর্তমান পেজের পাথ জানার জন্য
    const { logOut } = useAuth();

    const axiosSecure = useMemo(() => {
        return axios.create({
            baseURL,
        });
    }, []);

    useEffect(() => {
        // REQUEST INTERCEPTOR
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("access-token");
                if (token) {
                    config.headers.authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // RESPONSE INTERCEPTOR
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response?.status;
                const token = localStorage.getItem("access-token");

                // 🎯 ফিক্স: শুধু তখনই লগআউট করবে যদি টোকেন এক্সপায়ার হয়ে যায় 
                // এবং ইউজার অলরেডি লগইন বা সাইনআপ পেজে না থাকে।
                if ((status === 401 || status === 403) && token) {
                    if (location.pathname !== "/login" && location.pathname !== "/signup") {
                        localStorage.removeItem("access-token");
                        await logOut();
                        navigate("/login");
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [axiosSecure, logOut, navigate, location.pathname]); // 👈 ডিপেন্ডেন্সিতে location.pathname দেওয়া হয়েছে

    return axiosSecure;
};

export default useAxiosSecure;