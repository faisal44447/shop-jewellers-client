// src/pages/ExpensesDetails.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const ExpensesDetailsToDo = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("https://shop-jewellers-server.vercel.app/expenses", {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access-token")}`
            }
        })
            .then(res => {
                setExpenses(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Date formatter: DD/MM/YYYY hh:mm AM/PM
    const formatDateTime = (dateStr) => {
        if (!dateStr) return "No Date";
        const date = new Date(dateStr);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month 0-indexed
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    if (loading) return <p className="p-5">Loading...</p>;

    return (
        <div className="p-5 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-5">দোকানের মোট খরচ</h1>

            <table className="table-auto w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-3 py-2">SL</th>
                        <th className="border px-3 py-2">Title</th>
                        <th className="border px-3 py-2">Amount (৳)</th>
                        <th className="border px-3 py-2">Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center p-3">No expenses found</td>
                        </tr>
                    )}
                    {expenses.map((item, index) => (
                        <tr key={item._id} className="text-center">
                            <td className="border px-3 py-2">{index + 1}</td>
                            <td className="border px-3 py-2">{item.title}</td>
                            <td className="border px-3 py-2">{item.amount}</td>
                            <td className="border px-3 py-2">{formatDateTime(item.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpensesDetailsToDo;