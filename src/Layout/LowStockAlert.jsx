import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const LowStockAlert = () => {
    const axiosSecure = useAxiosSecure();
    const [items, setItems] = useState([]);

    useEffect(() => {
        axiosSecure.get("/products/low-stock")
            .then(res => setItems(res.data));
    }, []);

    return (
        <div className="p-5">

            <h2 className="text-xl font-bold text-red-500 mb-4">
                ⚠️ Low Stock Alert
            </h2>

            {items.length === 0 ? (
                <p>All stock OK</p>
            ) : (
                <ul className="space-y-2">
                    {items.map(p => (
                        <li key={p._id} className="bg-red-100 p-3 rounded">
                            {p.name} — Stock: {p.stock}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default LowStockAlert;