import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Sales = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: sales = [] } = useQuery({
        queryKey: ["sales"],
        queryFn: async () => {
            const res = await axiosSecure.get("/sales");
            return res.data;
        },
    });

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete?",
            icon: "warning",
            showCancelButton: true,
        });

        if (!confirm.isConfirmed) return;

        await axiosSecure.delete(`/sales/${id}`);

        queryClient.invalidateQueries(["sales"]);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
                Sales ({sales.length})
            </h2>

            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Profit</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map((s) => (
                        <tr key={s._id}>
                            {/* PRODUCT WITH IMAGE */}
                            <td className="flex items-center gap-3">
                                <img
                                    src={s.image || "https://via.placeholder.com/50"}
                                    alt={s.productName}
                                    className="w-10 h-10 rounded object-cover"
                                />
                                <span>{s.productName}</span>
                            </td>

                            <td>{s.quantity}</td>

                            <td>৳{s.profit}</td>

                            <td>
                                <button
                                    onClick={() => handleDelete(s._id)}
                                    className="btn btn-sm btn-error"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sales;