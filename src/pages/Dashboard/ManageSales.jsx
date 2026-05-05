import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { formatDateTime } from "../../../utils/formatDateTime";

const ManageSales = () => {
    const axiosSecure = useAxiosSecure();

    const { data: sales = [], isLoading } = useQuery({
        queryKey: ["sales"],
        queryFn: async () => {
            const res = await axiosSecure.get("/sales");
            return res.data;
        }
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📊 Sales History</h2>

            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map((s, i) => {
                        const formatted = formatDateTime(s.createdAt);

                        return (
                            <tr key={i}>
                                {/* 🔥 FIXED NAME */}
                                <td>{s.productName ?? "Unknown"}</td>

                                <td>{s.quantity}</td>

                                {/* 🔥 FIXED TOTAL */}
                                <td>৳ {Number(s.total ?? s.sellPrice * s.quantity ?? 0)}</td>

                                {/* 🔥 FIXED DATE */}
                                <td>{formatted?.date || "-"}</td>
                            </tr>
                        );
                    })}
                </tbody>
                
            </table>
        </div>
    );
};

export default ManageSales;