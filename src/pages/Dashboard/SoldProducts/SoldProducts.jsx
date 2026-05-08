import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const SoldProducts = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: sales = [] } = useQuery({
        queryKey: ["sales"],
        queryFn: async () => {
            const res = await axiosSecure.get("/sales");
            return res.data;
        },
    });

    // ================= DELETE =================
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This sale will be deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes delete",
        });

        if (!confirm.isConfirmed) return;

        await axiosSecure.delete(`/sales/${id}`);

        queryClient.invalidateQueries(["sales"]);

        Swal.fire("Deleted!", "Sale removed", "success");
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-center mb-8">
                🧾 Sold Products
            </h2>

            {sales.length === 0 ? (
                <p className="text-center">No sold products yet</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sales.map((item) => (
                        <div
                            key={item._id}
                            className="card bg-base-100 shadow-xl p-4"
                        >
                            {/* IMAGE */}
                            <img
                                src={item.image || "https://via.placeholder.com/150"}
                                alt={item.productName}
                                className="h-40 w-full object-cover rounded"
                            />

                            {/* NAME */}
                            <h2 className="text-xl font-bold mt-3">
                                {item.productName}
                            </h2>

                            {/* DETAILS */}
                            <p>Quantity: {item.quantity}</p>

                            <p>Buy Price: ৳{item.buyPrice}</p>

                            <p>Sell Price: ৳{item.sellPrice}</p>

                            <p className="text-green-600 font-bold">
                                Profit: ৳{item.profit}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Date:{" "}
                                {new Date(item.createdAt).toLocaleString()}
                            </p>

                            {/* DELETE BUTTON */}
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="btn btn-error w-full mt-4"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SoldProducts;