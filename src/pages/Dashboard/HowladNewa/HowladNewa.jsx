import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const HowladNewa = () => {
    const axiosSecure = useAxiosSecure();

    const [form, setForm] = useState({
        name: "",
        amount: "",
        type: "loan",
        date: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosSecure.post("/transactions", {
                ...form,
                amount: Number(form.amount),

                // ✅ FIXED (NO TIME SHIFT)
                createdAt: form.date
                    ? new Date(form.date).toISOString()
                    : new Date().toISOString()
            });

            Swal.fire("Success", "Saved!", "success");

            setForm({
                name: "",
                amount: "",
                type: "loan",
                date: ""
            });

        } catch (err) {
            Swal.fire("Error", "Failed", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 mt-10 space-y-3">

            <input
                value={form.name}
                placeholder="Name"
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input input-bordered w-full"
            />

            <input
                type="number"
                value={form.amount}
                placeholder="Amount"
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="input input-bordered w-full"
            />

            {/* ✅ DATE TIME */}
            <input
                type="datetime-local"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="input input-bordered w-full"
            />

            <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="select select-bordered w-full"
            >
                <option value="loan">➕ Howlad Nise</option>
                <option value="given">➖ Howlad Dise</option>
            </select>

            <button className="btn btn-primary w-full">Save</button>
        </form>
    );
};

export default HowladNewa;