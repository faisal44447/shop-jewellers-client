import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ProfitChart = () => {
    const axiosSecure = useAxiosSecure();
    const [data, setData] = useState([]);

    useEffect(() => {
        axiosSecure.get("/analytics/daily")
            .then(res => setData(res.data));
    }, []);

    return (
        <div className="p-5">

            <h2 className="text-xl font-bold mb-4">📈 Profit Graph</h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="profit" stroke="#22c55e" />
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
};

export default ProfitChart; 