import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ProfitList = () => {
    const [profits, setProfits] = useState([]);
    const axiosSecure = useAxiosSecure();

    const fetchProfits = async () => {
        try {
            const res = await axiosSecure.get("/profits");
            setProfits(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to fetch profits", "error");
        }
    };

    useEffect(() => {
        fetchProfits();
    }, []);

    const handleDeleteProfit = (id) => {
        Swal.fire({
            title: "Delete Profit?",
            text: "This will reduce cash too!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/profits/${id}`);
                    fetchProfits();
                    Swal.fire("Deleted!", "Profit removed.", "success");
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "Failed to delete profit.", "error");
                }
            }
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "No date";
        const d = new Date(dateString);
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${hours}:${minutes} ${ampm}`;
    };

    return (
        <div className="p-6 mt-10">
            <h2 className="text-3xl font-bold text-center mb-6">💸 Profit List</h2>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Note</th>
                            <th>Amount</th>
                            <th>Date & Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {profits.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.note || "-"}</td>
                                <td className="text-green-600 font-bold">৳ {item.amount}</td>
                                <td>{formatDateTime(item.createdAt)}</td>
                                <td>
                                    <button
                                        className="btn btn-error btn-xs"
                                        onClick={() => handleDeleteProfit(item._id)}
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

export default ProfitList;