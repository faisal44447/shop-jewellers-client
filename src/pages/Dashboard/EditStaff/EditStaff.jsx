import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const EditStaff = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);

    const [liveName, setLiveName] = useState("");
    const [liveSalary, setLiveSalary] = useState(0);
    const [liveWeeks, setLiveWeeks] = useState([]);
    const [liveTaken, setLiveTaken] = useState(0);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axiosSecure.get(`/staffs/${id}`);
                setStaff(res.data);
                setLiveName(res.data?.name || "");
                setLiveSalary(res.data?.monthlySalary || 0);

                const weeks = (res.data?.weeklyExpenses || []).map(w => {
                    if (typeof w === "object" && w !== null) {
                        return {
                            amount: w.amount !== undefined ? String(w.amount) : "",
                            date: w.date || "",
                            time: w.time || ""
                        };
                    }
                    return { amount: String(w) || "", date: "", time: "" };
                });
                setLiveWeeks(weeks);

                const totalWeeklySum = weeks.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
                setLiveTaken(totalWeeklySum);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to load staff", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id, axiosSecure]);

    const handleWeekFieldChange = (index, field, value) => {
        const updatedWeeks = liveWeeks.map((week, idx) => {
            if (idx === index) {
                return { ...week, [field]: value };
            }
            return week;
        });

        setLiveWeeks(updatedWeeks);
        const totalWeeklySum = updatedWeeks.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
        setLiveTaken(totalWeeklySum);
    };

    const addWeekSlot = () => {
        if (liveWeeks.length >= 5) {
            return Swal.fire("Info", "Maximum 5 weeks can be added in a month", "info");
        }
        const today = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        const updatedWeeks = [...liveWeeks, { amount: "", date: today, time: time }];
        setLiveWeeks(updatedWeeks);
    };

    const removeLastWeekSlot = () => {
        if (liveWeeks.length === 0) return;
        const updatedWeeks = liveWeeks.slice(0, -1);
        setLiveWeeks(updatedWeeks);

        const totalWeeklySum = updatedWeeks.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
        setLiveTaken(totalWeeklySum);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!liveName.trim()) {
            return Swal.fire("Error", "Staff Name cannot be blank", "error");
        }
        if (!liveSalary || isNaN(liveSalary)) {
            return Swal.fire("Error", "Please enter a valid Monthly Salary", "error");
        }

        let emptyWeekDetected = false;
        const processedWeeks = liveWeeks.map((w) => {
            if (w.amount === undefined || String(w.amount).trim() === "") {
                emptyWeekDetected = true;
            }
            return {
                amount: Number(w.amount) || 0,
                date: w.date,
                time: w.time
            };
        });

        if (emptyWeekDetected) {
            return Swal.fire("Error", "Weekly log inputs fill out korun othoba step-ti row element theke remove korun.", "error");
        }

        const updatedData = {
            name: liveName.trim(),
            monthlySalary: Number(liveSalary) || 0,
            totalTaken: liveTaken,
            weeklyExpenses: processedWeeks,
            month: staff?.month || "",
            year: staff?.year || new Date().getFullYear(),
            submissionDate: staff?.submissionDate || "",
            submissionTime: staff?.submissionTime || "",
        };

        try {
            const res = await axiosSecure.put(`/staffs/${id}`, updatedData);
            if (res.data?.modifiedCount > 0 || res.data?.success) {
                Swal.fire("Updated!", "Data synced inside cluster structure", "success")
                    .then(() => navigate("/dashboard/staff-list"));
            } else {
                Swal.fire("Info", "No changes were made", "info");
            }
        } catch (err) {
            console.error("Update system collapsed:", err);
            Swal.fire("Error", "Update failed", "error");
        }
    };

    if (loading) return <p className="text-center mt-10 text-lg text-black">Loading...</p>;
    if (!staff) return <p className="text-center mt-10 text-red-500 font-bold">Staff not found</p>;

    const remaining = liveSalary - liveTaken;

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-5 text-center text-orange-500">Edit Staff Details</h2>
            <div className="mb-6 p-5 bg-gray-900 text-white rounded-2xl border border-gray-700 shadow-md">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Live Status Preview ({staff?.month})</h3>
                <div className="font-bold text-lg">
                    {remaining < 0 ? (
                        <p className="text-red-400">⚠️ Extra Taken: ৳{Math.abs(remaining)}</p>
                    ) : remaining === 0 ? (
                        <p className="text-green-400">✅ Salary Settled Perfectly</p>
                    ) : (
                        <p className="text-emerald-400">💵 Balance Remaining: ৳{remaining}</p>
                    )}
                </div>
                <div className="text-xs text-orange-400 mt-2">📊 Auto-Calculated Total Taken: ৳{liveTaken}</div>
            </div>

            <form onSubmit={handleUpdate} noValidate className="space-y-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <div>
                    <label className="label text-sm font-semibold text-black mb-1">Staff Name</label>
                    <input value={liveName} onChange={(e) => setLiveName(e.target.value)} className="input input-bordered w-full text-black bg-gray-50 focus:outline-none" required />
                </div>
                <div>
                    <label className="label text-sm font-semibold text-black mb-1">Monthly Salary</label>
                    <input value={liveSalary === 0 ? "" : liveSalary} type="number" className="input input-bordered w-full text-black bg-gray-50 focus:outline-none" onChange={(e) => setLiveSalary(e.target.value)} required />
                </div>

                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 my-2">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider">📆 Weekly Expenses</h4>
                        <div className="flex gap-1">
                            <button type="button" onClick={addWeekSlot} className="btn btn-xs btn-success text-white">+ Add Week</button>
                            {liveWeeks.length > 0 && <button type="button" onClick={removeLastWeekSlot} className="btn btn-xs btn-error text-white">- Remove</button>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {liveWeeks.map((week, index) => (
                            <div key={index} className="bg-white p-3 rounded-xl border border-orange-100 space-y-2">
                                <span className="text-xs font-bold text-gray-500 block">Week {index + 1} Log</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                        <label className="label text-[11px] text-gray-600">Amount (৳)</label>
                                        <input value={week.amount} type="number" className="input input-bordered input-sm w-full text-black" onChange={(e) => handleWeekFieldChange(index, "amount", e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="label text-[11px] text-gray-600">Date</label>
                                        <input value={week.date} type="date" className="input input-bordered input-sm w-full text-black" onChange={(e) => handleWeekFieldChange(index, "date", e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="label text-[11px] text-gray-600">Time</label>
                                        <input value={week.time} type="time" className="input input-bordered input-sm w-full text-black" onChange={(e) => handleWeekFieldChange(index, "time", e.target.value)} required />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="label text-sm font-semibold text-black mb-1">Total Taken</label>
                    <input value={liveTaken} type="number" className="input input-bordered w-full text-gray-600 bg-gray-100 font-bold" readOnly />
                </div>
                <button className="btn btn-primary w-full bg-orange-500 hover:bg-orange-600 border-none text-white font-bold mt-4">Update Staff Data</button>
            </form>
        </div>
    );
};

export default EditStaff;