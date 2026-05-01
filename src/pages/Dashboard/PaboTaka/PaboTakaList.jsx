import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAdmin from "../../../hooks/useAdmin";

const PaboTakaList = () => {
    const [isAdmin] = useAdmin();
    const [list, setList] = useState([]);
    const axiosSecure = useAxiosSecure();

    // LOAD DATA
    const fetchPabo = async () => {
        try {
            const res = await axiosSecure.get("/receivables");
            setList(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPabo();
    }, []);

    // EDIT
    const handleEdit = async (item) => {
        const name = prompt("Edit Name", item.name);
        const amount = prompt("Edit Amount", item.amount);

        if (!name || !amount) return;

        try {
            const res = await axiosSecure.patch(`/receivables/${item._id}`, {
                name,
                amount: Number(amount)
            });

            if (res.data.success) {
                Swal.fire("Updated!", "Data updated successfully", "success");
                fetchPabo();
            }

        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Update failed", "error");
        }
    };

    // DELETE
    const handleDeletePabo = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/receivables/${id}`);

            if (res.data?.success || res.data?.deletedCount > 0) {
                Swal.fire("Deleted!", "Item removed successfully", "success");
                fetchPabo();
            }

        } catch (error) {
            console.log(error);
            Swal.fire("Error", "Delete failed", "error");
        }
    };

    return (
        <div className="p-5 mt-10">
            <h2 className="text-2xl font-bold mb-4">📋 Pabo Taka List</h2>

            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {list.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>৳ {item.amount}</td>

                                <td>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleString()
                                        : "No Date"}
                                </td>

                                <td>
                                    {isAdmin && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="btn btn-xs btn-warning mr-2"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDeletePabo(item._id)}
                                                className="btn btn-xs btn-error"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default PaboTakaList;