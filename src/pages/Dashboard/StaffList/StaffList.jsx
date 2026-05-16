import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure.jsx";
import Swal from "sweetalert2";
import { RiDeleteBin6Fill } from "react-icons/ri";

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

const monthOrder = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

// সপ্তাহের নাম বাংলায় দেখানোর জন্য হেল্পার ম্যাপ
const banglaWeeks = ["১ম সপ্তাহ", "২য় সপ্তাহ", "৩য় সপ্তাহ", "৪র্থ সপ্তাহ", "৫ম সপ্তাহ"];

const StaffList = () => {
    const [isAdmin] = useAdmin();
    const [staffs, setStaffs] = useState([]);
    const [search, setSearch] = useState("");
    const [monthFilter, setMonthFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get("/staffs");
                setStaffs(res.data || []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [axiosSecure]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/staffs/${id}`);
            if (res.data?.deletedCount > 0 || res.data?.success) {
                setStaffs((prev) => prev.filter((s) => s._id !== id));
                Swal.fire({
                    icon: "success",
                    title: "Deleted successfully",
                    timer: 1200,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Delete failed" });
        }
    };

    const filteredStaffs = useMemo(() => {
        return staffs
            .filter((staff) => {
                const matchName = staff?.name?.toLowerCase().includes(search.toLowerCase());
                const matchMonth = monthFilter === "" || staff?.month === monthFilter;
                return matchName && matchMonth;
            })
            .sort((a, b) => {
                // ১. প্রথমে বছর (Year) বের করা হবে submissionDate থেকে (যেমন: "2025-12-25" বা "25/12/2025")
                // যদি সরাসরি year ফিল্ড থাকে তবে সেটি ব্যবহার হবে, না থাকলে submissionDate থেকে বের করবে।
                const getYear = (item) => {
                    if (item?.year) return parseInt(item.year);
                    if (item?.submissionDate) {
                        const match = item.submissionDate.match(/\d{4}/); // ৪ ডিজিটের সাল খুঁজবে
                        if (match) return parseInt(match[0]);
                    }
                    return 2026; // ডিফল্ট হিসেবে বর্তমান সাল
                };

                const yearA = getYear(a);
                const yearB = getYear(b);

                // বছর যদি আলাদা হয়, তবে ছোট বছরটি (অতীতের বছর যেমন ২০২৫) আগে আসবে
                if (yearA !== yearB) {
                    return yearA - yearB;
                }

                // ২. বছর যদি একই হয় (যেমন দুজনেই ২০২৬ বা দুজনেই ২০২৫), তখন মাসের ক্রমানুসার (January, February...) দেখা হবে
                const monthA = a?.month ? a.month.charAt(0).toUpperCase() + a.month.slice(1) : "";
                const monthB = b?.month ? b.month.charAt(0).toUpperCase() + b.month.slice(1) : "";

                const orderA = monthOrder[monthA] || 99;
                const orderB = monthOrder[monthB] || 99;

                if (orderA !== orderB) {
                    return orderA - orderB;
                }

                // ৩. বছর এবং মাস দুটোই যদি এক হয়, তবে স্টাফের নাম অনুযায়ী Alphabetically সাজানো হবে
                const nameA = (a?.name || "").toLowerCase();
                const nameB = (b?.name || "").toLowerCase();
                return nameA.localeCompare(nameB);
            });
    }, [staffs, search, monthFilter]);

    const totalSalary = useMemo(() => filteredStaffs.reduce((sum, s) => sum + (s?.monthlySalary || 0), 0), [filteredStaffs]);
    const totalTaken = useMemo(() => filteredStaffs.reduce((sum, s) => sum + (s?.totalTaken || 0), 0), [filteredStaffs]);

    const handleDownloadPDF = async () => {
        const element = document.getElementById("report");

        const options = {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        };

        Swal.fire({
            title: "Generating PDF...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const canvas = await html2canvas(element, options);
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
            }

            pdf.save(`staff-report-${monthFilter || "all"}.pdf`);
            Swal.close();
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: "error", title: "PDF Generation Failed" });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-5">
            <h2 className="text-3xl font-bold text-center mb-10 text-orange-500">
                Staff Dashboard ({filteredStaffs.length})
            </h2>

            <div className="flex flex-wrap gap-3 justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input
                    type="text"
                    placeholder="Search staff..."
                    className="input input-bordered w-full max-w-xs text-black focus:outline-none focus:border-orange-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="select select-bordered text-black focus:outline-none focus:border-orange-500"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                >
                    <option value="">All Months</option>
                    {Object.keys(monthOrder).map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>

                <button onClick={handleDownloadPDF} className="btn btn-success text-white font-bold px-5">
                    📄 Download PDF Report
                </button>

                <div className="flex gap-2">
                    <div className="badge badge-success p-4 text-white font-semibold">Salary: ৳{totalSalary}</div>
                    <div className="badge badge-warning p-4 text-white font-semibold">Taken: ৳{totalTaken}</div>
                </div>
            </div>

            <div id="report" className="p-2 bg-white rounded-2xl">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-10 h-96 w-full">
                    <h3 className="text-center font-bold text-lg mb-4 text-gray-700">📊 Salary vs Taken Analysis</h3>
                    <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                        <BarChart data={filteredStaffs} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <XAxis dataKey="name" tick={{ fill: '#4b5563' }} />
                            <YAxis tick={{ fill: '#4b5563' }} />
                            <Tooltip cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }} />
                            <Legend />
                            <Bar dataKey="monthlySalary" fill="#22c55e" name="Salary" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="totalTaken" fill="#ef4444" name="Taken" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {filteredStaffs.length === 0 ? (
                    <p className="text-center text-gray-500 my-10 font-medium">No records found matching criteria.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStaffs.map((staff) => {
                            const salary = staff?.monthlySalary || 0;
                            const taken = staff?.totalTaken || 0;
                            const remaining = salary - taken;
                            const currentMonth = staff?.month || "This";

                            // কার্ডে সালটি সুন্দর করে দেখানোর জন্য ট্রিকস
                            let cardYear = "";
                            if (staff?.submissionDate) {
                                const match = staff.submissionDate.match(/\d{4}/);
                                if (match) cardYear = `, ${match[0]}`;
                            }

                            return (
                                <div key={staff._id} className="card bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-xl overflow-hidden transform transition-all duration-200 hover:scale-[1.01]">
                                    <div className="card-body p-5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="card-title text-xl text-orange-400 font-bold truncate max-w-[70%]">
                                                    {staff?.name || "Unknown Staff"}
                                                </h2>
                                                <span className="badge badge-secondary text-xs">Staff</span>
                                            </div>

                                            <div className="space-y-1 text-sm text-gray-300">
                                                <p>💰 Salary: <span className="font-semibold text-white">৳{salary}</span></p>
                                                <p>📉 Taken: <span className="font-semibold text-white">৳{taken}</span></p>
                                            </div>

                                            <div className="mt-3 pt-2 border-t border-gray-800 font-bold text-sm">
                                                {remaining < 0 ? (
                                                    <p className="text-red-400">⚠️ {currentMonth} mase beshe nese: ৳{Math.abs(remaining)}</p>
                                                ) : remaining === 0 ? (
                                                    <p className="text-green-400">✅ {currentMonth} mase beton complete</p>
                                                ) : (
                                                    <p className="text-emerald-400">💵 {currentMonth} mase beton kom nese: ৳{remaining}</p>
                                                )}
                                            </div>

                                            {/* Weekly Logs Breakdown Section */}
                                            <div className="mt-4 bg-gray-950 p-3 rounded-xl border border-gray-800/60">
                                                <p className="text-[11px] font-bold text-orange-400 mb-2 uppercase tracking-wider">📆 সপ্তাহের টাকা নেওয়ার হিসাব</p>
                                                <div className="space-y-1.5 text-xs">
                                                    {staff?.weeklyExpenses && staff.weeklyExpenses.length > 0 ? (
                                                        staff.weeklyExpenses.map((w, i) => {
                                                            const isObj = typeof w === "object" && w !== null;
                                                            const amt = isObj ? (w.amount ?? 0) : w;
                                                            const date = isObj && w.date ? w.date : "N/A";
                                                            const time = isObj && w.time ? w.time : "";
                                                            const weekLabel = banglaWeeks[i] || `${i + 1}ম সপ্তাহ`;

                                                            return (
                                                                <div key={i} className="flex justify-between items-center border-b border-gray-900 pb-1 last:border-0 last:pb-0 text-gray-300">
                                                                    <span className="font-medium text-gray-400">{weekLabel}: ৳{amt}</span>
                                                                    <span className="text-[10px] text-gray-500">{date} {time && `| ${time}`}</span>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <p className="italic text-gray-600 text-center py-1">কোনো সাপ্তাহিক রেকর্ড নেই</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-[11px] text-gray-400 mt-4 pt-2 border-t border-gray-800">
                                                <p>📆 Month: {currentMonth}{cardYear}</p>
                                                <div className="text-right text-[10px] text-gray-500">
                                                    <p>Created: {staff?.submissionDate || "N/A"}</p>
                                                    <p>{staff?.submissionTime || ""}</p>
                                                </div>
                                            </div>

                                            {isAdmin && (
                                                <div className="flex gap-2 justify-end mt-3">
                                                    <Link to={`/dashboard/edit-staff/${staff._id}`} className="btn btn-warning btn-sm text-black px-3">
                                                        <FaEdit size={13} /> Edit
                                                    </Link>
                                                    <button onClick={() => handleDelete(staff._id)} className="btn btn-error btn-sm text-white px-3">
                                                        <RiDeleteBin6Fill size={13} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffList;