import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useCart = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: cart = [], refetch, isLoading } = useQuery({
        queryKey: ["cart", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts?email=${email}`);

            return res.data;
        },
    });

    return [cart, refetch, isLoading];
};

export default useCart; 