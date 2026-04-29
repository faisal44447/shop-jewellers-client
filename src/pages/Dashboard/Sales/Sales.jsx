import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Sales = () => {
    const axiosSecure = useAxiosSecure();
    const [sales, setSales] = useState([]);

    const fetchSales = async () => {
        const res = await axiosSecure.get("/sales");
        setSales(res.data);
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete?",
            icon: "warning",
            showCancelButton: true,
        });

        if (confirm.isConfirmed) {
            await axiosSecure.delete(`/sales/${id}`);
            fetchSales();
            Swal.fire("Deleted!", "Sale removed", "success");
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-5">
                Sales ({sales.length})
            </h2>

            <div className="grid gap-4">
                {sales.map((item) => (
                    <div key={item._id} className="card p-4 shadow">
                        <h3 className="font-bold">{item.name}</h3>

                        <p>Sell: ৳{item.sellPrice}</p>
                        <p className="text-green-600">
                            Profit: ৳{item.profit}
                        </p>

                        <p>Status: {item.status}</p>

                        <button
                            onClick={() => handleDelete(item._id)}
                            className="btn btn-error mt-2"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sales;