import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import Swal from "sweetalert2";

import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import StaffSalaryCard from "../StaffSalaryCard/StaffSalaryCard.jsx";

const COLORS = ["#22c55e", "#ef4444"];

const StaffList = () => {
    const [search, setSearch] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // ================= REACT QUERY =================
    const { data: staffs = [], refetch } = useQuery({
        queryKey: ["staffs"],
        queryFn: async () => {
            const res = await axiosSecure.get("/staffs");
            return res.data;
        },
    });

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
                    toast.success("Staff deleted!");
                    refetch();
                }
            }
        });
    };

    // ================= EDIT =================
    const handleEdit = (staff) => {
        navigate(`/dashboard/edit-staff/${staff._id}`);
    };

    // ================= FILTER =================
    const filteredStaffs = staffs.filter((staff) =>
        staff.name.toLowerCase().includes(search.toLowerCase()) &&
        (monthFilter === "" || staff.month === monthFilter)
    );

    // ================= TOTAL =================
    const totalSalary = filteredStaffs.reduce(
        (sum, s) => sum + (s.monthlySalary || 0),
        0
    );

    const totalWithdrawal = filteredStaffs.reduce(
        (sum, s) => sum + (s.totalTaken || 0),
        0
    );

    // ================= MONTHLY SUMMARY =================
    const monthlySummary = filteredStaffs.reduce((acc, staff) => {
        const key = staff.month;

        if (!acc[key]) {
            acc[key] = { salary: 0, withdrawal: 0, count: 0 };
        }

        acc[key].salary += staff.monthlySalary || 0;
        acc[key].withdrawal += staff.totalTaken || 0;
        acc[key].count += 1;

        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto p-5">

            {/* HEADER */}
            <h2 className="text-3xl font-bold text-center mb-6">
                Staff Dashboard
            </h2>

            {/* FILTER */}
            <div className="flex flex-wrap gap-3 mb-6">

                <input
                    className="input input-bordered"
                    placeholder="Search staff"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="select select-bordered"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                >
                    <option value="">All Months</option>
                    {[
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ].map((m) => (
                        <option key={m}>{m}</option>
                    ))}
                </select>

            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className="p-5 rounded-2xl bg-green-500 text-white shadow-lg">
                    💰 Salary: ৳{totalSalary}
                </div>

                <div className="p-5 rounded-2xl bg-red-500 text-white shadow-lg">
                    💸 Withdrawal: ৳{totalWithdrawal}
                </div>

                <div className="p-5 rounded-2xl bg-blue-500 text-white shadow-lg">
                    👥 Staff: {filteredStaffs.length}
                </div>

            </div>

            {/* MONTHLY REPORT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                {Object.keys(monthlySummary).map((month) => (
                    <div
                        key={month}
                        className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    >
                        <h3 className="font-bold">{month}</h3>
                        <p>💰 {monthlySummary[month].salary}</p>
                        <p>💸 {monthlySummary[month].withdrawal}</p>
                        <p>👥 {monthlySummary[month].count}</p>
                    </div>
                ))}

            </div>

            {/* CHART */}
            <div className="bg-white p-5 rounded-xl shadow mb-10 h-96">

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredStaffs}>

                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        <Bar dataKey="monthlySalary" fill="#22c55e" />
                        <Bar dataKey="totalTaken" fill="#ef4444" />

                    </BarChart>
                </ResponsiveContainer>

            </div>

            {/* PIE CHART */}
            <div className="bg-white p-5 rounded-xl mb-10 h-80">

                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={[
                                { name: "Salary", value: totalSalary },
                                { name: "Withdrawal", value: totalWithdrawal },
                            ]}
                            dataKey="value"
                            outerRadius={120}
                            label
                        >
                            <Cell fill="#22c55e" />
                            <Cell fill="#ef4444" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {filteredStaffs.map((staff) => (
                    <StaffSalaryCard
                        key={staff._id}
                        staff={staff}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                    />
                ))}

            </div>

            {/* EMPTY */}
            {filteredStaffs.length === 0 && (
                <p className="text-center text-gray-400 mt-10">
                    No staff found 😢
                </p>
            )}

        </div>
    );
};

export default StaffList;