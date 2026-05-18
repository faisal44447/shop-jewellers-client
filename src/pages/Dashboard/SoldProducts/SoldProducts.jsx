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
            text: "This sale will be deleted and stock will revert!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!"
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.delete(`/sales/${id}`);
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                timer: 1200,
                showConfirmButton: false
            });

            // cache invalidation
            queryClient.invalidateQueries({ queryKey: ["sales"] });
        } catch (error) {
            Swal.fire("Error!", "Failed to delete the sale.", "error");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-orange-500"> 🧾 Sold Products ({sales.length}) </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sales.map((item) => {
                    const currentProfit = item.profit || 0;
                    return (
                        <div key={item._id} className="card bg-base-100 shadow-xl border border-gray-200 p-4 rounded-2xl">
                            <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                                <img src={item.image || "https://via.placeholder.com/150"} className="h-full w-full object-contain" alt="" />
                            </div>
                            <h2 className="font-bold text-orange-500 mt-3 text-lg truncate"> {item.productName} </h2>
                            <div className="space-y-1 mt-2 text-sm text-gray-700">
                                <p>Quantity: <span className="font-semibold text-black">{item.quantity}</span></p>
                                <p>Buying Price: <span className="font-semibold text-black">৳{item.buyPrice}</span></p>
                                <p>Selling Price: <span className="font-semibold text-black">৳{item.sellPrice}</span></p>
                                <p className={`font-bold ${currentProfit >= 0 ? "text-green-600" : "text-red-500"}`}>
                                    Profit: ৳{currentProfit}
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                                <p className="text-[11px] text-gray-400">
                                    📅 {item.createdAt ? new Date(item.createdAt).toLocaleString("bn-BD") : "No Date"}
                                </p>
                                <button onClick={() => handleDelete(item._id)} className="btn btn-error btn-sm text-white px-4 rounded-lg" >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SoldProducts;