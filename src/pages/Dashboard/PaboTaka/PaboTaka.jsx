import { useState } from "react";
import Swal from "sweetalert2";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaboTaka = () => {
    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        amount: "",
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

            const payload = {
                name: form.name,
                amount: Number(form.amount),
                createdAt: form.date
                    ? new Date(form.date)
                    : new Date(),
            };

            const res = await axiosSecure.post(
                "/receivables",
                payload
            );

            if (
                res?.data?.insertedId ||
                res?.data?.success ||
                res?.data?.acknowledged
            ) {
                Swal.fire({
                    icon: "success",
                    title: "Added Successfully",
                    timer: 1200,
                    showConfirmButton: false,
                });

                setForm({
                    name: "",
                    amount: "",
                    date: "",
                });
            } else {
                throw new Error("Add failed");
            }

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Failed to add",
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">

                {/* TITLE */}
                <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
                    💰 Add Pabo Taka
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
                        type="number"
                        value={form.amount}
                        onChange={handleChange}
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? "Adding..." : "Add"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default PaboTaka;