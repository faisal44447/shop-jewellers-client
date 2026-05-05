// src/pages/Dashboard/DashboardSummary.jsx
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DashboardSummary = () => {
    const axiosSecure = useAxiosSecure();

    const { data = {}, isLoading } = useQuery({
        queryKey: ["summary"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard/summary");
            return res.data;
        }
    });

    if (isLoading) {
        return <span className="loading loading-spinner"></span>;
    }

    return (
        <div>
            <h2>Total Products: {data.products}</h2>
            <h2>Total Sales: {data.sales}</h2>
        </div>
    );
};

export default DashboardSummary;