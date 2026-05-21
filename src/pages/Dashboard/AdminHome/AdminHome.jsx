import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useAdmin from "../../../hooks/useAdmin";

const Card = ({ title, value, colorClass, isMoney = true }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-orange-400 w-full transition-transform duration-200 hover:scale-[1.02]">
        <h3 className="text-gray-500 text-xs font-semibold tracking-wide uppercase">{title}</h3>
        <p className={`text-xl md:text-2xl font-bold mt-1 break-words ${colorClass}`}>
            {isMoney ? `৳${(value || 0).toLocaleString("en-BD")}` : value || 0}
        </p>
    </div>
);

const AdminHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAdmin, isAdminLoading] = useAdmin();

    const { data: stats = {}, isLoading, isError } = useQuery({
        queryKey: ["dashboardAdminData"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard");
            return res.data;
        },
    });

    if (isAdminLoading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] w-full">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-10 text-red-500 font-bold w-full bg-white rounded-2xl shadow-sm border">
                ❌ ড্যাশবোর্ড ডাটা লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে সার্ভার কানেকশন চেক করুন।
            </div>
        );
    }

    const netBusinessCash = stats.netBusinessCash || 0;
    const cashColorClass = netBusinessCash >= 0 ? "text-green-600" : "text-red-600";

    const totalProfit = stats.totalProfit || 0;
    const profitColorClass = totalProfit >= 0 ? "text-emerald-600" : "text-red-600";

    const totalTransactionMinus = Math.abs(stats.totalTransactionMinus || 0);

    return (
        <div className="w-full space-y-6 px-2 sm:px-4 py-4 bg-gray-50/50 min-h-screen">
            {/* 💎 HEADER */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 pb-5 w-full text-center sm:text-left">
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        হ্যালো, <span className="text-orange-500">{user?.displayName || "এডমিন"}</span>
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5 font-medium">স্বাগতম এডমিন হোম 👑</p>
                </div>
            </div>

            {/* 📊 STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full">
                {/* মেইন ব্যালেন্স */}
                <div className="col-span-2 md:col-span-3 lg:col-span-4 bg-white p-1 rounded-2xl shadow-sm border border-orange-100">
                    <Card title="Final Remaining Cash (Total Cash In - Total Expenses)" value={netBusinessCash} colorClass={`${cashColorClass} text-2xl md:text-3xl font-black`} />
                </div>

                {/* ক্যাশ ইন সোর্স সমূহ */}
                <div className="col-span-2 md:col-span-3 lg:col-span-4 mt-2">
                    <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider border-b pb-1">Total Cash In Sources (+)</h4>
                </div>
                <Card title="Total Cash In (Combined)" value={stats.totalCashCombined} colorClass="text-green-600 font-extrabold" />
                <Card title="Product Sales" value={stats.totalSales} colorClass="text-green-500" />
                <Card title="Added Cash List" value={stats.totalCashFromList} colorClass="text-green-500" />
                <Card title="Received / Loan Taken" value={stats.totalTransactionPlus} colorClass="text-green-500" />

                {/* খরচ ও ক্যাশ আউট সমূহ */}
                <div className="col-span-2 md:col-span-3 lg:col-span-4 mt-2">
                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider border-b pb-1">Total Expenses & Outflows (-)</h4>
                </div>
                <Card title="Total Expenses (Combined)" value={stats.totalExpenseCombined} colorClass="text-red-600 font-extrabold" />
                <Card title="General Expenses" value={stats.totalExpenseAmount} colorClass="text-red-500" />
                <Card title="Staff Salary" value={stats.totalStaffSalary} colorClass="text-red-500" />
                <Card title="Given / Due / Remaining" value={totalTransactionMinus} colorClass="text-red-500" />

                {/* স্টক ও লাভ */}
                <div className="col-span-2 md:col-span-3 lg:col-span-4 mt-2">
                    <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider border-b pb-1">Inventory & Profits</h4>
                </div>
                <Card title="Stock Qty" value={stats.totalStock} colorClass="text-blue-600" isMoney={false} />
                <Card title="Stock Value" value={stats.totalStockValue} colorClass="text-purple-600" />
                <Card title="Total Profit / Gain" value={totalProfit} colorClass={`${profitColorClass} font-bold`} />
            </div>
        </div>
    );
};

export default AdminHome;