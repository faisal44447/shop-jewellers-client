import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: isAdmin = false, isLoading } = useQuery({
        queryKey: ["isAdmin", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
  try {
    const res = await axiosSecure.get(`/users/admin/${user.email}`);
    return res.data?.admin;
  } catch (err) {
    console.error(err);
    return false;
  }
        }
    });

    return [isAdmin, isLoading];
};

export default useAdmin;