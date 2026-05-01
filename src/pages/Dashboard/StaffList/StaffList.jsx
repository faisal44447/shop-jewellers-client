import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import Swal from 'sweetalert2';

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
import useAdmin from '../../../hooks/useAdmin.jsx';
import { FaEdit } from 'react-icons/fa';

// ================= MONTH ORDER FIX =================
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
        axiosSecure.get('/staffs')
            .then(res => setStaffs(res.data))
            .catch(err => console.log(err));
    }, [axiosSecure]);

    // ================= DELETE =================
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/staffs/${id}`);
                if (res.data.deletedCount > 0) {
                    setStaffs(prev => prev.filter(s => s._id !== id));
                    Swal.fire("Deleted!", "", "success");
                }
            }
        });
    };

    // ================= EDIT =================
    const handleEdit = (staff) => {
        navigate(`/dashboard/edit-staff/${staff._id}`);
    };

    // ================= FILTER + SORT FIX =================
    const filteredStaffs = staffs
        .filter((staff) =>
            staff.name.toLowerCase().includes(search.toLowerCase()) &&
            (monthFilter === "" || staff.month === monthFilter)
        )
        .sort((a, b) => {
            return (monthOrder[a.month] || 0) - (monthOrder[b.month] || 0);
        });

    // ================= TOTAL =================
    const totalSalary = filteredStaffs.reduce((sum, s) => sum + (s.monthlySalary || 0), 0);
    const totalTaken = filteredStaffs.reduce((sum, s) => sum + (s.totalTaken || 0), 0);

    // ================= PDF =================
    const handleDownloadPDF = async () => {
        const element = document.getElementById("report");
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        pdf.addImage(data, "PNG", 10, 10, 180, 0);
        pdf.save("staff-report.pdf");
    };

    return (
        <div className="max-w-7xl mx-auto p-5">

            <h2 className="text-3xl font-bold text-center mb-6">
                Staff Dashboard
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
                        <option key={m}>{m}</option>
                    ))}
                </select>

                <button onClick={handleDownloadPDF} className="btn btn-success">
                    📄 PDF
                </button>

                <div className="flex gap-2">
                    <div className="badge badge-success p-3">Salary: ৳{totalSalary}</div>
                    <div className="badge badge-warning p-3">Taken: ৳{totalTaken}</div>
                </div>
            </div>

            {/* REPORT */}
            <div id="report">

                {/* BAR CHART */}
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

                            {/* SALARY BAR */}
                            <Bar
                                dataKey="monthlySalary"
                                fill="#22c55e"
                                name="Salary"
                                radius={[6, 6, 0, 0]}
                            />

                            {/* TAKEN BAR */}
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

                            <div className="card-body rounded-2xl shadow-lg p-5 bg-gray-900 text-white border border-gray-700">

                                <h2 className="card-title font-bold text-xl text-center">
                                    {staff.name}
                                    <div className="badge badge-secondary">Staff</div>
                                </h2>
                                <p>💰 Salary: ৳{staff.monthlySalary}</p>
                                <p>📉 Taken: ৳{staff.totalTaken}</p>

                                <p className="text-green-600 font-semibold">
                                    💵 Remaining: ৳{staff.monthlySalary - staff.totalTaken}
                                </p>

                                <div className='flex justify-between'>
                                    <div>
                                        <p>📆 Month: {staff.month}</p>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        <p>📆 {staff.submissionDate}</p>
                                        <p>⏰ {staff.submissionTime}</p>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    {staff.weeklyExpenses?.map((w, i) => (
                                        <p key={i}>Week {i + 1}: ৳{w}</p>
                                    ))}
                                </div>

                                {/* BUTTONS */}
                                <div className="flex justify-end gap-3 mt-3">

                                    {isAdmin && (
                                        <>
                                            <Link
                                                to={`/dashboard/edit-staff/${staff._id}`}
                                                className="btn btn-warning btn-sm"
                                            >
                                                <FaEdit /> Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(staff._id)}
                                                className="btn btn-error btn-sm flex-1"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}

                                </div>

                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
};

export default StaffList;