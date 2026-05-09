import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAdmin from "../../../hooks/useAdmin";

import { FaTrash, FaMoneyBillWave } from "react-icons/fa";

const HowladList = () => {
    const axiosSecure = useAxiosSecure();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAdmin] = useAdmin();

    // ================= FETCH DATA =================
    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await axiosSecure.get("/transactions");

            setList(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        } catch (error) {
            console.error(error);

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
            text: "This transaction will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.delete(`/transactions/${id}`);

            Swal.fire({
                icon: "success",
                title: "Deleted Successfully",
                timer: 1200,
                showConfirmButton: false,
            });

            fetchData();

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
            });
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
        <div className="p-5">

            {/* TITLE */}
            <h2 className="text-4xl font-bold mb-10 text-center text-orange-500 flex justify-center items-center gap-2">

                <FaMoneyBillWave />

                Howlad List ({list.length})

            </h2>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow">

                <table className="table">

                    <thead className="bg-orange-100 text-orange-600">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Date</th>
                            {isAdmin && <th>Action</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {list.map((item, i) => (
                            <tr key={item._id} className="hover">

                                <td className="text-black">{i + 1}</td>

                                <td className="font-medium text-black">
                                    {item.name}
                                </td>

                                <td>
                                    {item.type === "loan" ? (
                                        <span className="text-green-600 font-semibold">
                                            ➕ Howlad Nise
                                        </span>
                                    ) : (
                                        <span className="text-red-500 font-semibold">
                                            ➖ Howlad Dise
                                        </span>
                                    )}
                                </td>

                                <td
                                    className={
                                        item.type === "loan"
                                            ? "text-green-600 font-bold"
                                            : "text-red-500 font-bold"
                                    }
                                >
                                    ৳ {item.amount}
                                </td>

                                <td className="text-black">
                                    {item.createdAt
                                        ? new Date(
                                            item.createdAt
                                        ).toLocaleString()
                                        : "No Date"}
                                </td>

                                {isAdmin && (
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    item._id
                                                )
                                            }
                                            className="btn btn-xs btn-error text-white"
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

        </div>
    );
};

export default HowladList;