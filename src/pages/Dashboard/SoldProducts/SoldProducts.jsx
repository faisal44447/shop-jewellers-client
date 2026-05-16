import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const SoldProducts = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: sales = [], isLoading } = useQuery({
        queryKey: ["sales"],
        queryFn: async () => {
            const res = await axiosSecure.get("/sales");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This sale will be deleted",
            icon: "warning",
            showCancelButton: true,
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.delete(`/sales/${id}`);

            Swal.fire("Deleted!", "", "success");

            // TanStack Query v5 correct syntax for invalidation
            queryClient.invalidateQueries({ queryKey: ["sales"] });
        } catch (error) {
            Swal.fire("Error!", "Failed to delete the sale.", "error");
        }
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-6">

            <h2 className="text-3xl font-bold text-center mb-8 text-orange-500">
                🧾 Sold Products ({sales.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {sales.map((item) => {
                    const currentProfit = item.profit || 0;

                    return (
                        <div key={item._id} className="card shadow p-4">

                            <div className="h-48 bg-gray-100 flex items-center justify-center">
                                <img
                                    src={item.image}
                                    className="h-full w-full object-contain"
                                    alt=""
                                />
                            </div>

                            <h2 className="font-bold text-orange-500 mt-2">
                                {item.productName}
                            </h2>

                            <p className="text-black">Qty: {item.quantity}</p>
                            <p className="text-black">Buy: ৳{item.buyPrice}</p>
                            <p className="text-black">Sell: ৳{item.sellPrice}</p>

                            {/* Conditional styling based on profit */}
                            <p className={`font-bold ${currentProfit >= 0 ? "text-green-600" : "text-red-500"}`}>
                                Profit: ৳{currentProfit}
                            </p>

                            <p className="text-xs text-gray-500">
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleString()
                                    : "No Date"}
                            </p>

                            <button
                                onClick={() => handleDelete(item._id)}
                                className="btn btn-error w-full mt-3 text-white"
                            >
                                Delete
                            </button>

                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default SoldProducts;