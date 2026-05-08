import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

const ProfitChart = () => {
    const axiosSecure = useAxiosSecure();

    // ================= STATES =================
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH DATA =================
    useEffect(() => {

        const loadData = async () => {
            try {

                const res = await axiosSecure.get(
                    "/analytics/daily"
                );

                setData(
                    Array.isArray(res.data)
                        ? res.data
                        : []
                );

            } catch (err) {

                console.error(err);

                setError(
                    "Failed to load profit analytics"
                );

            } finally {

                setLoading(false);

            }
        };

        loadData();

    }, [axiosSecure]);

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="flex justify-center items-center h-72 bg-white rounded-2xl shadow-md">

                <span className="loading loading-spinner loading-lg text-orange-500"></span>

            </div>
        );
    }

    // ================= ERROR =================
    if (error) {
        return (
            <div className="flex justify-center items-center h-72 bg-white rounded-2xl shadow-md">

                <h2 className="text-red-500 text-xl font-bold">
                    ❌ {error}
                </h2>

            </div>
        );
    }

    // ================= EMPTY DATA =================
    if (data.length === 0) {
        return (
            <div className="flex justify-center items-center h-72 bg-white rounded-2xl shadow-md">

                <h2 className="text-gray-500 text-xl font-semibold">
                    No Profit Data Available
                </h2>

            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">

            {/* TITLE */}
            <div className="mb-6">

                <h2 className="text-2xl font-bold text-orange-500">
                    📈 Daily Profit Analytics
                </h2>

                <p className="text-gray-500 mt-1">
                    Track your daily business profit performance
                </p>

            </div>

            {/* CHART */}
            <div className="w-full h-[350px]">

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 0,
                            bottom: 5,
                        }}
                    >

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#22c55e",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default ProfitChart;