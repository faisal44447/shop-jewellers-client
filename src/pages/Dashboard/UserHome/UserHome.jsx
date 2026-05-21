import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const Card = ({
    title,
    value,
    colorClass,
    isMoney = true,
}) => (

    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-orange-400 w-full transition-transform duration-200 hover:scale-[1.02]">

        <h3 className="text-gray-500 text-xs font-semibold tracking-wide uppercase">
            {title}
        </h3>

        <p className={`text-xl md:text-2xl font-bold mt-1 break-words ${colorClass}`}>

            {isMoney
                ? `৳${Number(value || 0).toLocaleString("en-BD")}`
                : value || 0}

        </p>

    </div>

);

const UserHome = () => {

    const { user } = useAuth();

    const axiosSecure = useAxiosSecure();

    const {
        data: stats = {},
        isLoading,
        isError,
    } = useQuery({

        queryKey: ["dashboardUserData"],

        queryFn: async () => {

            const res = await axiosSecure.get("/dashboard");

            return res.data;

        },

    });

    // ================= LOADING =================
    if (isLoading) {

        return (

            <div className="flex justify-center items-center min-h-[60vh] w-full">

                <span className="loading loading-spinner loading-lg text-orange-500"></span>

            </div>

        );

    }

    // ================= ERROR =================
    if (isError) {

        return (

            <div className="text-center py-12 text-red-500 font-bold w-full bg-white rounded-2xl shadow-sm border">

                ❌ ড্যাশবোর্ড ডাটা লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে সার্ভার কানেকশন চেক করুন।

            </div>

        );

    }

    // ================= DATA =================
    const totalSales =
        stats.totalSales || 0;

    const totalExpenseAmount =
        stats.totalExpenseAmount || 0;

    const totalStaffSalary =
        stats.totalStaffSalary || 0;

    const totalCashFromList =
        stats.totalCashFromList || 0;

    const totalTransactionPlus =
        stats.totalTransactionPlus || 0;

    const totalTransactionMinus =
        Math.abs(stats.totalTransactionMinus || 0);

    const totalCashCombined =
        stats.totalCashCombined || 0;

    const totalExpenseCombined =
        stats.totalExpenseCombined || 0;

    const netBusinessCash =
        stats.netBusinessCash || 0;

    const totalProfit =
        stats.totalProfit || 0;

    const manualProfit =
        stats.manualProfit || 0;

    const cashColorClass =
        netBusinessCash >= 0
            ? "text-green-600"
            : "text-red-600";

    const profitColorClass =
        totalProfit >= 0
            ? "text-emerald-600 font-bold"
            : "text-red-600 font-bold";

    return (

        <div className="w-full space-y-6 px-2 sm:px-4 py-4 bg-gray-50/50 min-h-screen">

            {/* ================= HEADER ================= */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200 pb-5 w-full text-center sm:text-left">

                <div className="flex-1 min-w-0">

                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">

                        হ্যালো,
                        <span className="text-orange-500">
                            {" "}
                            {user?.displayName || "ইউজার"}
                        </span>

                    </h2>

                    <p className="text-xs md:text-sm text-gray-500 mt-0.5 font-medium">

                        স্বাগতম ইউজার হোম 👋

                    </p>

                </div>

            </div>

            {/* ================= MAIN CASH ================= */}
            <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-orange-200 bg-gradient-to-br from-white to-orange-50/20">

                <h3 className="text-gray-500 text-xs sm:text-sm font-bold tracking-wide uppercase text-center sm:text-left">

                    অবশিষ্ট ক্যাশ তহবিল
                    (Total Cash In - Total Expenses)

                </h3>

                <p className={`text-3xl md:text-4xl font-black mt-2 text-center sm:text-left break-words ${cashColorClass}`}>

                    ৳{netBusinessCash.toLocaleString("en-BD")}

                </p>

            </div>

            {/* ================= CARDS ================= */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full">

                {/* ================= CASH IN ================= */}
                <Card
                    title="মোট ক্যাশ ইন (+)"
                    value={totalCashCombined}
                    colorClass="text-green-600 font-extrabold"
                />

                <Card
                    title="মোট বিক্রি (+)"
                    value={totalSales}
                    colorClass="text-green-500"
                />

                <Card
                    title="অ্যাড ক্যাশ লিস্ট (+)"
                    value={totalCashFromList}
                    colorClass="text-green-500"
                />

                <Card
                    title="ধার/আদায় প্লাস (+)"
                    value={totalTransactionPlus}
                    colorClass="text-green-500"
                />

                {/* ================= CASH OUT ================= */}
                <Card
                    title="মোট খরচ ইন (-)"
                    value={totalExpenseCombined}
                    colorClass="text-red-600 font-extrabold"
                />

                <Card
                    title="সাধারণ খরচ (-)"
                    value={totalExpenseAmount}
                    colorClass="text-red-500"
                />

                <Card
                    title="স্টাফ বেতন (-)"
                    value={totalStaffSalary}
                    colorClass="text-red-500"
                />

                <Card
                    title="ধার/বাকি মাইনাস (-)"
                    value={totalTransactionMinus}
                    colorClass="text-red-500"
                />

                {/* ================= STOCK & PROFITS ================= */}
                <Card
                    title="মোট স্টক প্রোডাক্ট"
                    value={stats.totalStock}
                    colorClass="text-blue-600"
                    isMoney={false}
                />

                <Card
                    title="স্টক পণ্যের মূল্য"
                    value={stats.totalStockValue}
                    colorClass="text-purple-600"
                />

                <Card
                    title="ম্যানুয়াল অ্যাডেড প্রফিট"
                    value={manualProfit}
                    colorClass="text-emerald-500 font-bold"
                />

                <Card
                    title="মোট প্রফিট / লাভ"
                    value={totalProfit}
                    colorClass={profitColorClass}
                />

            </div>

        </div>

    );

};

export default UserHome;