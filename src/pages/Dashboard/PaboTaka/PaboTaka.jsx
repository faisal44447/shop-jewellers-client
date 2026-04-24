import { useState } from "react";
import axios from "axios";

const PaboTaka = () => {
    const [form, setForm] = useState({
        name: "",
        amount: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5000/receivables", {
                ...form,
                amount: Number(form.amount)
            });

            alert("✅ Added");

            // 🔥 reset
            setForm({
                name: "",
                amount: ""
            });

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 mt-10 space-y-3">

            <input
                type="datetime-local"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="input input-bordered w-full"
            />

            <input
                value={form.name}
                placeholder="Name"
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input input-bordered w-full"
            />

            <input
                value={form.amount}
                placeholder="Amount"
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="input input-bordered w-full"
            />

            <button className="btn btn-primary w-full">Add</button>
        </form>
    );
};

export default PaboTaka;