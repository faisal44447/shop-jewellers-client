import { useState } from "react";
import Swal from "sweetalert2";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const HowladNewa = () => {
    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        amount: "",
        type: "loan",
        date: "",
    });

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // validation
        if (!form.name || !form.amount) {
            return Swal.fire({
                icon: "error",
                title: "Name & Amount required",
            });
        }

        try {
            setLoading(true);

            const data = {
                name: form.name,
                amount: Number(form.amount),
                type: form.type,
                createdAt: form.date
                    ? new Date(form.date)
                    : new Date(),
            };

            const res = await axiosSecure.post(
                "/transactions",
                data
            );

            if (
                res?.data?.insertedId ||
                res?.data?.success ||
                res?.data?.acknowledged
            ) {
                Swal.fire({
                    icon: "success",
                    title: "Saved Successfully",
                    timer: 1200,
                    showConfirmButton: false,
                });

                setForm({
                    name: "",
                    amount: "",
                    type: "loan",
                    date: "",
                });
            } else {
                throw new Error("Save failed");
            }

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Failed to save",
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg">

                {/* TITLE */}
                <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">
                    💰 Add New Howlad
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="input input-bordered w-full text-black"
                    />

                    <input
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        type="number"
                        placeholder="Amount"
                        className="input input-bordered w-full text-black"
                    />

                    <input
                        name="date"
                        type="datetime-local"
                        value={form.date}
                        onChange={handleChange}
                        className="input input-bordered w-full text-black"
                    />

                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="select select-bordered w-full text-black"
                    >
                        <option value="loan" className="text-black">➕ Howlad Nise</option>
                        <option value="given" className="text-black">➖ Howlad Dise</option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default HowladNewa;