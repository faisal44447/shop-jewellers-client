import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MonthlyReport = () => {
    const axiosSecure = useAxiosSecure();
    const token = localStorage.getItem("access-token");

    const { data: reportData = [], isLoading, isError } = useQuery({
        queryKey: ["monthlyReport"],
        queryFn: async () => {
            const res = await axiosSecure.get("/report/monthly");
            return res.data;
        },
        // 🎯 ফিক্স: লোকাল স্টোরেজে ভ্যালিড টোকেন না আসা পর্যন্ত এই এপিআই রিকোয়েস্ট পাঠাবে না
        enabled: !!token,
    });

    if (isLoading) return <div className="text-center p-5"><span className="loading loading-dots loading-md"></span></div>;
    if (isError) return <div className="text-red-500 text-center p-5">❌ Failed to load Monthly Report.</div>;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm w-full">
            <h2 className="text-gray-700 font-bold mb-4 text-sm uppercase tracking-wide">Monthly Report Sheet</h2>
            <div className="overflow-x-auto w-full">
                {/* আপনার মান্থলি রিপোর্টের টেবিল বা ডিজাইন কোড এখানে থাকবে */}
                <p className="text-sm text-gray-500">Report content loaded successfully.</p>
            </div>
        </div>
    );
};

export default MonthlyReport;