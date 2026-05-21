import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Sales = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // ================= FETCH SALES =================
    const { data: sales = [], isLoading, isError } = useQuery({
        queryKey: ["sales"],
        queryFn: async () => {
            const res = await axiosSecure.get("/sales");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    // ================= DELETE =================
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This sale will be deleted and dashboard stats will update!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.delete(`/sales/${id}`);
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                timer: 1200,
                showConfirmButton: false,
            });

            // ✨ FIX: ক্যাশ, প্রফিট এবং সেলস লিস্ট সব একসাথে রিফ্রেশ করবে
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardAdminData"] });
            queryClient.invalidateQueries({ queryKey: ["dashboardUserData"] });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <p className="text-center text-red-500 mt-10">
                ❌ Failed to load sales data
            </p>
        );
    }

    return (
        <div className="p-5">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
                🛒 Sales List ({sales.length})
            </h2>

            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="table">
                    <thead className="bg-blue-100 text-blue-600">
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Profit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((s) => (
                            <tr key={s._id} className="hover">
                                <td className="flex items-center gap-3">
                                    <img
                                        src={s.image || "https://via.placeholder.com/50"}
                                        alt={s.productName}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                    <span className="font-medium text-black">
                                        {s.productName}
                                    </span>
                                </td>
                                <td className="text-black">{s.quantity}</td>
                                <td className={`font-bold ${s.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    ৳ {(s.profit || 0).toLocaleString("en-BD")}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(s._id)}
                                        className="btn btn-sm btn-error text-white"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sales;