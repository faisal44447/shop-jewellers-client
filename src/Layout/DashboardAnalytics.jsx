import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const DashboardAnalytics = () => {
    const axiosSecure = useAxiosSecure();
    const [data, setData] = useState([]);

    useEffect(() => {
        axiosSecure.get("/analytics/daily")
            .then(res => setData(res.data));
    }, []);

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-5">📊 Daily Sales Analytics</h2>

            <div className="overflow-x-auto">
                <table className="table w-full">

                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Total Sales</th>
                            <th>Profit</th>
                            <th>Orders</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((d, i) => (
                            <tr key={i}>
                                <td>{d.date}</td>
                                <td>৳ {d.totalSales}</td>
                                <td className="text-green-600">৳ {d.profit}</td>
                                <td>{d.count}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default DashboardAnalytics; 