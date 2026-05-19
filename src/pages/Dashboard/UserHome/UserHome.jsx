import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b"];

// 🎯 ড্যাশবোর্ডের ছোট ছোট কার্ডগুলোর জন্য কমন কম্পোনেন্ট
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

    // 🚀 রি-অ্যাক্ট কোয়েরি দিয়ে ব্যাকএন্ডের /dashboard এপিআই থেকে ডেটা আনা হচ্ছে
    const { data: stats = {}, isLoading, isError } = useQuery({
        queryKey: ["dashboardData"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard");
            return res.data;
        },
    });

    // ডাটা লোড হওয়ার সময় লোডিং স্পিনার
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] w-full">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    // কোনো কারণে ব্যাকএন্ড থেকে ডাটা না আসলে বা সার্ভার অফ থাকলে এরর মেসেজ
    if (isError) {
        return (
            <div className="text-center py-12 text-red-500 font-bold w-full bg-white rounded-2xl shadow-sm border">
                ❌ ড্যাশবোর্ড ডাটা লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে সার্ভার কানেকশন বা টোকেন চেক করুন।
            </div>
        );
    }

    // 🎯 ব্যাকএন্ড থেকে পাঠানো ভ্যারিয়েবলগুলোর সেফ-স্ট্রাকচারিং (ফাঁকা থাকলে ডিফল্ট ০)
    const totalSales = stats.totalSales || 0;
    const totalProfit = stats.totalProfit || 0;
    const totalExpenseAmount = stats.totalExpenseAmount || 0;
    const totalStaffSalary = stats.totalStaffSalary || 0;
    const totalCashFromList = stats.totalCashFromList || 0;
    const totalTransactionPlus = stats.totalTransactionPlus || 0;
    const totalTransactionMinus = stats.totalTransactionMinus || 0;

    // প্লাস-মাইনাস এবং নেট ক্যাশ হিসাব (যা ব্যাকএন্ড থেকে আসছে)
    const totalCashCombined = stats.totalCashCombined || 0;
    const totalExpenseCombined = stats.totalExpenseCombined || 0;
    const netBusinessCash = stats.netBusinessCash || 0;

    // নেট ক্যাশ প্লাস হলে গ্রিন কালার, মাইনাস বা লস হলে রেড কালার হবে
    const cashColorClass = netBusinessCash >= 0 ? "text-green-600" : "text-red-600";

    // 📊 পাই-চার্টের জন্য ডাটা ফরম্যাটিং
    const pieChartData = [
        { name: "Net Cash", value: Math.abs(netBusinessCash) },
        { name: "Total Expenses", value: totalExpenseCombined },
        { name: "Total Sales", value: totalSales },
        { name: "Stock Value", value: stats.totalStockValue || 0 },
    ];

    return (
        <div className="w-full space-y-6 px-2 sm:px-4 py-4 bg-gray-50/50 min-h-screen">

            {/* 💎 হেডার সেকশন */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 pb-5 w-full text-center sm:text-left">
                <img
                    src={user?.photoURL || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150"}
                    className="w-14 h-14 rounded-full border-2 border-orange-500 object-cover shadow-sm"
                    alt="User Avatar"
                />
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                        স্বাগতম, <span className="text-orange-500">{user?.displayName || "ইউজার"}</span> 👋
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">Al Amin Jewellers Shop — রিয়েল-টাইম হিসাব-নিকাশ</p>
                </div>
            </div>

            {/* 💰 ফাইনাল নেট ক্যাশ ডিসপ্লে (সবচেয়ে বড় হাইলাইটেড কার্ড) */}
            <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-orange-200 transition-all duration-300 hover:shadow-md">
                <h3 className="text-gray-500 text-xs sm:text-sm font-bold tracking-wide uppercase text-center sm:text-left">
                    অবশিষ্ট ক্যাশ তহবিল (Total Cash In - Total Expenses)
                </h3>
                <p className={`text-3xl md:text-4xl font-black mt-2 text-center sm:text-left break-words ${cashColorClass}`}>
                    ৳{netBusinessCash.toLocaleString("en-BD")}
                </p>
            </div>

            {/* 📊 স্ট্যাটস কার্ড গ্রিড (Total ১১টি কার্ড সুন্দরভাবে সাজানো) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full">

                {/* ক্যাশ ইনসেকশন (প্লাস আইটেম) */}
                <Card title="মোট ক্যাশ ইন (+)" value={totalCashCombined} colorClass="text-green-600 font-extrabold" />
                <Card title="মোট বিক্রি (+)" value={totalSales} colorClass="text-green-500" />
                <Card title="অ্যাড ক্যাশ লিস্ট (+)" value={totalCashFromList} colorClass="text-green-500" />
                <Card title="ধার/আদায় প্লাস (+)" value={totalTransactionPlus} colorClass="text-green-500" />

                {/* ক্যাশ আউট সেকশন (মাইনাস আইটেম) */}
                <Card title="মোট খরচ ইন (-)" value={totalExpenseCombined} colorClass="text-red-600 font-extrabold" />
                <Card title="সাধারণ খরচ (-)" value={totalExpenseAmount} colorClass="text-red-500" />
                <Card title="স্টাফ বেতন (-)" value={totalStaffSalary} colorClass="text-red-500" />
                <Card title="ধার/বাকি মাইনাস (-)" value={totalTransactionMinus} colorClass="text-red-500" />

                {/* স্টক সেকশন */}
                <Card title="মোট স্টক প্রোডাক্ট" value={stats.totalStock} colorClass="text-blue-600" isMoney={false} />
                <Card title="স্টক পণ্যের মূল্য" value={stats.totalStockValue} colorClass="text-purple-600" />
                <Card title="মোট প্রফিট/লাভ" value={totalProfit} colorClass="text-emerald-600 font-bold" />
            </div>

            {/* 📉 বিজনেস ওভারভিউ পাই-চার্ট সেকশন */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col min-h-[420px] w-full max-w-3xl mx-auto transition-all duration-300 hover:shadow-md">
                <h2 className="text-gray-700 font-bold mb-6 text-sm uppercase tracking-wide text-center">
                    জুয়েলারি শপ ওভারভিউ চার্ট
                </h2>
                <div className="flex-1 w-full h-full min-h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={110}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `৳${value.toLocaleString("en-BD")}`} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default UserHome;