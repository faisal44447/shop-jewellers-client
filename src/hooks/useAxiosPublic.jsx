import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://shop-jewellers-client.web.app", 
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;