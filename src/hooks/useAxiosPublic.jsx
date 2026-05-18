import axios from "axios";

const axiosPublic = axios.create({
  // আপনার Vercel ব্যাকএন্ড ইউআরএল
  baseURL: "https://shop-jewellers-server.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;