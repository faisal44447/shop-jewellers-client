import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

import useAxiosSecure from "../../hooks/useAxiosSecure";

const MonthlyReport = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: reports = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["monthly-report"],
        queryFn: async () => {
            const res = await axiosSecure.get("/report/monthly");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    console.log("MONTHLY REPORT:", reports);

    const safeReports = reports.map((item) => ({
        month: item.month,
        revenue: item.revenue || 0,
        expense: item.expense || 0,
    }));

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-md h-[400px] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white rounded-2xl shadow-md h-[400px] flex items-center justify-center">
                <p className="text-red-500 font-semibold">
                    ❌ Failed to load monthly report
                </p>
            </div>
        );
    }

    if (!safeReports.length) {
        return (
            <div className="bg-white rounded-2xl shadow-md h-[400px] flex items-center justify-center">
                <p className="text-gray-500">
                    No monthly data found
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">

            <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-orange-500">
                    📊 Monthly Report
                </h2>
                <p className="text-gray-500 text-sm">
                    Revenue vs Expense overview
                </p>
            </div>

            <div className="w-full h-[350px]">

                <ResponsiveContainer width="99%" height="100%">

                    <BarChart data={safeReports}>

                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                        <XAxis dataKey="month" />

                        <YAxis width={50} />

                        <Tooltip />

                        <Legend />

                        <Bar dataKey="revenue" fill="#22c55e" />
                        <Bar dataKey="expense" fill="#ef4444" />

                    </BarChart>

                </ResponsiveContainer>

            </div>
        </div>
    );
};

export default MonthlyReport;