import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#3b82f6", "#ef4444", "#10b981", "#a855f7", "#f59e0b"];

const Card = ({ title, value, colorClass, isMoney = true }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-orange-400 w-full transition-transform duration-200 hover:scale-[1.02]">
        <h3 className="text-gray-500 text-xs font-semibold tracking-wide uppercase">{title}</h3>
        <p className={`text-xl md:text-2xl font-bold mt-1 break-words ${colorClass}`}>
            {isMoney ? `৳${(value || 0).toLocaleString("en-BD")}` : value || 0}
        </p>
    </div>
);

const UserHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats = {}, isLoading, isError } = useQuery({
        queryKey: ["dashboardUserData"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard");
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] w-full">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12 text-red-500 font-bold w-full bg-white rounded-2xl shadow-sm border">
                ❌ ড্যাশবোর্ড ডাটা লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে সার্ভার কানেকশন চেক করুন।
            </div>
        );
    }

    const totalSales = stats.totalSales || 0;
    const totalExpenseAmount = stats.totalExpenseAmount || 0;
    const totalStaffSalary = stats.totalStaffSalary || 0;
    const totalCashFromList = stats.totalCashFromList || 0;
    const totalTransactionPlus = stats.totalTransactionPlus || 0;
    const totalTransactionMinus = Math.abs(stats.totalTransactionMinus || 0);

    const totalCashCombined = stats.totalCashCombined || 0;
    const totalExpenseCombined = stats.totalExpenseCombined || 0;
    const netBusinessCash = stats.netBusinessCash || 0;
    const cashColorClass = netBusinessCash >= 0 ? "text-green-600" : "text-red-600";
    const totalProfit = stats.totalProfit || 0;
    const profitColorClass = totalProfit >= 0 ? "text-emerald-600 font-bold" : "text-red-600 font-bold";

    const pieChartData = [
        { name: "অবशिष्ट ক্যাশ", value: netBusinessCash > 0 ? netBusinessCash : 0 },
        { name: "মোট খরচ", value: totalExpenseCombined },
        { name: "মোট বিক্রি", value: totalSales },
        { name: "স্টক ভ্যালু", value: stats.totalStockValue || 0 },
        { name: "মোট বাকি/ধার", value: totalTransactionMinus },
    ];

    // ডাটা আছে কিনা তা চেক করার নিরাপদ উপায়
    const hasData = pieChartData.some(item => Number(item.value) > 0);

    return (
        <div className="w-full space-y-6 px-2 sm:px-4 py-4 bg-gray-50/50 min-h-screen">
            {/* 💎 HEADER */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 pb-5 w-full text-center sm:text-left">
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        হ্যালো, <span className="text-orange-500">{user?.displayName || "ইউজার"}</span>
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5 font-medium">স্বাগতম ইউজার হোম 👋</p>
                </div>
            </div>

            {/* 💰 CASH HIGHLIGHT */}
            <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-orange-200">
                <h3 className="text-gray-500 text-xs sm:text-sm font-bold tracking-wide uppercase text-center sm:text-left">
                    অবशिष्ट ক্যাশ তহবিল (Total Cash In - Total Expenses)
                </h3>
                <p className={`text-3xl md:text-4xl font-black mt-2 text-center sm:text-left break-words ${cashColorClass}`}>
                    ৳{netBusinessCash.toLocaleString("en-BD")}
                </p>
            </div>

            {/* 📊 GRID CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full">
                <Card title="মোট ক্যাশ ইন (+)" value={totalCashCombined} colorClass="text-green-600 font-extrabold" />
                <Card title="মোট বিক্রি (+)" value={totalSales} colorClass="text-green-500" />
                <Card title="অ্যাড ক্যাশ লিস্ট (+)" value={totalCashFromList} colorClass="text-green-500" />
                <Card title="ধার/আদায় প্লাস (+)" value={totalTransactionPlus} colorClass="text-green-500" />

                <Card title="মোট খরচ ইন (-)" value={totalExpenseCombined} colorClass="text-red-600 font-extrabold" />
                <Card title="সাধারণ খরচ (-)" value={totalExpenseAmount} colorClass="text-red-500" />
                <Card title="স্টাফ বেতন (-)" value={totalStaffSalary} colorClass="text-red-500" />
                <Card title="ধার/বাকি মাইনাস (-)" value={totalTransactionMinus} colorClass="text-red-500" />

                <Card title="মোট স্টক প্রোডাক্ট" value={stats.totalStock} colorClass="text-blue-600" isMoney={false} />
                <Card title="স্টক পণ্যের মূল্য" value={stats.totalStockValue} colorClass="text-purple-600" />
                <Card title="মোট প্রফিট/লাভ" value={totalProfit} colorClass={profitColorClass} />
            </div>

            {/* 📉 PIE CHART (FIXED: হুক এরর আসবে না) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col min-h-[450px] w-full max-w-3xl mx-auto relative">
                <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide text-center">
                    জুয়েলারি শপ Overview Chart
                </h2>

                {/* ডাটা না থাকলে চার্ট হাইড না করে উপরে একটি সুন্দর লেয়ার তৈরি করা হয়েছে */}
                {!hasData && (
                    <div className="absolute inset-0 bg-white/95 z-10 flex items-center justify-center text-gray-400 text-sm font-medium rounded-2xl">
                        কোনো ডাটা পাওয়া যায়নি অথবা লোড হচ্ছে...
                    </div>
                )}

                <div className="flex-1 w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="45%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `৳${Number(value).toLocaleString("en-BD")}`} />
                            <Legend verticalAlign="bottom" layout="horizontal" align="center" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default UserHome;