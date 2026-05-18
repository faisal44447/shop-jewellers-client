import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: isAdmin = false,
    isPending: isAdminLoading,
  } = useQuery({
    // প্রফেশনাল স্ট্রাকচার: মূল স্ট্রিং আগে, ভ্যারিয়েবল পরে
    queryKey: ["isAdmin", user?.email],

    // লোডিং শেষ, ইমেল আছে এবং লোকাল স্টোরেজে টোকেন থাকলেই কেবল কুয়েরি চলবে
    enabled: !loading && !!user?.email && !!localStorage.getItem("access-token"),

    queryFn: async () => {
      const res = await axiosSecure.get(`/users/admin/${user.email}`);
      return res.data?.admin || false; // res.data না থাকলেও ক্র্যাশ করবে না, false রিটার্ন করবে
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;