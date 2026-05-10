import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CashList = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [editItem, setEditItem] = useState(null);

    // ================= GET CASH =================
    const { data: cashList = [], isLoading } = useQuery({
        queryKey: ["cash-list"],
        queryFn: async () => {
            const res = await axiosSecure.get("/cash-list");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    // ================= DELETE =================
    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/cash-list/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["cash-list"]);
            Swal.fire("Deleted", "Cash removed", "success");
        },
    });

    // ================= UPDATE =================
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) =>
            axiosSecure.patch(`/cash-list/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["cash-list"]);
            Swal.fire("Updated", "Cash updated", "success");
            setEditItem(null);
        },
    });

    const handleUpdate = () => {
        updateMutation.mutate({
            id: editItem._id,
            data: {
                title: editItem.title,
                amount: Number(editItem.amount),
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner text-green-500"></span>
            </div>
        );
    }

    return (
        <div className="p-5 bg-white rounded-xl shadow">

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">

                <table className="table w-full">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cashList.map((item, i) => (
                            <tr key={item._id} className="hover">

                                <td className="text-black">{i + 1}</td>

                                <td className="font-medium text-orange-500">
                                    {item.title}
                                </td>

                                <td className="text-green-600 font-bold">
                                    ৳{Number(item.amount).toLocaleString("en-BD")}
                                </td>

                                <td className="text-black">
                                    {item.date ||
                                        new Date(item.createdAt).toLocaleDateString()}
                                </td>

                                <td className="text-black text-sm">
                                    {item.time ||
                                        new Date(item.createdAt).toLocaleTimeString()}
                                </td>

                                {/* ACTION */}
                                <td className="flex gap-2">

                                    <button
                                        onClick={() => setEditItem(item)}
                                        className="btn btn-xs bg-blue-500 text-white"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            Swal.fire({
                                                title: "Delete?",
                                                icon: "warning",
                                                showCancelButton: true,
                                            }).then((res) => {
                                                if (res.isConfirmed) {
                                                    deleteMutation.mutate(item._id);
                                                }
                                            })
                                        }
                                        className="btn btn-xs bg-red-500 text-white"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

            {/* ================= EDIT MODAL ================= */}
            {editItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

                    <div className="bg-white p-5 rounded w-96">

                        <h2 className="text-xl font-bold mb-3">
                            Edit Cash
                        </h2>

                        <input
                            className="input input-bordered w-full mb-3"
                            value={editItem.title}
                            onChange={(e) =>
                                setEditItem({
                                    ...editItem,
                                    title: e.target.value,
                                })
                            }
                        />

                        <input
                            type="number"
                            className="input input-bordered w-full mb-3"
                            value={editItem.amount}
                            onChange={(e) =>
                                setEditItem({
                                    ...editItem,
                                    amount: e.target.value,
                                })
                            }
                        />

                        <div className="flex justify-between">

                            <button
                                onClick={() => setEditItem(null)}
                                className="btn btn-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdate}
                                className="btn btn-sm bg-green-500 text-white"
                            >
                                Update
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default CashList;