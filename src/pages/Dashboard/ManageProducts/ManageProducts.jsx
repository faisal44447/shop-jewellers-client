import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { formatDateTime } from "../../../utils/formatDateTime";

const ManageProducts = () => {
    const axiosSecure = useAxiosSecure();

    const { data: products = [], refetch } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products");
            return res.data;
        },
    });

    // ================= EDIT =================
    const handleEdit = async (product) => {
        const oldDate = product.createdAt
            ? new Date(product.createdAt)
            : null;

        const defaultDate = oldDate
            ? oldDate.toISOString().slice(0, 10)
            : "";

        const defaultTime = oldDate
            ? oldDate.toTimeString().slice(0, 5)
            : "";

        const { value: formValues } = await Swal.fire({
            title: `Edit ${product.name}`,
            html:
                `<input id="name" class="swal2-input" value="${product.name || ""}" />` +
                `<input id="price" type="number" class="swal2-input" value="${product.sellPrice || 0}" />` +
                `<input id="stock" type="number" class="swal2-input" value="${product.stock || 0}" />` +
                `<input id="date" type="date" class="swal2-input" value="${defaultDate}" />` +
                `<input id="time" type="time" class="swal2-input" value="${defaultTime}" />`,
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById("name").value;
                const price = document.getElementById("price").value;
                const stock = document.getElementById("stock").value;
                const date = document.getElementById("date").value;
                const time = document.getElementById("time").value;

                if (!name || !price || !stock) {
                    Swal.showValidationMessage("All fields are required!");
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

        if (!formValues) return;

        await axiosSecure.patch(`/products/${product._id}`, formValues);

        Swal.fire({
            icon: "success",
            title: "Updated!",
            text: `${product.name} updated successfully`,
            timer: 1500,
            showConfirmButton: false,
        });

        refetch();
    };

    // ================= DELETE =================
    const handleDelete = async (product) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Delete "${product.name}"? This action cannot be undone!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/products/${product._id}`);

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: `${product.name} deleted successfully`,
                    timer: 1500,
                    showConfirmButton: false,
                });

                refetch();
            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete product",
                });
            }
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Manage Products  ({products.length})</h2>
            <table className="table w-full">
                <thead>
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
                        const formatted = formatDateTime(p.createdAt);

                        return (
                            <tr key={p._id}>
                                <td>{p.name}</td>
                                <td>{p.stock ?? 0}</td>

                                {/* 🔥 FIXED PRICE */}
                                <td>৳ {Number(p.sellPrice ?? p.price ?? 0)}</td>

                                <td>{formatted?.date || "-"}</td>
                                <td>{formatted?.time || "-"}</td>

                                <td className="space-x-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="btn btn-sm btn-info"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(p)}
                                        className="btn btn-sm btn-error"
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
    );
};

export default ManageProducts;