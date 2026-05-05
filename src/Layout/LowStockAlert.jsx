// src/pages/Dashboard/LowStockAlert.jsx
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const LowStockAlert = () => {
    const axiosSecure = useAxiosSecure();
    const [items, setItems] = useState([]);

    useEffect(() => {
        axiosSecure.get("/products/low-stock")
            .then(res => setItems(res.data))
            .catch(err => console.error(err));
    }, [axiosSecure]);

    return (
        <div>
            <h2>Low Stock Items</h2>
            {
                items.map(item => (
                    <p key={item._id}>{item.name} - {item.quantity}</p>
                ))
            }
        </div>
    );
};

export default LowStockAlert;