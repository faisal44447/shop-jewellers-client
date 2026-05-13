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

// ✅ CARD COMPONENT
const Card = ({ title, value, color, isMoney = true }) => (
    <div
        className={`bg-white rounded-2xl p-5 shadow border-l-4 ${colorMap[color]}`}
    >
        <h3 className="text-gray-500 text-sm">{title}</h3>

        <p className="text-2xl md:text-3xl font-bold">
            {isMoney ? `৳${value || 0}` : value || 0}
        </p>
    </div>
);

const AdminHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAdmin, isAdminLoading] = useAdmin();

    // ================= DASHBOARD DATA =================
    const {
        data: stats = {},
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard");
            return res.data || {};
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
        {
            name: "Sales",
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
    if (isAdminLoading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    // ================= ERROR =================
    if (isError) {
        return (
            <div className="text-center mt-20 text-red-500 font-bold">
                ❌ Failed to load dashboard data
            </div>
        );
    }

    return (
        <div className="p-5 bg-gray-100 min-h-screen">

            {/* ================= HEADER ================= */}
            <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 mb-8">

                <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    className="w-16 h-16 rounded-full border-4 border-orange-400"
                />

                <div>
                    <h2 className="text-2xl font-bold text-orange-500">
                        Welcome Admin 👑
                    </h2>

                    <p className="text-gray-500">
                        Manage your jewellery shop dashboard easily
                    </p>
                </div>
            </div>

            {/* ================= STATS CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

                <Card
                    title="Total Cash"
                    value={stats.totalCash}
                    color="purple"
                />

                <Card
                    title="Sales"
                    value={stats.totalSales}
                    color="green"
                />

                <Card
                    title="Expenses"
                    value={stats.totalExpense}
                    color="red"
                />

                <Card
                    title="Receivables"
                    value={stats.totalReceivable}
                    color="red"
                />

                <Card
                    title="Transactions +"
                    value={stats.totalTransactionPlus}
                    color="green"
                />

                <Card
                    title="Transactions -"
                    value={stats.totalTransactionMinus}
                    color="red"
                />

                <Card
                    title="Cash Added"
                    value={stats.totalCashFromList}
                    color="green"
                />

                <Card
                    title="Staff Salary"
                    value={stats.totalStaffSalary}
                    color="red"
                />

                <Card
                    title="Profit"
                    value={stats.totalProfit}
                    color="yellow"
                />

                <Card
                    title="Total Stock"
                    value={stats.totalStock}
                    color="green"
                    isMoney={false}
                />

                <Card
                    title="Stock Value"
                    value={stats.totalStockValue}
                    color="purple"
                />

            </div>

            {/* ================= CHARTS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ================= BAR CHART ================= */}
                <div className="bg-white rounded-2xl p-5 h-[450px]">

                    <h2 className="text-orange-500 font-bold mb-4">
                        Product Price Analysis
                    </h2>

                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={products}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 80,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey={(item) => item.name || "Unknown"}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={70}
                            />

                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="buyPrice"
                                fill="#f59e0b"
                                name="Buy Price"
                            />

                            <Bar
                                dataKey="sellPrice"
                                fill="#10b981"
                                name="Sell Price"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* ================= PIE CHART ================= */}
                <div className="bg-white rounded-2xl p-5 h-[450px] flex flex-col">

                    <h2 className="text-orange-500 font-bold mb-3">
                        Financial Overview
                    </h2>

                    <div className="flex-1">

                        <ResponsiveContainer width="100%" height="100%">

                            <PieChart>

                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius="70%"
                                    label
                                >
                                    {pieChartData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={colors[i % colors.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default AdminHome;