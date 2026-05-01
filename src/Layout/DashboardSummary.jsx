import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DashboardSummary = () => {
    const axiosSecure = useAxiosSecure();

    const { data = {} } = useQuery({
        queryKey: ["summary"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard/summary");
            return res.data;
        }
    });

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                📊 ERP Financial Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="bg-green-500 text-white p-5 rounded-xl">
                    <p>Revenue</p>
                    <h2 className="text-2xl font-bold">৳ {data.revenue || 0}</h2>
                </div>

                <div className="bg-red-500 text-white p-5 rounded-xl">
                    <p>Expense</p>
                    <h2 className="text-2xl font-bold">৳ {data.expense || 0}</h2>
                </div>

                <div className="bg-blue-500 text-white p-5 rounded-xl">
                    <p>Profit</p>
                    <h2 className="text-2xl font-bold">৳ {data.profit || 0}</h2>
                </div>

                <div className="bg-black text-white p-5 rounded-xl">
                    <p>Loss</p>
                    <h2 className="text-2xl font-bold">৳ {data.loss || 0}</h2>
                </div>

            </div>
        </div>
    );
};

export default DashboardSummary;