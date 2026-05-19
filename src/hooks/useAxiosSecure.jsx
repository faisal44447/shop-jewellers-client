import axios from "axios";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const baseURL = "https://shop-jewellers-server.vercel.app";

const useAxiosSecure = () => {
    const navigate = useNavigate();
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

                // ৪০১ বা ৪০৩ এরর পেলে সোজাসুজি লগআউট করাবে
                if (status === 401 || status === 403) {
                    localStorage.removeItem("access-token");
                    await logOut();
                    navigate("/login", { replace: true });
                }
                return Promise.reject(error);
            }
        );

        // CLEANUP
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [axiosSecure, logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;