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

const colors = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b"];

const AdminHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAdmin, isAdminLoading] = useAdmin();

    // ================= DASHBOARD =================
    const {
        data: stats = {},
        isLoading: statsLoading,
        isError,
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard", {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access-token")}`,
                },
            });
            return res.data;
        },
    });

    // ================= PRODUCTS =================
    const { data: products = [] } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");
            return res.data;
        },
    });

    const safeProducts = Array.isArray(products) ? products : [];

    const pieChartData = [
        { name: "Revenue", value: stats.totalSales || 0 },
        { name: "Expense", value: stats.totalExpense || 0 },
        { name: "Profit", value: stats.totalProfit || 0 },
        { name: "Stock", value: stats.totalStock || 0 },
    ];

    if (isAdminLoading || statsLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <p className="text-center text-red-500 mt-10">
                ❌ Failed to load dashboard data
            </p>
        );
    }

    return (
        <div className="p-5">

            {/* PROFILE */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={
                        isAdmin
                            ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            : user?.photoURL || "https://i.ibb.co/2n0Q5Yc/default-user.png"
                    }
                    className="w-16 h-16 rounded-full border"
                    alt="user"
                />

                <h2 className="text-2xl font-bold">
                    {isAdmin ? "Welcome Admin 👑" : `Welcome ${user?.displayName}`}
                </h2>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-10">

                <div className="bg-white p-5 rounded-xl shadow border-l-4 border-purple-500">
                    💵 Total Cash <br />
                    <span className="text-2xl font-bold">৳{stats.totalCash || 0}</span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500">
                    💰 Revenue <br />
                    <span className="text-2xl font-bold">৳{stats.totalSales || 0}</span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow border-l-4 border-red-500">
                    💸 Expense <br />
                    <span className="text-2xl font-bold">৳{stats.totalExpense || 0}</span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow border-l-4 border-yellow-500">
                    📈 Profit <br />
                    <span className="text-2xl font-bold">৳{stats.totalProfit || 0}</span>
                </div>

            </div>

            {/* CHARTS */}
            <div className="flex flex-col md:flex-row gap-10">

                {/* BAR */}
                <div className="w-full md:w-1/2 h-[320px] bg-white rounded-xl shadow p-3">
                    <ResponsiveContainer>
                        <BarChart data={safeProducts}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="buyPrice" fill="#22c55e" />
                            <Bar dataKey="sellPrice" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* PIE */}
                <div className="w-full md:w-1/2 h-[320px] bg-white rounded-xl shadow p-3">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={110}
                                label
                            >
                                {pieChartData.map((_, i) => (
                                    <Cell key={i} fill={colors[i % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>

            <div className="mt-10">
                <MonthlyReport />
            </div>

        </div>
    );
};

export default AdminHome;