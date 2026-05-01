import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MonthlyReport = () => {
    const axiosSecure = useAxiosSecure();

    const { data = [] } = useQuery({
        queryKey: ["monthly"],
        queryFn: async () => {
            const res = await axiosSecure.get("/report/monthly");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    return (
        <div className="h-72 bg-white p-4 rounded shadow mt-10">
            <ResponsiveContainer>
                <BarChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#22c55e" />
                    <Bar dataKey="expense" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyReport;