import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaboTaka = () => {
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        amount: "",
        type: "minus",
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

        // Validation 
        if (!form.name || !form.amount) {
            return Swal.fire({
                icon: "error",
                title: "Name & Amount required",
            });
        }

        try {
            setLoading(true);
            const inputAmount = Math.abs(Number(form.amount));
            const finalAmount = form.type === "minus" ? -inputAmount : inputAmount;

            const payload = {
                name: form.name,
                amount: finalAmount,
                createdAt: form.date ? new Date(form.date) : new Date(),
            };

            const res = await axiosSecure.post("/receivables", payload);

            if (res?.data?.insertedId || res?.data?.success || res?.data?.acknowledged) {
                Swal.fire({
                    icon: "success",
                    title: "Added Successfully",
                    timer: 1200,
                    showConfirmButton: false,
                });
                setForm({
                    name: "",
                    amount: "",
                    type: "minus",
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
                    {/* NAME */}
                    <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Customer/Party Name" className="input input-bordered w-full text-black bg-white" />

                    {/* TYPE SELECTOR */}
                    <select name="type" value={form.type} onChange={handleChange} className="select select-bordered w-full text-black bg-white font-medium" >
                        <option value="minus">বাকি দেওয়া হয়েছে (-)</option>
                        <option value="plus">টাকা আদায় হয়েছে (+)</option>
                    </select>

                    {/* AMOUNT */}
                    <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" className="input input-bordered w-full text-black bg-white" />

                    {/* DATE */}
                    <input name="date" type="datetime-local" value={form.date} onChange={handleChange} className="input input-bordered w-full text-black bg-white" />

                    {/* SUBMIT BUTTON */}
                    <button type="submit" disabled={loading} className="btn btn-primary w-full text-white font-bold" >
                        {loading ? "Adding..." : "Add Transaction"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaboTaka;