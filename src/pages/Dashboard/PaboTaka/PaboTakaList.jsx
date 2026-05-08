import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAdmin from "../../../hooks/useAdmin";
import { formatDateTime } from "../../../utils/formatDateTime";

import {
    FaEdit,
    FaTrash,
    FaMoneyBillWave,
} from "react-icons/fa";

const PaboTakaList = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAdmin] = useAdmin();
    const axiosSecure = useAxiosSecure();

    // ================= FETCH DATA =================
    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await axiosSecure.get(
                "/receivables"
            );

            setList(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        } catch (error) {

            console.error("Fetch error:", error);

            Swal.fire({
                icon: "error",
                title: "Failed to load data",
            });

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ================= DELETE =================
    const handleDelete = async (id) => {

        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the record",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
        });

        if (!confirm.isConfirmed) return;

        try {

            await axiosSecure.delete(
                `/receivables/${id}`
            );

            Swal.fire({
                icon: "success",
                title: "Deleted successfully",
                timer: 1200,
                showConfirmButton: false,
            });

            fetchData();

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Delete failed",
            });

        }
    };

    // ================= EDIT =================
    const handleEdit = async (item) => {

        const { value } = await Swal.fire({
            title: "Edit Pabo Taka",
            html: `
                <input id="name" class="swal2-input" placeholder="Name" value="${item?.name || ""}">
                <input id="amount" type="number" class="swal2-input" placeholder="Amount" value="${item?.amount || 0}">
                <input id="date" type="datetime-local" class="swal2-input">
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {

                return {
                    name:
                        document.getElementById(
                            "name"
                        ).value,

                    amount: Number(
                        document.getElementById(
                            "amount"
                        ).value
                    ),

                    date:
                        document.getElementById(
                            "date"
                        ).value,
                };
            },
        });

        if (value) {

            try {

                await axiosSecure.patch(
                    `/receivables/${item._id}`,
                    value
                );

                Swal.fire({
                    icon: "success",
                    title: "Updated successfully",
                    timer: 1200,
                    showConfirmButton: false,
                });

                fetchData();

            } catch (error) {

                Swal.fire({
                    icon: "error",
                    title: "Update failed",
                });

            }
        }
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">

                <span className="loading loading-spinner loading-lg text-orange-500"></span>

            </div>
        );
    }

    return (
        <div className="p-5 mt-10">

            {/* TITLE */}
            <div className="text-center mb-10">

                <h2 className="text-4xl font-bold text-orange-500 flex justify-center items-center gap-2">

                    <FaMoneyBillWave />

                    Pabo Taka List

                </h2>

                <p className="text-gray-500 mt-2">
                    Total Records: {list.length}
                </p>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow">

                <table className="table">

                    {/* HEAD */}
                    <thead className="bg-orange-100 text-orange-600">

                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date & Time</th>
                            {isAdmin && (
                                <th>Actions</th>
                            )}
                        </tr>

                    </thead>

                    {/* BODY */}
                    <tbody>

                        {list.map((item, index) => {

                            const dt = formatDateTime(
                                item.createdAt
                            );

                            return (
                                <tr
                                    key={item._id}
                                    className="hover"
                                >

                                    <td className="text-black">{index + 1}</td>

                                    <td className="font-medium text-black">
                                        {item?.name}
                                    </td>

                                    <td className="text-green-600 font-semibold">
                                        ৳ {item?.amount}
                                    </td>

                                    <td className="text-black">
                                        {dt?.date}{" "}
                                        <br />
                                        <span className="text-gray-500 text-sm">
                                            {dt?.time}
                                        </span>
                                    </td>

                                    {isAdmin && (
                                        <td>

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            item
                                                        )
                                                    }
                                                    className="btn btn-xs btn-warning"
                                                >

                                                    <FaEdit />

                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            item._id
                                                        )
                                                    }
                                                    className="btn btn-xs btn-error"
                                                >

                                                    <FaTrash />

                                                </button>

                                            </div>

                                        </td>
                                    )}

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default PaboTakaList;