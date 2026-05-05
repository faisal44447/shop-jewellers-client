import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { formatDateTime } from "../../../utils/formatDateTime";
import useAdmin from "../../../hooks/useAdmin";

const PaboTakaList = () => {
    const [list, setList] = useState([]);
    const [isAdmin] = useAdmin();
    const axiosSecure = useAxiosSecure();

    const fetchData = async () => {
        const res = await axiosSecure.get("/receivables");
        setList(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // DELETE
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
        });

        if (confirm.isConfirmed) {
            await axiosSecure.delete(`/receivables/${id}`);
            fetchData();
        }
    };

    // EDIT
    const handleEdit = async (item) => {
        const currentDate = item.createdAt
            ? new Date(item.createdAt).toISOString().slice(0, 16)
            : "";

        const { value } = await Swal.fire({
            title: "Edit Data",
            html: `
                <input id="name" class="swal2-input" value="${item.name}">
                <input id="amount" type="number" class="swal2-input" value="${item.amount}">
                <input id="date" type="datetime-local" class="swal2-input" value="${currentDate}">
            `,
            preConfirm: () => ({
                name: document.getElementById("name").value,
                amount: Number(document.getElementById("amount").value),
                date: document.getElementById("date").value
            })
        });

        if (value) {
            await axiosSecure.patch(`/receivables/${item._id}`, value);
            fetchData();
        }
    };

    return (
        <div className="p-5 mt-10">
            <h2 className="text-2xl font-bold mb-4">📋 Pabo Taka List</h2>

            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date & Time</th>
                        {isAdmin && <th>Action</th>}
                    </tr>
                </thead>

                <tbody>
                    {list.map((item, index) => {
                        const dt = formatDateTime(item.createdAt);

                        return (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>৳ {item.amount}</td>

                                <td>
                                    {dt.date} <br />
                                    {dt.time}
                                </td>

                                {isAdmin && (
                                    <td>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="btn btn-xs btn-warning mr-2"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="btn btn-xs btn-error"
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
    );
};

export default PaboTakaList;