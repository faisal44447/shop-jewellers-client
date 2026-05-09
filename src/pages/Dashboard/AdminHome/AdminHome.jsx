import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useAdmin from "../../../hooks/useAdmin";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import MonthlyReport from "../../../components/MonthlyReport/MonthlyReport";

const colors = ["#f59e0b", "#f97316", "#eab308", "#fb923c"];

const AdminHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAdmin, isAdminLoading] = useAdmin();

    const { data: stats = {}, isLoading, isError } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard", {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`,
                },
            });
            return res.data || {};
        },
    });

    const { data: products = [] } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    const pieChartData = [
        { name: "Revenue", value: stats?.totalSales || 0 },
        { name: "Expense", value: stats?.totalExpense || 0 },
        { name: "Profit", value: stats?.totalProfit || 0 },
        { name: "Stock", value: stats?.totalStock || 0 },
    ];

    if (isAdminLoading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center mt-20 text-red-500 font-bold">
                ❌ Failed to load dashboard data
            </div>
        );
    }

    return (
        <div className="p-5 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 mb-8">

                <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    className="w-16 h-16 rounded-full border-4 border-orange-400"
                />

                <div>
                    <h2 className="text-2xl font-bold text-orange-500">
                        Welcome Admin 👑
                    </h2>
                    <p className="text-gray-500">
                        Manage your jewellery shop dashboard easily
                    </p>
                </div>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

                <Card title="Total Cash" value={stats.totalCash} color="purple" />
                <Card title="Revenue" value={stats.totalSales} color="green" />
                <Card title="Expense" value={stats.totalExpense} color="red" />
                <Card title="Profit" value={stats.totalProfit} color="yellow" />

            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* BAR */}
                <div className="bg-white rounded-2xl p-5 h-[400px]">
                    <h2 className="text-orange-500 font-bold mb-3">
                        Product Analytics
                    </h2>

                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={products}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="buyPrice" fill="#f59e0b" />
                            <Bar dataKey="sellPrice" fill="#f97316" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* PIE (FIXED OVERFLOW) */}
                <div className="bg-white rounded-2xl p-5 h-[400px] flex flex-col">
                    <h2 className="text-orange-500 font-bold mb-3">
                        Financial Overview
                    </h2>

                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius="70%"
                                    label
                                >
                                    {pieChartData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={colors[i % colors.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* MONTHLY */}
            <div className="mt-10 bg-white rounded-2xl shadow-md p-5">
                <h2 className="text-2xl font-bold text-orange-500 mb-5">
                    📊 Monthly Report
                </h2>

                <MonthlyReport />
            </div>

        </div>
    );
};

// SMALL REUSABLE CARD
const Card = ({ title, value, color }) => (
    <div className={`bg-white rounded-2xl p-5 shadow border-l-4 border-${color}-500`}>
        <h3 className="text-gray-500">{title}</h3>
        <p className={`text-3xl font-bold text-${color}-600`}>
            ৳{value || 0}
        </p>
    </div>
);

export default AdminHome;