import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAdmin from "../../../hooks/useAdmin";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import UserProducts from "../../../components/UserProducts/UserProducts";
import MonthlyReport from "../../../components/MonthlyReport/MonthlyReport";

const UserHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAdmin, isAdminLoading] = useAdmin();

    // ================= ADMIN STATS =================
    const { data: stats = {}, isLoading: statsLoading, isError } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard");
            return res.data;
        },
        enabled: isAdmin,
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

    const colors = ["#22c55e", "#ef4444", "#3b82f6", "#facc15"];

    const pieChartData = [
        { name: "Revenue", value: stats.totalSales || 0 },
        { name: "Expense", value: stats.totalExpense || 0 },
        { name: "Profit", value: stats.totalProfit || 0 },
        { name: "Stock", value: stats.totalStock || 0 },
    ];

    // ================= LOADING =================
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

    // ================= USER VIEW =================
    if (!isAdmin) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md border">

                {/* PROFILE */}
                <div className="flex items-center gap-4">

                    {user?.photoURL && (
                        <div className="avatar">
                            <div className="w-16 rounded-full ring ring-orange-400 ring-offset-2">
                                <img src={user.photoURL} />
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-3xl font-bold">
                            Hi, Welcome{" "}
                            <span className="text-orange-500">
                                {user?.displayName || "Back"}
                            </span>
                        </h2>

                        <p className="text-gray-500">
                            Manage your orders and profile
                        </p>
                    </div>
                </div>

                {/* USER CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

                    <div className="bg-orange-100 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-orange-600">
                            User Profile
                        </h3>
                        <p>{user?.email}</p>
                    </div>

                    <div className="bg-blue-100 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-blue-600">
                            Account Status
                        </h3>
                        <p>Active User</p>
                    </div>

                    <div className="bg-green-100 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-green-600">
                            Orders
                        </h3>
                        <p>Your orders will appear here</p>
                    </div>

                </div>

                {/* USER PRODUCTS */}
                <div className="mt-10">
                    <UserProducts />
                </div>

            </div>
        );
    }

    // ================= ADMIN DASHBOARD =================
    return (
        <div className="p-5">

            {/* PROFILE */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={
                        user?.photoURL ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    className="w-16 h-16 rounded-full border"
                    alt="user"
                />

                <h2 className="text-2xl md:text-3xl font-bold">
                    Welcome Admin 👑
                </h2>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-10">

                <div className="bg-white p-5 rounded-xl shadow border-l-4 border-purple-500">
                    💵 Total Cash <br />

                    <span className="text-2xl font-bold">
                        ৳{stats.totalCash || 0}
                    </span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500">
                    💰 Revenue <br />

                    <span className="text-2xl font-bold">
                        ৳{stats.totalSales || 0}
                    </span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow border-l-4 border-red-500">
                    💸 Expense <br />

                    <span className="text-2xl font-bold">
                        ৳{stats.totalExpense || 0}
                    </span>
                </div>

                <div className="bg-white p-5 rounded-xl shadow border-l-4 border-yellow-500">
                    📈 Profit <br />

                    <span className="text-2xl font-bold">
                        ৳{stats.totalProfit || 0}
                    </span>
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

            {/* MONTHLY REPORT */}
            <div className="mt-10">
                <MonthlyReport />
            </div>

        </div >
    );
};

export default UserHome;