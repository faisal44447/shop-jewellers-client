import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { formatDateTime } from "../../../utils/formatDateTime";

const ManageSales = () => {
    const axiosSecure = useAxiosSecure();

    const { data: sales = [], isLoading } = useQuery({
        queryKey: ["sales"],
        queryFn: async () => {
            const res = await axiosSecure.get("/sales");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-60">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const safeNumber = (val) => Number(val) || 0;

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6 text-center">
                📊 Sales History ({sales.length})
            </h2>

            <div className="overflow-x-auto">
                <table className="table w-full">

                    <thead>
                        <tr className="text-orange-500">
                            <th>#</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sales.map((s, i) => {
                            const formatted = formatDateTime(s?.createdAt);

                            const total =
                                safeNumber(s?.total) ||
                                safeNumber(s?.sellPrice) * safeNumber(s?.quantity);

                            return (
                                <tr key={s._id || i} className="hover">

                                    {/* INDEX */}
                                    <td>{i + 1}</td>

                                    {/* PRODUCT */}
                                    <td className="font-medium">
                                        {s?.productName || "Unknown Product"}
                                    </td>

                                    {/* QTY */}
                                    <td>{safeNumber(s?.quantity)}</td>

                                    {/* TOTAL */}
                                    <td className="text-green-600 font-bold">
                                        ৳ {total}
                                    </td>

                                    {/* DATE */}
                                    <td className="text-sm text-gray-600">
                                        {formatted?.date || "-"} <br />
                                        {formatted?.time || ""}
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default ManageSales;