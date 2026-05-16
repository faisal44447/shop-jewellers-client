import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAdmin from "../../../hooks/useAdmin";

const ExpenseList = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin] = useAdmin();
    const axiosSecure = useAxiosSecure();

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await axiosSecure.get("/expenses");
            setList(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Fetch error:", error);
            Swal.fire({ icon: "error", title: "Failed to load expenses" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This expense will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.delete(`/expenses/${id}`);
            Swal.fire({ icon: "success", title: "Deleted successfully", timer: 1200, showConfirmButton: false });
            fetchExpenses();
        } catch (error) {
            Swal.fire({ icon: "error", title: "Delete failed" });
        }
    };

    const handleEdit = async (item) => {
        let localDateString = "";
        if (item?.createdAt) {
            const d = new Date(item.createdAt);
            const pad = (num) => String(num).padStart(2, "0");
            localDateString = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }

        const { value } = await Swal.fire({
            title: "✏️ Edit Expense",
            html: `
                <input id="swal-title" class="swal2-input" value="${item.title}" placeholder="Title">
                <input id="swal-amount" type="number" class="swal2-input" value="${item.amount}" placeholder="Amount">
                <input id="swal-date" type="datetime-local" class="swal2-input" value="${localDateString}">
            `,
            showCancelButton: true,
            confirmButtonText: "Update",
            focusConfirm: false,
            preConfirm: () => {
                const title = document.getElementById("swal-title").value.trim();
                const amount = document.getElementById("swal-amount").value;
                const dateVal = document.getElementById("swal-date").value;

                if (!title || !amount) {
                    Swal.showValidationMessage("Title and Amount are required!");
                    return false;
                }

                return {
                    title: title,
                    amount: Number(amount),
                    createdAt: dateVal ? new Date(dateVal).toISOString() : new Date().toISOString(), // ISO Format এ পাঠানো নিরাপদ
                };
            },
        });

        if (!value) return;

        try {
            // আপনার কোডে এখানে patch ছিল, ব্যাকএন্ডে patch/put যেটা সাপোর্ট করে সেটাই রাখবেন
            await axiosSecure.patch(`/expenses/${item._id}`, value); 
            Swal.fire({ icon: "success", title: "Updated successfully", timer: 1200, showConfirmButton: false });
            fetchExpenses();
        } catch (error) {
            Swal.fire({ icon: "error", title: "Update failed" });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    return (
        <div className="p-5">
            <h2 className="text-3xl font-bold mb-10 text-center text-red-500">💸 Expense List ({list.length})</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="table">
                    <thead className="bg-red-100 text-red-600">
                        <tr>
                            <th>#</th>
                            <th className="text-orange-500">Title</th>
                            <th>Amount</th>
                            <th className="text-orange-500">Date & Time</th>
                            {isAdmin && <th>Edit</th>}
                            {isAdmin && <th>Delete</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item, i) => (
                            <tr key={item._id} className="hover">
                                <td className="text-black">{i + 1}</td>
                                <td className="text-black font-bold">{item.title}</td>
                                <td className="text-red-500 font-bold">৳ {item.amount}</td>
                                <td className="text-black">
                                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : "No Date"}
                                </td>
                                {isAdmin && (
                                    <td>
                                        <button onClick={() => handleEdit(item)} className="btn btn-xs btn-warning"><FaEdit /></button>
                                    </td>
                                )}
                                {isAdmin && (
                                    <td>
                                        <button onClick={() => handleDelete(item._id)} className="btn btn-xs btn-error"><FaTrash /></button>
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