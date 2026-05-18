import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaboTaka = () => {
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        amount: "",
        type: "minus", // 👈 ডিফল্টভাবে "বাকি দেওয়া বা হাওলাদ দেওয়া (-)" সেট করা
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

            // 🛠️ আপনার লজিক অনুযায়ী: হাওলাদ/বাকি দিলে মাইনাস (-), ফেরত পাইলে প্লাস (+)
            const inputAmount = Math.abs(Number(form.amount)); // প্রথমে পজিটিভ করে নেওয়া হলো
            const finalAmount = form.type === "minus" ? -inputAmount : inputAmount;

            const payload = {
                name: form.name,
                amount: finalAmount, // 👈 সঠিক সাইনসহ অ্যামাউন্ট যাচ্ছে
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
                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Customer/Party Name"
                        className="input input-bordered w-full text-black"
                    />

                    {/* TYPE SELECTOR (নতুন যুক্ত করা হয়েছে লজিক ঠিক রাখার জন্য) */}
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="select select-bordered w-full text-black font-medium"
                    >
                        <option value="minus">দোকানের baki ba hawlad dele (-)</option>
                        <option value="plus">hawlad ba baki taka deye dele (+)</option>
                    </select>

                    {/* AMOUNT */}
                    <input
                        name="amount"
                        type="number"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        className="input input-bordered w-full text-black"
                    />

                    {/* DATE */}
                    <input
                        name="date"
                        type="datetime-local"
                        value={form.date}
                        onChange={handleChange}
                        className="input input-bordered w-full text-black"
                    />

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full text-white font-bold"
                    >
                        {loading ? "Adding..." : "Add Transaction"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaboTaka;