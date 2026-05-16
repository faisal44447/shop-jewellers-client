import { useState } from "react";
import Swal from "sweetalert2";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Expenses = () => {
    const axiosSecure = useAxiosSecure();

    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "",
        date: "",
        time: "",
    });

    const [loading, setLoading] = useState(false);

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
        if (!form.title || !form.amount) {
            return Swal.fire({
                icon: "error",
                title: "Title & Amount required",
            });
        }

        try {
            setLoading(true);

            // Jidi date ebong time raw state e selected thake, tahole oita boshbe, nahole runtime execution time er auto current date/time boshbe.
            const fullDateTime =
                form.date && form.time
                    ? new Date(`${form.date}T${form.time}`)
                    : new Date();

            const expenseData = {
                title: form.title,
                category: form.category,
                amount: Number(form.amount),
                createdAt: fullDateTime,
            };

            const res = await axiosSecure.post(
                "/expenses",
                expenseData
            );

            if (
                res?.data?.insertedId ||
                res?.data?.acknowledged ||
                res?.data?.success
            ) {
                Swal.fire({
                    icon: "success",
                    title: "Expense Added Successfully",
                    timer: 1200,
                    showConfirmButton: false,
                });

                setForm({
                    title: "",
                    amount: "",
                    category: "",
                    date: "",
                    time: "",
                });
            } else {
                throw new Error("Expense not added");
            }

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Expense add failed",
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg">

                {/* TITLE */}
                <h2 className="text-3xl font-bold mb-6 text-center text-red-500">
                    💸 Add New Expense
                </h2>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Expense Title"
                        className="input input-bordered w-full text-black"
                    />

                    <input
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        type="number"
                        className="input input-bordered w-full text-black"
                    />

                    <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Category (e.g. Rent, Salary)"
                        className="input input-bordered w-full text-black"
                    />

                    <div className="grid grid-cols-2 gap-3">

                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="input input-bordered w-full text-black"
                        />

                        <input
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                            className="input input-bordered w-full text-black"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-error w-full text-white"
                    >
                        {loading
                            ? "Adding..."
                            : "Add Expense"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Expenses;