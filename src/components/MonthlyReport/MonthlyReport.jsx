import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MonthlyReport = () => {
    const axiosSecure = useAxiosSecure();

    const { data: reports = [], isLoading, isError } = useQuery({
        queryKey: ["monthly-report"],
        queryFn: async () => {
            const res = await axiosSecure.get("/report/monthly");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    const safeReports = reports.map((item) => ({
        month: item.month,
        revenue: item.revenue || 0,
        expense: item.expense || 0,
    }));

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center">
                <p className="text-red-500 font-semibold"> ❌ Failed to load monthly report </p>
            </div>
        );
    }

    if (!safeReports.length) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center">
                <p className="text-gray-500"> No monthly data found </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[400px]">
            <div className="mb-4">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide"> 📊 Monthly Report </h2>
                <p className="text-gray-400 text-xs mt-0.5"> Revenue vs Expense overview </p>
            </div>
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={safeReports}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                        <YAxis width={60} stroke="#9ca3af" fontSize={12} formatter={(v) => `৳${v}`} />
                        <Tooltip formatter={(value) => `৳${value.toLocaleString("en-BD")}`} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyReport;