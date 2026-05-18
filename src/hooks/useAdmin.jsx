// hooks/useAdmin.js
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isAdmin = false, isPending: isAdminLoading } = useQuery({
    queryKey: ["isAdmin", user?.email],
    // টোকেন চেকিং এখান থেকে সরিয়ে দিন, শুধুমাত্র ইউজার লোড হওয়া পর্যন্ত অপেক্ষা করুন
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/users/admin/${user.email}`);
        return res.data?.admin || false;
      } catch (error) {
        console.error("Admin check failed:", error);
        return false;
      }
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;