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

const colors = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6"];

// ✅ আপডেট করা রেউজেবল কার্ড কম্পোনেন্ট (কাস্টম টেক্সট কালার সাপোর্ট সহ)
const Card = ({ title, value, colorClass, isMoney = true }) => (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 border-gray-200 w-full transition-transform duration-200 hover:scale-[1.02]`}>
        <h3 className="text-gray-500 text-xs font-medium tracking-wide uppercase">{title}</h3>
        <p className={`text-xl md:text-2xl font-bold mt-1 break-words ${colorClass}`}>
            {isMoney ? `৳${(value || 0).toLocaleString("en-BD")}` : value || 0}
        </p>
    </div>
);

const UserHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAdmin, isAdminLoading] = useAdmin();

    // ================= DASHBOARD DATA =================
    const { data: stats = {}, isLoading, isError } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard");
            return res.data;
        },
    });

    // ================= LOADING STATE =================
    if (isAdminLoading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] w-full">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    // ================= ERROR STATE =================
    if (isError) {
        return (
            <div className="text-center py-10 text-red-500 font-bold w-full">
                ❌ Failed to load dashboard data. Please check server or token.
            </div>
        );
    }

    // 🌟 লাভ অথবা লস অনুযায়ী কালার সিলেক্ট করার লজিক
    const isProfit = (stats?.totalCash || 0) >= 0;
    const cashColorClass = isProfit ? "text-green-600" : "text-red-600";

    // পাই চার্ট ডাটা স্ট্রাকচার
    const pieChartData = [
        { name: "Total Cash", value: Math.abs(stats?.totalCash || 0) },
        { name: "Expenses", value: stats?.totalExpense || 0 },
        { name: "Sales", value: stats?.totalSales || 0 },
        { name: "Stock Value", value: stats?.totalStockValue || 0 },
    ];

    return (
        <div className="w-full space-y-6 px-1 sm:px-2">

            {/* ================= HEADER ================= */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-5 w-full text-center sm:text-left">
                <img
                    src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    className="w-14 h-14 rounded-full border-2 border-orange-400 object-cover shadow-sm"
                    alt="Admin"
                />
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                        Welcome, <span className="text-orange-500">{user?.displayName || "Admin"}</span> 👑
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">Manage your business overview and track real-time statistics</p>
                </div>
            </div>

            {/* ================= STATS CARDS ================= */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full">

                {/* 🎯 আপনার শর্ত অনুযায়ী: প্রফিট হলে টেক্সট সবুজ, লস হলে লাল */}
                <Card title="Total Cash" value={stats.totalCash} colorClass={cashColorClass} />

                {/* প্লাস (+) কার্ডস */}
                <Card title="Sales (+)" value={stats.totalSales} colorClass="text-green-600" />
                <Card title="Profits List (+)" value={stats.totalProfitsCollection} colorClass="text-green-600" />
                <Card title="Cashs List (+)" value={stats.totalCashFromList} colorClass="text-green-600" />
                <Card title="Transactions (+)" value={stats.totalTransactionPlus} colorClass="text-green-600" />
                <Card title="Receivables (+)" value={stats.totalReceivablesPlus} colorClass="text-green-600" />

                {/* মাইনাস (-) কার্ডস - আপনার শর্ত অনুযায়ী সব মাইনাস খরচগুলো এখানে */}
                <Card title="Total Expenses (-)" value={stats.totalExpense} colorClass="text-red-600" />
                <Card title="Staff Salary (-)" value={stats.totalStaffSalary} colorClass="text-red-600" />
                <Card title="Transactions (-)" value={stats.totalTransactionMinus} colorClass="text-red-600" />
                <Card title="Receivables (-)" value={stats.totalReceivablesMinus} colorClass="text-red-600" />

                {/* স্টকের সাধারণ কার্ডস */}
                <Card title="Stock Qty" value={stats.totalStock} colorClass="text-blue-600" isMoney={false} />
                <Card title="Stock Value" value={stats.totalStockValue} colorClass="text-purple-600" />
            </div>

            {/* ================= CHARTS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 w-full">
                {/* PIE CHART */}
                <div className="bg-white rounded-2xl border border-gray-100 p-3 md:p-4 shadow-sm flex flex-col min-h-[380px] md:min-h-[420px] w-full">
                    <h2 className="text-gray-700 font-bold mb-4 text-sm uppercase tracking-wide">Business Overview Pie Chart</h2>
                    <div className="flex-1 w-full h-full min-h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `৳${value.toLocaleString("en-BD")}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserHome;