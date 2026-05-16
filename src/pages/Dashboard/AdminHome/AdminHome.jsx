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

// COLORS
const colors = ["#f59e0b", "#10b981", "#eab308", "#fb923c"];

// CARD COLOR MAP
const colorMap = {
    purple: "border-purple-500 text-purple-600",
    green: "border-green-500 text-green-600",
    red: "border-red-500 text-red-600",
    yellow: "border-yellow-500 text-yellow-600",
};

// ✅ REUSABLE CARD COMPONENT
const Card = ({ title, value, color, isMoney = true }) => (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${colorMap[color]} w-full transition-transform duration-200 hover:scale-[1.02]`}>
        <h3 className="text-gray-500 text-xs font-medium tracking-wide uppercase">{title}</h3>
        <p className="text-xl md:text-2xl font-bold mt-1 text-gray-800 break-words">
            {isMoney ? `৳${(value || 0).toLocaleString("en-BD")}` : value || 0}
        </p>
    </div>
);

const AdminHome = () => {
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

    // ================= PRODUCTS =================
    const { data: products = [] } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    // ================= PIE CHART DATA =================
    const pieChartData = [
        { name: "Sales", value: stats?.totalSales || 0 },
        { name: "Expense", value: stats?.totalExpense || 0 },
        { name: "Profit", value: stats?.totalProfit || 0 },
        { name: "Stock Value", value: stats?.totalStockValue || 0 },
    ];

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

    return (
        // w-full নিশ্চিত করে যে এটি ডানে-বামে পুরো জায়গা নিবে
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
            {/* grid-cols-2 মোবাইলেও পাশাপাশি ২টি কার্ড দেখাবে, বড় স্ক্রিনে ৪টি হয়ে যাবে ডানে-বামে পুরোটা নিয়ে */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full">
                <Card title="Total Cash" value={stats.totalCash} color="purple" />
                <Card title="Sales" value={stats.totalSales} color="green" />
                <Card title="Profit" value={stats.totalProfit} color="yellow" />
                <Card title="Hawlad" value={stats.totalCashFromList} color="green" />
                <Card title="Transactions +" value={stats.totalTransactionPlus} color="green" />
                <Card title="Transactions -" value={stats.totalTransactionMinus} color="red" />
                <Card title="Expenses" value={stats.totalExpense} color="red" />
                <Card title="Receivables" value={stats.totalReceivable} color="red" />
                <Card title="Staff Salary" value={stats.totalStaffSalary} color="red" />
                <Card title="Stock Qty" value={stats.totalStock} color="green" isMoney={false} />
                <Card title="Stock Value" value={stats.totalStockValue} color="purple" />
            </div>

            {/* ================= CHARTS ================= */}
            {/* বড় স্ক্রিনে ২টি চার্ট পাশাপাশি (বাম ও ডানে) থাকবে, মোবাইলে নিচে নিচে চলে আসবে */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 w-full">

                {/* BAR CHART */}
                <div className="bg-white rounded-2xl border border-gray-100 p-3 md:p-4 shadow-sm flex flex-col min-h-[380px] md:min-h-[420px] w-full">
                    <h2 className="text-gray-700 font-semibold mb-4 text-xs md:text-sm uppercase tracking-wide">Product Price Analysis</h2>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={products} margin={{ top: 10, right: 10, left: -25, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} stroke="#9ca3af" style={{ fontSize: '10px' }} />
                                <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                                <Tooltip />
                                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                                <Bar dataKey="buyPrice" fill="#f59e0b" name="Buy Price" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="sellPrice" fill="#10b981" name="Sell Price" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PIE CHART */}
                <div className="bg-white rounded-2xl border border-gray-100 p-3 md:p-4 shadow-sm flex flex-col min-h-[380px] md:min-h-[420px] w-full">
                    <h2 className="text-gray-700 font-semibold mb-4 text-xs md:text-sm uppercase tracking-wide">Financial Overview</h2>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieChartData} dataKey="value" nameKey="name" outerRadius="70%" label={{ fontSize: 10, fill: '#4b5563' }}>
                                    {pieChartData.map((_, i) => (
                                        <Cell key={i} fill={colors[i % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `৳${value.toLocaleString("en-BD")}`} />
                                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminHome;