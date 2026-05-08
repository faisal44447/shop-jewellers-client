import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { formatDateTime } from "../../../utils/formatDateTime";

const ManageProducts = () => {
    const axiosSecure = useAxiosSecure();

    // ================= FETCH =================
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

    // ================= EDIT =================
    const handleEdit = async (product) => {
        const oldDate = product?.createdAt
            ? new Date(product.createdAt)
            : null;

        const defaultDate = oldDate
            ? oldDate.toISOString().slice(0, 10)
            : "";

        const defaultTime = oldDate
            ? oldDate.toTimeString().slice(0, 5)
            : "";

        const { value } = await Swal.fire({
            title: `✏️ Edit ${product.name}`,
            html: `
                <input id="name" class="swal2-input" value="${product.name || ""}" placeholder="Name">
                <input id="price" type="number" class="swal2-input" value="${product.sellPrice || 0}" placeholder="Price">
                <input id="stock" type="number" class="swal2-input" value="${product.stock || 0}" placeholder="Stock">
                <input id="date" type="date" class="swal2-input" value="${defaultDate}">
                <input id="time" type="time" class="swal2-input" value="${defaultTime}">
            `,
            showCancelButton: true,
            confirmButtonText: "Update",
            preConfirm: () => {
                const name = document.getElementById("name").value;
                const price = document.getElementById("price").value;
                const stock = document.getElementById("stock").value;
                const date = document.getElementById("date").value;
                const time = document.getElementById("time").value;

                if (!name || !price || !stock) {
                    Swal.showValidationMessage("All fields are required");
                    return;
                }

                return {
                    name,
                    sellPrice: Number(price),
                    stock: Number(stock),
                    createdAt:
                        date && time
                            ? new Date(`${date}T${time}`)
                            : product.createdAt,
                };
            },
        });

        if (!value) return;

        try {
            await axiosSecure.patch(
                `/products/${product._id}`,
                value
            );

            Swal.fire({
                icon: "success",
                title: "Updated Successfully",
                timer: 1200,
                showConfirmButton: false,
            });

            refetch();

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
            });
        }
    };

    // ================= DELETE =================
    const handleDelete = async (product) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: `Delete "${product.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.delete(
                `/products/${product._id}`
            );

            Swal.fire({
                icon: "success",
                title: "Deleted Successfully",
                timer: 1200,
                showConfirmButton: false,
            });

            refetch();

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
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
        );
    }

    return (
        <div className="p-5">

            {/* TITLE */}
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">
                📦 Manage Products ({products.length})
            </h2>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">

                <table className="table">

                    <thead className="bg-blue-100 text-blue-600">
                        <tr>
                            <th>Name</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((p) => {
                            const formatted =
                                formatDateTime(
                                    p.createdAt
                                );

                            return (
                                <tr key={p._id} className="hover">

                                    <td className="font-medium text-orange-500">
                                        {p.name}
                                    </td>

                                    <td className="text-black">{p.stock ?? 0}</td>

                                    <td className="text-green-600 font-bold">
                                        ৳{" "}
                                        {Number(
                                            p.sellPrice ??
                                            p.price ??
                                            0
                                        )}
                                    </td>

                                    <td className="text-black">
                                        {formatted?.date ||
                                            "-"}
                                    </td>

                                    <td className="text-black">
                                        {formatted?.time ||
                                            "-"}
                                    </td>

                                    <td className="flex gap-2">

                                        <button
                                            onClick={() =>
                                                handleEdit(p)
                                            }
                                            className="btn btn-xs btn-info"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(p)
                                            }
                                            className="btn btn-xs btn-error"
                                        >
                                            Delete
                                        </button>

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

export default ManageProducts;