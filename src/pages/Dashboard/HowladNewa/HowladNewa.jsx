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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

            <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="input input-bordered w-full"
            />

            <input
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Amount"
                type="number"
                className="input input-bordered w-full"
            />

            <input
                type="datetime-local"
                value={form.date || ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input input-bordered w-full"
            />

            <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="select select-bordered w-full"
            >
                <option value="loan">➕ Howlad Nise</option>
                <option value="given">➖ Howlad Dise</option>
            </select>

            <button className="btn btn-primary w-full">
                Save
            </button>

        </form>
    );
};

export default HowladNewa;