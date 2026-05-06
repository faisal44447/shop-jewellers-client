import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAdmin from "../../../hooks/useAdmin";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useState } from "react";

const ProfitList = () => {
    const axiosSecure = useAxiosSecure();
    const [isAdmin] = useAdmin();

    const [editItem, setEditItem] = useState(null);
    const [editAmount, setEditAmount] = useState("");
    const [editNote, setEditNote] = useState("");

    // GET PROFITS
    const { data: profits = [], refetch, isLoading } = useQuery({
        queryKey: ["profits"],
        queryFn: async () => {
            const res = await axiosSecure.get("/profits");
            return res.data;
        },
    });

    // DELETE
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This profit will be deleted!",
            icon: "warning",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/profits/${id}`).then((res) => {
                    if (res.data.success) {
                        Swal.fire("Deleted!", "Profit removed", "success");
                        refetch();
                    }
                });
            }
        });
    };

    // UPDATE
    const handleUpdate = async () => {
        try {
            const res = await axiosSecure.patch(`/profits/${editItem._id}`, {
                amount: Number(editAmount),
                note: editNote,
            });

            if (res.data.success) {
                Swal.fire("Success", "Profit updated", "success");
                setEditItem(null);
                refetch();
            }
        } catch (err) {
            Swal.fire("Error", "Update failed", "error");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-5">

            <h2 className="text-3xl font-bold mb-5 text-center">
                💸 Profit List ({profits.length})
            </h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Note</th>
                            <th>Amount</th>
                            <th>Date</th>
                            {isAdmin && <th>Action</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {profits.map((p, index) => (
                            <tr key={p._id}>
                                <td>{index + 1}</td>
                                <td>{p.note}</td>
                                <td>৳{p.amount}</td>
                                <td>{new Date(p.createdAt).toLocaleString()}</td>

                                {/* ADMIN ONLY ACTION */}
                                {isAdmin && (
                                    <td className="flex gap-2">

                                        {/* EDIT */}
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => {
                                                setEditItem(p);
                                                setEditAmount(p.amount);
                                                setEditNote(p.note);
                                            }}
                                        >
                                            <FaEdit />
                                        </button>

                                        {/* DELETE */}
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleDelete(p._id)}
                                        >
                                            <FaTrash />
                                        </button>

                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= EDIT MODAL ================= */}
            {editItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded w-96">

                        <h2 className="text-xl font-bold mb-3">Edit Profit</h2>

                        <input
                            className="input input-bordered w-full mb-2"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            placeholder="Amount"
                        />

                        <input
                            className="input input-bordered w-full mb-2"
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            placeholder="Note"
                        />

                        <div className="flex justify-between mt-4">

                            <button
                                className="btn btn-success"
                                onClick={handleUpdate}
                            >
                                Save
                            </button>

                            <button
                                className="btn btn-error"
                                onClick={() => setEditItem(null)}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfitList;