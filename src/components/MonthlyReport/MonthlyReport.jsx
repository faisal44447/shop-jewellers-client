import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MonthlyReport = () => {
    const axiosSecure = useAxiosSecure();
    const token = localStorage.getItem("access-token");

    const { data: reportData = {}, isLoading, isError } = useQuery({
        queryKey: ["monthlyReport"],
        queryFn: async () => {
            const res = await axiosSecure.get("/report/monthly");
            return res.data;
        },
        // 🎯 ফিক্স: লোকাল স্টোরেজে ভ্যালিড টোকেন না আসা পর্যন্ত এই এপিআই রিকোয়েস্ট পাঠাবে না
        enabled: !!token,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-6 w-full">
                <span className="loading loading-dots loading-md text-orange-500"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-red-500 text-center p-5 font-medium w-full">
                ❌ Monthly Report লোড করা যায়নি। (টোকেন বা সার্ভার চেক করুন)
            </div>
        );
    }

    // ব্যাকএন্ড থেকে আসা ডেটা (ফাঁকা হলে ডিফল্ট ০)
    const totalMonthlySales = reportData?.totalMonthlySales || 0;
    const totalMonthlyExpenses = reportData?.totalMonthlyExpenses || 0;
    const totalMonthlySalary = reportData?.totalMonthlySalary || 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full">
            <h2 className="text-gray-700 font-bold mb-4 text-sm uppercase tracking-wide border-b pb-2 text-center sm:text-left">
                Monthly Report Sheet 📊
            </h2>

            <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-100">
                    <span className="text-sm font-medium text-green-700">This Month Sales:</span>
                    <span className="font-bold text-green-700">৳{totalMonthlySales.toLocaleString("en-BD")}</span>
                </div>

                <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100">
                    <span className="text-sm font-medium text-red-700">This Month Expenses:</span>
                    <span className="font-bold text-red-700">৳{totalMonthlyExpenses.toLocaleString("en-BD")}</span>
                </div>

                <div className="flex justify-between items-center bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <span className="text-sm font-medium text-orange-700">This Month Staff Salary:</span>
                    <span className="font-bold text-orange-700">৳{totalMonthlySalary.toLocaleString("en-BD")}</span>
                </div>
            </div>
        </div>
    );
};

export default MonthlyReport;