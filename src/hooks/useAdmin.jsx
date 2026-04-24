import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        data: isAdmin = false,
        isLoading
    } = useQuery({
        queryKey: ['isAdmin', user?.email],
        enabled: !loading && !!user?.email, // ✅ FIXED
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/admin/${user.email}`);
            return res.data?.admin;
        }
    });

    return [isAdmin, isLoading];
};

export default useAdmin;