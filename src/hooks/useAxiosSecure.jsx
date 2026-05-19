import axios from "axios";
import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

const baseURL = "https://shop-jewellers-server.vercel.app";

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

                // 🎯 ফিক্স: ৪০১ বা ৪০৩ এরর পাওয়া মানেই টোকেন ইনভ্যালিড বা নেই। 
                // ইউজার যদি লগইন/সাইনআপ পেজে না থাকে, তবে সোজাসুজি লগআউট করিয়ে লগইনে পাঠাবে।
                if (status === 401 || status === 403) {
                    if (location.pathname !== "/login" && location.pathname !== "/signup") {
                        localStorage.removeItem("access-token");
                        await logOut();
                        navigate("/login", { state: { from: location } });
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [axiosSecure, logOut, navigate, location]);

    return axiosSecure;
};

export default useAxiosSecure;