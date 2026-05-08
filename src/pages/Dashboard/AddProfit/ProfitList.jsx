import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAdmin from "../../../hooks/useAdmin";
import { formatDateTime } from "../../../utils/formatDateTime";

const ProfitList = () => {
    const axiosSecure = useAxiosSecure();
    const [profits, setProfits] = useState([]);
    const [isAdmin] = useAdmin();

    // ================= FETCH =================
    const fetchProfits = async () => {
        try {
            const res = await axiosSecure.get("/profits");
            setProfits(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log("Fetch error:", error);
        }
    };

    useEffect(() => {
        fetchProfits();
    }, []);

    // ================= DELETE =================
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This profit will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes delete",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.delete(`/profits/${id}`);

            Swal.fire({
                icon: "success",
                title: "Deleted successfully",
                timer: 1200,
                showConfirmButton: false,
            });

            fetchProfits();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
            });
        }
    };

    // ================= TOTAL =================
    const totalProfit = profits.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
    );

    return (
        <div className="p-5">

            {/* HEADER */}
            <h2 className="text-3xl font-bold text-center mb-6 text-green-500">
                💰 Profit List ({profits.length})
            </h2>

            {/* TOTAL */}
            <div className="text-center mb-6">
                <span className="badge badge-success p-3 text-white text-lg">
                    Total Profit: ৳ {totalProfit}
                </span>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="table w-full">

                    <thead>
                        <tr className="text-green-500">
                            <th>#</th>
                            <th>Amount</th>
                            <th>Note</th>
                            <th>Date & Time</th>
                            {isAdmin && <th>Action</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {profits.map((item, index) => {
                            const dt = formatDateTime(item.createdAt);

                            return (
                                <tr key={item._id} className="hover">

                                    <td className="text-black">{index + 1}</td>

                                    <td className="text-green-600 font-bold">
                                        ৳ {item.amount}
                                    </td>

                                    <td className="text-orange-600">
                                        {item.note || "-"}
                                    </td>

                                    <td className="text-black">
                                        {dt?.date} <br />
                                        {dt?.time}
                                    </td>

                                    {isAdmin && (
                                        <td>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="btn btn-xs btn-error text-white"
                                            >
                                                Delete
                                            </button>
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

export default ProfitList;