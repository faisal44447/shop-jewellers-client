import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddStaff = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const todayStr = new Date().toISOString().split("T")[0];
    const timeStr = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    });

    // Default string fallback ensure korar jonno step checking schema
    const [weeks, setWeeks] = useState([
        { amount: "", date: todayStr, time: timeStr },
        { amount: "", date: todayStr, time: timeStr },
        { amount: "", date: todayStr, time: timeStr },
        { amount: "", date: todayStr, time: timeStr },
    ]);

    const handleWeekChange = (index, field, value) => {
        setWeeks(prevWeeks =>
            prevWeeks.map((week, idx) =>
                idx === index ? { ...week, [field]: value } : week
            )
        );
    };

    const addWeekSlot = () => {
        if (weeks.length >= 5) {
            return Swal.fire("Info", "Maximum 5 weeks can be added in a month", "info");
        }
        setWeeks([...weeks, { amount: "", date: todayStr, time: timeStr }]);
    };

    const removeLastWeekSlot = () => {
        if (weeks.length === 0) return;
        setWeeks(weeks.slice(0, -1));
    };

    const toNumber = (value) => Number(value) || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const name = form.name.value.trim();
        const salary = form.salary.value;
        const month = form.month.value;

        // Custom Validation System check
        if (!name || !salary || !month) {
            console.error("❌ Root verification failed");
            return Swal.fire("Error", "Primary fields empty dekhachche. Form fill-up korun.", "error");
        }

        let structuralError = false;
        const processedWeeks = weeks.map((w, index) => {
            if (w.amount === undefined || String(w.amount).trim() === "") {
                structuralError = true;
                console.error(`❌ Empty amount at index: ${index}`);
            }
            return {
                amount: toNumber(w.amount),
                date: w.date || todayStr,
                time: w.time || timeStr,
            };
        });

        if (structuralError) {
            return Swal.fire("Error", "Weekly expenses er amount field blank rekhe submit kora jabena.", "error");
        }

        const calculatedTotalTaken = processedWeeks.reduce((sum, w) => sum + w.amount, 0);

        const staffData = {
            name,
            monthlySalary: toNumber(salary),
            totalTaken: calculatedTotalTaken,
            weeklyExpenses: processedWeeks,
            month,
            year: new Date().getFullYear(),
            submissionDate: todayStr,
            submissionTime: timeStr,
        };

        try {
            const res = await axiosSecure.post("/staffs", staffData);
            if (res.data?.insertedId || res.data?.success) {
                Swal.fire({
                    icon: "success",
                    title: "Saved!",
                    text: "Staff record dynamically updated",
                }).then(() => {
                    form.reset();
                    navigate("/dashboard/staff-list");
                });
            }
        } catch (error) {
            console.error("Submission pipeline collapsed:", error);
            Swal.fire({ icon: "error", title: "Network Exception" });
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">Add New Staff</h2>
            <form onSubmit={handleSubmit} noValidate className="p-8 bg-white shadow-xl rounded-2xl border border-gray-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="label text-sm font-semibold text-black p-1">Staff Name</label>
                        <input type="text" name="name" placeholder="e.g. John Doe" className="input input-bordered w-full text-black bg-gray-50 focus:outline-none focus:border-orange-500" required />
                    </div>
                    <div>
                        <label className="label text-sm font-semibold text-black p-1">Monthly Salary</label>
                        <input type="number" name="salary" placeholder="৳ Salary" className="input input-bordered w-full text-black bg-gray-50 focus:outline-none focus:border-orange-500" required />
                    </div>
                    <div>
                        <label className="label text-sm font-semibold text-black p-1">Select Month</label>
                        <select name="month" className="select select-bordered w-full text-black bg-gray-50 focus:outline-none focus:border-orange-500" required defaultValue="">
                            <option value="" disabled>Select Month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-bold text-orange-600 uppercase tracking-wider text-sm">📆 Weekly Expenses Logs</p>
                        <div className="flex gap-2">
                            <button type="button" onClick={addWeekSlot} className="btn btn-xs btn-success text-white">+ Add Week</button>
                            {weeks.length > 0 && <button type="button" onClick={removeLastWeekSlot} className="btn btn-xs btn-error text-white">- Remove</button>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {weeks.map((week, index) => (
                            <div key={index} className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm space-y-2">
                                <span className="text-xs font-bold text-gray-500 block">Week {index + 1}</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                        <label className="label text-[11px] font-semibold text-gray-600 p-0 mb-1">Amount (৳)</label>
                                        <input type="number" placeholder="Amount" value={week.amount} className="input input-bordered input-sm w-full text-black bg-white focus:outline-none" onChange={(e) => handleWeekChange(index, "amount", e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="label text-[11px] font-semibold text-gray-600 p-0 mb-1">Date</label>
                                        <input type="date" value={week.date} className="input input-bordered input-sm w-full text-black bg-white focus:outline-none" onChange={(e) => handleWeekChange(index, "date", e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="label text-[11px] font-semibold text-gray-600 p-0 mb-1">Time</label>
                                        <input type="time" value={week.time} className="input input-bordered input-sm w-full text-black bg-white focus:outline-none" onChange={(e) => handleWeekChange(index, "time", e.target.value)} required />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="btn btn-primary w-full bg-orange-500 hover:bg-orange-600 border-none text-white font-bold mt-4">Save Staff Data</button>
            </form>
        </div>
    );
};

export default AddStaff;