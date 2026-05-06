import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaboTaka = () => {
    const axiosSecure = useAxiosSecure();

    const [form, setForm] = useState({
        name: "",
        amount: "",
        date: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axiosSecure.post("/receivables", form);

        alert("✅ Added");

        setForm({
            name: "",
            amount: "",
            date: ""
        });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-5 text-center">Add New Pabo Taka</h2>
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
                    type="number"
                    value={form.amount}
                    placeholder="Amount"
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="input input-bordered w-full"
                />

                <button className="btn btn-primary w-full">Add</button>
            </form>
        </div>
    );
};

export default PaboTaka;