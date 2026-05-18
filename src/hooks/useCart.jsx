import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useCart = () => {
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();

    const {
        data: cart = [],
        refetch,
        isLoading,
    } = useQuery({
        // স্ট্রাকচার ঠিক করা হলো
        queryKey: ["cart", user?.email],

        // টোকেন ছাড়া রিকোয়েস্ট ব্লক করা হলো যাতে ৪০১/৪০৩ এরর না আসে
        enabled: !loading && !!user?.email && !!localStorage.getItem("access-token"),

        queryFn: async () => {
            const res = await axiosSecure.get(`/carts?email=${user.email}`);
            return res.data;
        },
    });

    return [cart, refetch, isLoading];
};

export default useCart;