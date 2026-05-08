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

    // ================= DASHBOARD STATS =================
    const {
        data: stats = {},
        isLoading: statsLoading,
        isError,
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard");
            return res.data || {};
        },
        enabled: isAdmin,
    });

    // ================= PRODUCTS =================
    const {
        data: products = [],
        isLoading: productsLoading,
    } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    // ================= SAFE PRODUCTS =================
    const safeProducts = Array.isArray(products)
        ? products
        : [];

    // ================= PIE COLORS =================
    const colors = [
        "#22c55e",
        "#ef4444",
        "#3b82f6",
        "#facc15",
    ];

    // ================= PIE DATA =================
    const pieChartData = [
        {
            name: "Revenue",
            value: stats?.totalSales || 0,
        },
        {
            name: "Expense",
            value: stats?.totalExpense || 0,
        },
        {
            name: "Profit",
            value: stats?.totalProfit || 0,
        },
        {
            name: "Stock",
            value: stats?.totalStock || 0,
        },
    ];

    // ================= LOADING =================
    if (
        isAdminLoading ||
        statsLoading ||
        productsLoading
    ) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    // ================= ERROR =================
    if (isError) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold text-red-500">
                    ❌ Failed to load dashboard data
                </h2>
            </div>
        );
    }

    // ================= USER VIEW =================
    if (!isAdmin) {
        return (
            <div className="p-6 bg-gray-100 min-h-screen">

                {/* PROFILE SECTION */}
                <div className="bg-white rounded-2xl shadow-md p-6">

                    <div className="flex flex-col md:flex-row items-center gap-5">

                        {/* USER IMAGE */}
                        <div className="avatar">

                            <div className="w-24 rounded-full ring ring-orange-400 ring-offset-4">

                                <img
                                    src={
                                        user?.photoURL ||
                                        "https://i.ibb.co/2n0Q5Yc/default-user.png"
                                    }
                                    alt="user"
                                />

                            </div>

                        </div>

                        {/* USER INFO */}
                        <div>

                            <h2 className="text-3xl font-bold text-gray-800">
                                Hi, Welcome{" "}
                                <span className="text-orange-500">
                                    {user?.displayName || "Back"}
                                </span>
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Manage your account and products easily
                            </p>

                            <p className="text-sm text-gray-400 mt-2">
                                {user?.email}
                            </p>

                        </div>

                    </div>

                </div>

                {/* USER CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    {/* PROFILE CARD */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-orange-500">

                        <h3 className="text-xl font-bold text-orange-500 mb-2">
                            👤 User Profile
                        </h3>

                        <p className="text-gray-600">
                            {user?.displayName}
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                            {user?.email}
                        </p>

                    </div>

                    {/* STATUS CARD */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-blue-500">

                        <h3 className="text-xl font-bold text-blue-500 mb-2">
                            🔐 Account Status
                        </h3>

                        <p className="text-gray-600">
                            Active User
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            Your account is running normally
                        </p>

                    </div>

                    {/* ORDER CARD */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-green-500">

                        <h3 className="text-xl font-bold text-green-500 mb-2">
                            📦 Orders
                        </h3>

                        <p className="text-gray-600">
                            Your order history will appear here
                        </p>

                    </div>

                </div>

                {/* USER PRODUCTS */}
                <div className="mt-10">

                    <div className="bg-white rounded-2xl shadow-md p-5">

                        <h2 className="text-2xl font-bold text-orange-500 mb-5">
                            🛍️ Available Products
                        </h2>

                        <UserProducts />

                    </div>

                </div>

            </div>
        );
    }

    // ================= ADMIN VIEW =================
    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* ADMIN PROFILE */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

                <div className="flex items-center gap-5">

                    <img
                        src={
                            user?.photoURL ||
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        className="w-20 h-20 rounded-full border-4 border-orange-400 object-cover"
                        alt="user"
                    />

                    <div>

                        <h2 className="text-3xl font-bold text-orange-500">
                            Welcome Admin 👑
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Manage your jewellery business dashboard
                        </p>

                    </div>

                </div>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                {/* TOTAL CASH */}
                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">

                    <h3 className="text-gray-500 font-medium">
                        💵 Total Cash
                    </h3>

                    <p className="text-3xl font-bold text-purple-600 mt-2">
                        ৳{stats?.totalCash || 0}
                    </p>

                </div>

                {/* REVENUE */}
                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">

                    <h3 className="text-gray-500 font-medium">
                        💰 Revenue
                    </h3>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                        ৳{stats?.totalSales || 0}
                    </p>

                </div>

                {/* EXPENSE */}
                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">

                    <h3 className="text-gray-500 font-medium">
                        💸 Expense
                    </h3>

                    <p className="text-3xl font-bold text-red-600 mt-2">
                        ৳{stats?.totalExpense || 0}
                    </p>

                </div>

                {/* PROFIT */}
                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">

                    <h3 className="text-gray-500 font-medium">
                        📈 Profit
                    </h3>

                    <p className="text-3xl font-bold text-yellow-500 mt-2">
                        ৳{stats?.totalProfit || 0}
                    </p>

                </div>

            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* BAR CHART */}
                <div className="bg-white rounded-2xl shadow-md p-5 h-[400px]">

                    <h2 className="text-2xl font-bold text-orange-500 mb-5">
                        📊 Product Analytics
                    </h2>

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart data={safeProducts}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="name" />

                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="buyPrice"
                                fill="#22c55e"
                                radius={[5, 5, 0, 0]}
                            />

                            <Bar
                                dataKey="sellPrice"
                                fill="#ef4444"
                                radius={[5, 5, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                {/* PIE CHART */}
                <div className="bg-white rounded-2xl shadow-md p-5 h-[400px]">

                    <h2 className="text-2xl font-bold text-orange-500 mb-5">
                        📈 Financial Overview
                    </h2>

                    <ResponsiveContainer width="100%" height="100%">

                        <PieChart>

                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={120}
                                label
                            >
                                {pieChartData.map(
                                    (_, index) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                colors[
                                                index %
                                                colors.length
                                                ]
                                            }
                                        />
                                    )
                                )}
                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* MONTHLY REPORT */}
            <div className="mt-10">

                <div className="bg-white rounded-2xl shadow-md p-5">

                    <h2 className="text-2xl font-bold text-orange-500 mb-5">
                        📅 Monthly Report
                    </h2>

                    <MonthlyReport />

                </div>

            </div>

        </div>
    );
};

export default UserHome;