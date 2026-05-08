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

    // ================= FETCH MONTHLY REPORT =================
    const {
        data: reports = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["monthly-report"],
        queryFn: async () => {
            const res = await axiosSecure.get("/report/monthly");

            return Array.isArray(res.data)
                ? res.data
                : [];
        },
    });

    // ================= LOADING =================
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-72 bg-white rounded-2xl shadow-md">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    // ================= ERROR =================
    if (isError) {
        return (
            <div className="flex justify-center items-center h-72 bg-white rounded-2xl shadow-md">
                <p className="text-red-500 text-lg font-semibold">
                    ❌ Failed to load monthly report
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-5 h-[400px]">

            {/* TITLE */}
            <div className="mb-5">

                <h2 className="text-2xl font-bold text-orange-500">
                    📊 Monthly Revenue & Expense Report
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                    Track monthly revenue and expense analytics
                </p>

            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height="85%">

                <BarChart
                    data={reports}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 5,
                    }}
                >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    {/* REVENUE */}
                    <Bar
                        dataKey="revenue"
                        fill="#22c55e"
                        radius={[6, 6, 0, 0]}
                    />

                    {/* EXPENSE */}
                    <Bar
                        dataKey="expense"
                        fill="#ef4444"
                        radius={[6, 6, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
};

export default MonthlyReport;