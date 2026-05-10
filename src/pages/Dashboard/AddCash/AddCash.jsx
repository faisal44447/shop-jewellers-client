import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddCash = () => {
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: "",
        time: "",
    });

    // ================= HANDLE SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.amount || !formData.date || !formData.time) {
            return Swal.fire({
                icon: "warning",
                title: "Fill all fields",
            });
        }

        try {
            setLoading(true);

            const payload = {
                title: formData.title,
                amount: Number(formData.amount),
                date: formData.date,
                time: formData.time,
                createdAt: new Date(),
            };

            await axiosSecure.post("/cash-list", payload);

            Swal.fire({
                icon: "success",
                title: "Cash Added Successfully",
                timer: 1500,
                showConfirmButton: false,
            });

            setFormData({
                title: "",
                amount: "",
                date: "",
                time: "",
            });

        } catch (error) {
            console.log(error);

            Swal.fire({
                icon: "error",
                title: "Failed to add cash",
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 bg-gray-100 min-h-screen flex justify-center items-center">

            <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md">

                {/* TITLE */}
                <h2 className="text-2xl font-bold text-orange-500 mb-4 text-center">
                    💰 Add Cash
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* TITLE */}
                    <input
                        type="text"
                        placeholder="Cash Title"
                        className="input input-bordered w-full text-black"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />

                    {/* AMOUNT */}
                    <input
                        type="number"
                        placeholder="Amount"
                        className="input input-bordered w-full text-black"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                        }
                    />

                    {/* DATE FIELD */}
                    <input
                        type="date"
                        className="input input-bordered w-full text-black"
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                    />

                    {/* TIME FIELD */}
                    <input
                        type="time"
                        className="input input-bordered w-full text-black"
                        value={formData.time}
                        onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                        }
                    />

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="btn bg-orange-500 hover:bg-orange-600 text-white w-full"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Cash"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default AddCash;