import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import useAdmin from "../../../hooks/useAdmin";
import Swal from "sweetalert2";

const formatDateTime = (date) => {
    if (!date) return "No Date";
    return new Date(date).toLocaleString();
};

const HowladList = () => {
    const axiosSecure = useAxiosSecure();
    const [list, setList] = useState([]);
    const [isAdmin] = useAdmin();

    const fetchData = async () => {
        const res = await axiosSecure.get("/transactions");
        setList(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 🗑 DELETE FUNCTION (ADMIN ONLY)
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete transaction!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        });

        if (confirm.isConfirmed) {
            await axiosSecure.delete(`/transactions/${id}`);
            Swal.fire("Deleted!", "Transaction removed", "success");
            fetchData();
        }
    };

    return (
        <div className="p-5">

            <h2 className="text-xl font-bold mb-4">
                Howlad List
            </h2>

            <table className="table w-full">

                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>

                        {/* 👇 ONLY ADMIN HEADER */}
                        {isAdmin && <th>Action</th>}
                    </tr>
                </thead>

                <tbody>
                    {list.map((item, i) => (
                        <tr key={item._id} className="hover:bg-gray-50">

                            <td>{i + 1}</td>
                            <td>{item.name}</td>

                            <td>
                                {item.type === "loan"
                                    ? "➕ Howlad Nise"
                                    : "➖ Howlad Dise"}
                            </td>

                            <td className={item.type === "loan" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                ৳ {item.amount}
                            </td>

                            <td>
                                {formatDateTime(item.createdAt)}
                            </td>

                            {/* 👇 ONLY ADMIN BUTTON */}
                            {isAdmin && (
                                <td>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="btn btn-sm btn-error text-white"
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}

                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default HowladList;