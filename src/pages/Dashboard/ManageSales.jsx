import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { formatDateTime } from "../../../utils/formatDateTime";

const ManageSales = () => {
    const axiosSecure = useAxiosSecure();

    const { data: sales = [] } = useQuery({
        queryKey: ["sales"],
        queryFn: async () => {
            const res = await axiosSecure.get("/sales");
            return res.data;
        }
    });

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-4">
                📊 Sales History (ERP)
            </h2>

            <table className="table w-full bg-white shadow rounded-lg">

                <thead className="bg-gray-100">
                    <tr>
                        <th>Product ID</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>

                {/* 👇 এখানে তোমার দেওয়া tbody বসবে */}
                <tbody>
                    {sales.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-50">

                            <td>{s.productId}</td>
                            <td>{s.quantity}</td>

                            <td className="font-bold text-green-600">
                                ৳ {s.total}
                            </td>

                            <td className="text-sm text-gray-600">
                                {formatDateTime(s.date)}
                            </td>

                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default ManageSales;