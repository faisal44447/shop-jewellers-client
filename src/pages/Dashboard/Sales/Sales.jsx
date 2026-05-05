import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAdmin from "../../../hooks/useAdmin";
import Swal from "sweetalert2";

const Sales = () => {
    const axiosSecure = useAxiosSecure();
    const [sales, setSales] = useState([]);
    const [isAdmin] = useAdmin();

    useEffect(() => {
        axiosSecure.get("/sales")
            .then(res => setSales(res.data))
            .catch(err => console.log(err));
    }, [axiosSecure]);

    // ✅ DELETE FUNCTION
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Delete this sale?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/sales/${id}`)
                    .then(() => {
                        setSales(prev => prev.filter(item => item._id !== id));
                        Swal.fire("Deleted!", "Sale removed.", "success");
                    });
            }
        });
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold mb-4">Sales</h2>

            <table className="table w-full bg-white">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Weight</th>
                        <th>Total</th>
                        {isAdmin && <th>Action</th>}
                    </tr>
                </thead>

                <tbody>
                    {sales.map((item) => (
                        <tr key={item._id}>
                            <td>{item.name}</td>

                            <td>
                                {item.vori}v {item.ana}a {item.rati}r {item.point}p
                            </td>

                            <td>৳ {item.total}</td>

                            {isAdmin && (
                                <td className="flex gap-2">
                                    {/* EDIT */}
                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() => alert("Edit Page banate hobe")}
                                    >
                                        Edit
                                    </button>

                                    {/* DELETE */}
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => handleDelete(item._id)}
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

export default Sales;
