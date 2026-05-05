import { useEffect, useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAdmin from "../../../hooks/useAdmin";
import { formatDateTime } from "../../../utils/formatDateTime.js";

const ProfitList = () => {
    const [profits, setProfits] = useState([]);
    const axiosSecure = useAxiosSecure();
    const [isAdmin] = useAdmin();

    // LOAD PROFITS
    const fetchProfits = async () => {
        try {
            const res = await axiosSecure.get("/profits");
            setProfits(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            Swal.fire("Error", "Failed to load profits", "error");
        }
    };

    useEffect(() => {
        fetchProfits();
    }, [axiosSecure]);

    // DELETE
    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Profit?",
            icon: "warning",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.delete(`/profits/${id}`).catch(() => {
                    Swal.fire("Error", "Delete failed", "error");
                });
                fetchProfits();
                Swal.fire("Deleted!", "Profit deleted", "success");
            }
        });

    };

    // EDIT
    const handleEdit = async (item) => {
        const { value } = await Swal.fire({
            title: "Edit Profit",
            html: `
                <input id="note" class="swal2-input" placeholder="Note" value="${item.note || ""}">
                <input id="amount" type="number" class="swal2-input" value="${item.amount}">
            `,
            showCancelButton: true,
            preConfirm: () => ({
                note: document.getElementById("note").value,
                amount: Number(document.getElementById("amount").value)
            })
        });

        if (value) {
            await axiosSecure.patch(`/profits/${item._id}`, value);
            fetchProfits();
            Swal.fire("Updated!", "Profit updated", "success");
        }
    };

    return (
        <div className="p-6 mt-10">

            <h2 className="text-3xl font-bold text-center mb-6">
                💸 Profit List
            </h2>

            <div className="overflow-x-auto">

                <table className="table w-full">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Note</th>
                            <th>Amount</th>
                            <th>Date & Time</th>
                            {isAdmin && <th>Action</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {profits.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    ❌ No Profit Data
                                </td>
                            </tr>
                        ) : (
                            profits.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.note || "—"}</td>

                                    <td className="text-green-600 font-bold">
                                        ৳ {item.amount}
                                    </td>

                                    <td>
                                        {(() => {
                                            const dt = formatDateTime(item.createdAt);
                                            return (
                                                <>
                                                    {dt.date} <br />
                                                    {dt.time}
                                                </>
                                            );
                                        })()}
                                    </td>
                                    {isAdmin && (
                                        <td className="flex gap-2">

                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="btn btn-warning btn-xs"
                                            >
                                                <FaEdit />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="btn btn-error btn-xs"
                                            >
                                                <FaTrashAlt />
                                            </button>

                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default ProfitList;