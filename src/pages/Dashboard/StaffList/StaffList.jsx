import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import Swal from "sweetalert2";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useAdmin from "../../../hooks/useAdmin.jsx";
import { FaEdit } from "react-icons/fa";

// ================= MONTH ORDER =================
const monthOrder = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};

const StaffList = () => {
    const [isAdmin] = useAdmin();
    const [staffs, setStaffs] = useState([]);
    const [search, setSearch] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // ================= FETCH =================
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axiosSecure.get("/staffs");
                setStaffs(res.data || []);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchStaff();
    }, [axiosSecure]);

    // ================= DELETE =================
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/staffs/${id}`);

            if (res.data?.deletedCount > 0) {
                setStaffs((prev) => prev.filter((s) => s._id !== id));

                Swal.fire({
                    icon: "success",
                    title: "Deleted successfully",
                    timer: 1200,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
            });
        }
    };

    // ================= FILTER + SORT =================
    const filteredStaffs = staffs
        .filter((staff) => {
            const matchName = staff?.name
                ?.toLowerCase()
                .includes(search.toLowerCase());

            const matchMonth =
                monthFilter === "" || staff?.month === monthFilter;

            return matchName && matchMonth;
        })
        .sort((a, b) => {
            return (
                (monthOrder[a?.month] || 0) -
                (monthOrder[b?.month] || 0)
            );
        });

    // ================= TOTAL =================
    const totalSalary = filteredStaffs.reduce(
        (sum, s) => sum + (s?.monthlySalary || 0),
        0
    );

    const totalTaken = filteredStaffs.reduce(
        (sum, s) => sum + (s?.totalTaken || 0),
        0
    );

    // ================= PDF =================
    const handleDownloadPDF = async () => {
        const element = document.getElementById("report");

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
        pdf.save("staff-report.pdf");
    };

    return (
        <div className="max-w-7xl mx-auto p-5">

            <h2 className="text-3xl font-bold text-center mb-10 text-orange-500">
                Staff Dashboard ({staffs.length})
            </h2>

            {/* FILTER */}
            <div className="flex flex-wrap gap-3 justify-between items-center mb-6">

                <input
                    type="text"
                    placeholder="Search staff..."
                    className="input input-bordered"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="select select-bordered"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                >
                    <option value="">All Months</option>
                    {Object.keys(monthOrder).map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>

                <button onClick={handleDownloadPDF} className="btn btn-success">
                    📄 PDF
                </button>

                <div className="flex gap-2">
                    <div className="badge badge-success p-3">
                        Salary: ৳{totalSalary}
                    </div>
                    <div className="badge badge-warning p-3">
                        Taken: ৳{totalTaken}
                    </div>
                </div>
            </div>

            {/* REPORT */}
            <div id="report">

                {/* CHART */}
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-10 h-96">

                    <h3 className="text-center font-bold text-lg mb-4 text-gray-700">
                        📊 Salary vs Taken Analysis
                    </h3>

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart data={filteredStaffs}>

                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            <Bar
                                dataKey="monthlySalary"
                                fill="#22c55e"
                                name="Salary"
                                radius={[6, 6, 0, 0]}
                            />

                            <Bar
                                dataKey="totalTaken"
                                fill="#ef4444"
                                name="Taken"
                                radius={[6, 6, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {filteredStaffs.map((staff) => (
                        <div key={staff._id} className="card bg-base-100 shadow-xl">

                            <div className="card-body bg-gray-900 text-white rounded-2xl border border-gray-700">

                                <h2 className="card-title text-xl text-orange-400">
                                    {staff?.name}
                                    <div className="badge badge-secondary">Staff</div>
                                </h2>

                                <p>💰 Salary: ৳{staff?.monthlySalary}</p>
                                <p>📉 Taken: ৳{staff?.totalTaken}</p>

                                <p className="text-green-400 font-semibold">
                                    💵 Remaining: ৳
                                    {(staff?.monthlySalary || 0) -
                                        (staff?.totalTaken || 0)}
                                </p>

                                <div className="flex justify-between text-sm mt-2">
                                    <p>📆 Month: {staff?.month}</p>
                                    <div className="text-gray-400 text-xs">
                                        <p>{staff?.submissionDate}</p>
                                        <p>{staff?.submissionTime}</p>
                                    </div>
                                </div>

                                <div className="text-sm mt-2">
                                    {staff?.weeklyExpenses?.map((w, i) => (
                                        <p key={i}>
                                            Week {i + 1}: ৳{w}
                                        </p>
                                    ))}
                                </div>

                                {/* BUTTONS */}
                                {isAdmin && (
                                    <div className="flex justify-end gap-3 mt-4">

                                        <Link
                                            to={`/dashboard/edit-staff/${staff._id}`}
                                            className="btn btn-warning btn-sm"
                                        >
                                            <FaEdit /> Edit
                                        </Link>

                                        <button
                                            onClick={() =>
                                                handleDelete(staff._id)
                                            }
                                            className="btn btn-error btn-sm"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                )}

                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
};

export default StaffList;