import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Sales = () => {
    const [sales, setSales] = useState([]);

    const fetchSales = async () => {
        const res = await axios.get("http://localhost:5000/sales");
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
            await axios.delete(`http://localhost:5000/sales/${id}`);
            fetchSales();
        }
    };

    return (
        <div>
            <h2>Sales ({sales.length})</h2>

            {sales.map((item) => (
                <div key={item._id} className="card p-4">
                    <h3>{item.name}</h3>
                    <p>৳{item.sellPrice}</p>
                    <p>{item.status}</p>

                    <button onClick={() => handleDelete(item._id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Sales;