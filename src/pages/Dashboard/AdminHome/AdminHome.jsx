import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaDollarSign, FaUsers, FaBox } from "react-icons/fa";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Legend,
    ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useAdmin from "../../../hooks/useAdmin";

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAdmin, isAdminLoading] = useAdmin();

    if (isAdminLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    // ✅ DASHBOARD SUMMARY
    const { data: stats = {} } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard");
            return res.data;
        },
    });

    // ✅ PRODUCTS FOR CHART
    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");
            return res.data;
        },
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading charts...</p>;
    }

    // ✅ SAFETY FIX (map error avoid)
    const safeChart = Array.isArray(products) ? products : [];

    const pieChartData = safeChart.map((p) => ({
        name: p.name,
        value: p.buyPrice || 0,
    }));

    return (
        <div>

            {/* PROFILE */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={
                        isAdmin
                            ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            : user?.photoURL
                    }
                    className="w-16 h-16 rounded-full"
                />

                <h2 className="text-3xl">
                    {isAdmin ? "Welcome Admin 👑" : `Welcome ${user?.displayName}`}
                </h2>
            </div>

            {/* STATS */}
            <div className="stats shadow mb-10">
                <div className="stat">
                    <div>Revenue</div>
                    <div>{stats.totalSales || 0}</div>
                </div>

                <div className="stat">
                    <div>Stock</div>
                    <div>{stats.totalStock || 0}</div>
                </div>

                <div className="stat">
                    <div>Profit</div>
                    <div>{stats.profit || 0}</div>
                </div>
            </div>

            {/* CHART */}
            <div className="flex gap-10 flex-col md:flex-row">

                {/* BAR */}
                <div className="w-full md:w-1/2 h-[300px]">
                    <ResponsiveContainer>
                        <BarChart data={safeChart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Bar dataKey="buyPrice">
                                {safeChart.map((_, i) => (
                                    <Cell key={i} fill={colors[i % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* PIE */}
                <div className="w-full md:w-1/2 h-[300px]">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {pieChartData.map((_, i) => (
                                    <Cell key={i} fill={colors[i % colors.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default AdminHome;