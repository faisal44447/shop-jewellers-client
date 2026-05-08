import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Products = () => {
    const axiosSecure = useAxiosSecure();

    // ================= FETCH PRODUCTS =================
    const {
        data: products = [],
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    // ================= DELETE =================
    const handleDelete = async (product) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: `Delete "${product.name}"? This action cannot be undone!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(
                `/products/${product._id}`
            );

            if (res.data?.deletedCount || res.data?.success) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: `${product.name} deleted successfully`,
                    timer: 1200,
                    showConfirmButton: false,
                });

                refetch();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Delete Failed",
            });
        }
    };

    // ================= LOADING =================
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    return (
        <div className="p-5 mt-10">

            {/* TITLE */}
            <h2 className="text-3xl font-bold text-center mb-8">
                📦 All Products ({products.length})
            </h2>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">

                <table className="table">

                    <thead className="bg-gray-100">
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Karat</th>
                            <th>Weight</th>
                            <th>Buy Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((item, index) => (
                            <tr key={item._id} className="hover">

                                <td>{index + 1}</td>

                                <td>
                                    <div className="avatar">
                                        <div className="w-12 rounded">
                                            <img src={item.image} alt="product" />
                                        </div>
                                    </div>
                                </td>

                                <td className="font-medium">
                                    {item.name}
                                </td>

                                <td>{item.karat}</td>

                                <td>
                                    {item.vori} ভরি{" "}
                                    {item.ana} আনা{" "}
                                    {item.rati} রতি{" "}
                                    {item.point} পয়েন্ট
                                </td>

                                <td className="text-green-600 font-bold">
                                    ৳ {item.buyPrice}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleDelete(item)
                                        }
                                        className="btn btn-sm btn-error text-white"
                                    >
                                        <FaTrashAlt />
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

export default Products;