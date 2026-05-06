import { useState } from "react";
import axios from "axios";

const Expenses = () => {
    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "",
        date: "",
        time: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const fullDateTime = new Date(`${form.date}T${form.time}`);

            await axios.post("http://localhost:5000/expenses", {
                ...form,
                amount: Number(form.amount),
                createdAt: fullDateTime
            });

            alert("✅ Expense Added");

            setForm({
                title: "",
                amount: "",
                category: "",
                date: "",
                time: ""
            });

        } catch (error) {
            console.log(error);
            alert("Expense add failed ❌");
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4 text-center">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="p-5 mt-10 space-y-3">

                <input name="title" value={form.title} onChange={handleChange} placeholder="Expense Title" className="input input-bordered w-full" />

                <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" className="input input-bordered w-full" />

                <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input input-bordered w-full" />

                <input type="date" name="date" value={form.date} onChange={handleChange} className="input input-bordered w-full" />

                <input type="time" name="time" value={form.time} onChange={handleChange} className="input input-bordered w-full" />

                <button className="btn btn-error w-full">Add Expense</button>
            </form>
        </div>
    );
};

export default Expenses;