import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useAdmin from "../../../hooks/useAdmin";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import MonthlyReport from "../../../components/MonthlyReport/MonthlyReport";
// 🚀 নতুন ইম্পোর্ট: তোমার তৈরি করা মান্থলি বার চার্টটি ড্যাশবোর্ডে যুক্ত করা হলো


const colors = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b"];

// ✅ রেউজেবল কার্ড কম্পোনেন্ট
const Card = ({ title, value, colorClass, isMoney = true }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-gray-300 w-full transition-transform duration-200 hover:scale-[1.02]">
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
    const { data: responseData = {}, isLoading, isError } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard");
            return res.data;
        },
    });

    const stats = responseData.stats || {};

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

    // 🌟 লাভ অথবা লস লজিক (Total Cash - Total Expenses) 
    const totalCashCombined = stats.totalCash || 0;
    const totalExpenseCombined = stats.totalExpense || 0;
    const netBusinessCash = totalCashCombined - totalExpenseCombined;

    // নেট ক্যাশ লাভ বা লস অনুযায়ী কালার সিলেক্ট 
    const cashColorClass = netBusinessCash >= 0 ? "text-green-600" : "text-red-600";

    // পাই চার্ট ডাটা স্ট্রাকচার 
    const pieChartData = [
        { name: "Net Cash", value: Math.abs(netBusinessCash) },
        { name: "Expenses", value: totalExpenseCombined },
        { name: "Sales", value: stats.totalSales || 0 },
        { name: "Stock Value", value: stats.totalStockValue || 0 },
    ];

    return (
        <div className="w-full space-y-6 px-2 sm:px-4 py-4 bg-gray-50/50 min-h-screen">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 pb-5 w-full text-center sm:text-left">
                <img src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} className="w-14 h-14 rounded-full border-2 border-orange-400 object-cover shadow-sm" alt="Admin" />
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                        Welcome, <span className="text-orange-500">{user?.displayName || "Admin"}</span> 👑
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                        Manage your business overview and track real-time statistics
                    </p>
                </div>
            </div>

            {/* ================= STATS CARDS ================= */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full">
                {/* 🎯 ফাইনাল ক্যাশ কার্ড */}
                <div className="col-span-2 md:col-span-3 lg:col-span-4 bg-white p-1 rounded-2xl shadow-sm border border-orange-100">
                    <Card title="Final Remaining Cash (Total Cash - Total Expenses)" value={netBusinessCash} colorClass={`${cashColorClass} text-2xl md:text-3xl font-black`} />
                </div>

                {/* প্লাস (+) কার্ডস */}
                <Card title="Total Cash In (+)" value={totalCashCombined} colorClass="text-green-600 font-extrabold" />
                <Card title="Sales (+)" value={stats.totalSales} colorClass="text-green-600" />
                <Card title="Profits List (+)" value={stats.totalProfitsCollection} colorClass="text-green-600" />
                <Card title="Cashs List (+)" value={stats.totalCashFromList} colorClass="text-green-600" />
                <Card title="Transactions (+)" value={stats.totalTransactionPlus} colorClass="text-green-600" />
                <Card title="Receivables (+)" value={stats.totalReceivablesPlus} colorClass="text-green-600" />

                {/* মাইনাস (-) খরচ কার্ডস */}
                <Card title="Total Expenses (-)" value={totalExpenseCombined} colorClass="text-red-600 font-extrabold" />
                <Card title="Expenses (-)" value={stats.totalExpenseAmount} colorClass="text-red-600" />
                <Card title="Staff Salary (-)" value={stats.totalStaffSalary} colorClass="text-red-600" />
                <Card title="Transactions (-)" value={stats.totalTransactionMinus} colorClass="text-red-600" />
                <Card title="Receivables (-)" value={stats.totalReceivablesMinus} colorClass="text-red-600" />

                {/* স্টকের সাধারণ কার্ডস */}
                <Card title="Stock Qty" value={stats.totalStock} colorClass="text-blue-600" isMoney={false} />
                <Card title="Stock Value" value={stats.totalStockValue} colorClass="text-purple-600" />
            </div>

            {/* ================= CHARTS (SIDE BY SIDE) ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 w-full">

                {/* 1. PIE CHART */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col min-h-[400px] w-full">
                    <h2 className="text-gray-700 font-bold mb-4 text-sm uppercase tracking-wide">
                        Business Overview Pie Chart </h2>
                    <div className="flex-1 w-full h-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={90} fill="#8884d8" dataKey="value" >
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

                {/* 🚀 2. MONTHLY BAR CHART (যোগ করা হলো) */}
                <div className="w-full">
                    <MonthlyReport />
                </div>

            </div>
        </div>
    );
};

export default UserHome;