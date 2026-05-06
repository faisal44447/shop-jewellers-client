import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAdmin from "../../../hooks/useAdmin";

const ExpenseList = () => {
    const [list, setList] = useState([]);
    const [isAdmin] = useAdmin();

    const fetchExpenses = async () => {
        const res = await axios.get("http://localhost:5000/expenses");
        setList(res.data);
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // ❌ DELETE
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This expense will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (confirm.isConfirmed) {
            await axios.delete(`http://localhost:5000/expenses/${id}`);

            await Swal.fire({
                title: "Deleted!",
                text: "Expense removed",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            fetchExpenses();
        }
    };

    // ✏️ EDIT
    const handleEdit = async (item) => {
        const currentDate = item.createdAt
            ? new Date(item.createdAt).toISOString().slice(0, 16)
            : "";

        const { value: formValues } = await Swal.fire({
            title: "✏️ Edit Expense",
            html:
                `<input id="title" class="swal2-input" value="${item.title}" placeholder="Title">` +
                `<input id="amount" class="swal2-input" value="${item.amount}" placeholder="Amount">` +
                `<input id="date" type="datetime-local" class="swal2-input" value="${currentDate}">`,
            showCancelButton: true,
            confirmButtonText: "Update",
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: document.getElementById("title").value,
                    amount: Number(document.getElementById("amount").value),
                    createdAt: new Date(document.getElementById("date").value)
                };
            }
        });

        if (formValues) {
            await axios.patch(
                `https://jewellers-shop-server.vercel.app/expenses/${item._id}`,
                formValues
            );

            await Swal.fire({
                title: "Updated!",
                text: "Expense updated successfully",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            fetchExpenses();
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-3xl font-bold mb-10 text-center">💸 Expense List  ({list.length})</h2>

            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Date & Time</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {list.map((item, i) => (
                            <tr key={item._id}>
                                <th>{i + 1}</th>
                                <td>{item.title}</td>
                                <td>৳ {item.amount}</td>

                                <td>
                                    {item.createdAt
                                        ? (() => {
                                            const d = new Date(item.createdAt);
                                            const day = d.getDate().toString().padStart(2, "0");
                                            const month = (d.getMonth() + 1).toString().padStart(2, "0");
                                            const year = d.getFullYear();

                                            let hours = d.getHours();
                                            const minutes = d.getMinutes().toString().padStart(2, "0");
                                            const ampm = hours >= 12 ? "PM" : "AM";
                                            hours = hours % 12 || 12; // 0 হলে 12

                                            return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
                                        })()
                                        : item.date
                                            ? (() => {
                                                const d = new Date(item.date);
                                                const day = d.getDate().toString().padStart(2, "0");
                                                const month = (d.getMonth() + 1).toString().padStart(2, "0");
                                                const year = d.getFullYear();
                                                let hours = d.getHours();
                                                const minutes = d.getMinutes().toString().padStart(2, "0");
                                                const ampm = hours >= 12 ? "PM" : "AM";
                                                hours = hours % 12 || 12;
                                                return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
                                            })()
                                            : "No Date"}
                                </td>

                                {isAdmin && (
                                    <td>
                                        <button onClick={() => handleEdit(item)} className="btn btn-xs btn-warning">
                                            <FaEdit />
                                        </button>
                                    </td>
                                )}

                                {isAdmin && (
                                    <td>
                                        <button onClick={() => handleDelete(item._id)} className="btn btn-xs btn-error">
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

export default ExpenseList;