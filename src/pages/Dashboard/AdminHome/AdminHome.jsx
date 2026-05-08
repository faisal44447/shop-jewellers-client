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

// ================= COLORS =================
const colors = [
    "#f59e0b",
    "#f97316",
    "#eab308",
    "#fb923c",
];

const AdminHome = () => {
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
            const res = await axiosSecure.get("/dashboard", {
                headers: {
                    authorization: `Bearer ${localStorage.getItem(
                        "access-token"
                    )}`,
                },
            });

            return res.data || {};
        },
    });

    // ================= PRODUCTS =================
    const {
        data: products = [],
        isLoading: productLoading,
    } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

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
    if (isAdminLoading || statsLoading || productLoading) {
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

    return (
        <div className="p-5 bg-gray-100 min-h-screen">

            {/* ================= HEADER ================= */}
            <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row items-center justify-between mb-8">

                <div className="flex items-center gap-4">

                    <img
                        src={
                            isAdmin
                                ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                : user?.photoURL ||
                                "https://i.ibb.co/2n0Q5Yc/default-user.png"
                        }
                        className="w-16 h-16 rounded-full border-4 border-orange-400 object-cover"
                        alt="user"
                    />

                    <div>
                        <h2 className="text-2xl font-bold text-orange-500">
                            {isAdmin
                                ? "Welcome Admin 👑"
                                : `Welcome ${user?.displayName || "User"
                                }`}
                        </h2>

                        <p className="text-gray-500">
                            Manage your jewellery shop dashboard easily
                        </p>
                    </div>
                </div>

            </div>

            {/* ================= STATS CARD ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

                {/* TOTAL CASH */}
                <div className="bg-white rounded-2xl p-5 shadow border-l-4 border-purple-500">
                    <h3 className="text-gray-500 font-medium">
                        💵 Total Cash
                    </h3>

                    <p className="text-3xl font-bold mt-2 text-purple-600">
                        ৳{stats?.totalCash || 0}
                    </p>
                </div>

                {/* REVENUE */}
                <div className="bg-white rounded-2xl p-5 shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 font-medium">
                        💰 Revenue
                    </h3>

                    <p className="text-3xl font-bold mt-2 text-green-600">
                        ৳{stats?.totalSales || 0}
                    </p>
                </div>

                {/* EXPENSE */}
                <div className="bg-white rounded-2xl p-5 shadow border-l-4 border-red-500">
                    <h3 className="text-gray-500 font-medium">
                        💸 Expense
                    </h3>

                    <p className="text-3xl font-bold mt-2 text-red-600">
                        ৳{stats?.totalExpense || 0}
                    </p>
                </div>

                {/* PROFIT */}
                <div className="bg-white rounded-2xl p-5 shadow border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 font-medium">
                        📈 Profit
                    </h3>

                    <p className="text-3xl font-bold mt-2 text-yellow-600">
                        ৳{stats?.totalProfit || 0}
                    </p>
                </div>

            </div>

            {/* ================= CHART SECTION ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* BAR CHART */}
                <div className="bg-white rounded-2xl shadow-md p-5 h-[400px]">

                    <h2 className="text-xl font-bold mb-4 text-orange-500">
                        Product Price Analytics
                    </h2>

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart data={products}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis />

                            <Tooltip />
                            <Legend />

                            <Bar
                                dataKey="buyPrice"
                                fill="#f59e0b"
                                radius={[5, 5, 0, 0]}
                            />

                            <Bar
                                dataKey="sellPrice"
                                fill="#f97316"
                                radius={[5, 5, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                {/* PIE CHART */}
                <div className="bg-white rounded-2xl shadow-md p-5 h-[400px]">

                    <h2 className="text-xl font-bold mb-4 text-orange-500">
                        Financial Overview
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
                                {pieChartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            colors[
                                            index % colors.length
                                            ]
                                        }
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* ================= MONTHLY REPORT ================= */}
            <div className="mt-10">

                <div className="bg-white rounded-2xl shadow-md p-5">

                    <h2 className="text-2xl font-bold text-orange-500 mb-5">
                        📊 Monthly Report
                    </h2>

                    <MonthlyReport />

                </div>

            </div>

        </div>
    );
};

export default AdminHome;