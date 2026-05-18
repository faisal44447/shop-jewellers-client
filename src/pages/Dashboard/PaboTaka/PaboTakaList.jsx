import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAdmin from "../../../hooks/useAdmin";
import { formatDateTime } from "../../../utils/formatDateTime";
import { FaEdit, FaTrash, FaMoneyBillWave } from "react-icons/fa";

const PaboTakaList = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin] = useAdmin();
    const axiosSecure = useAxiosSecure();

    // ================= FETCH DATA =================
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axiosSecure.get("/receivables");
            setList(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Fetch error:", error);
            Swal.fire({ icon: "error", title: "Failed to load data" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ================= DELETE =================
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the record",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
        });
        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.delete(`/receivables/${id}`);
            Swal.fire({ icon: "success", title: "Deleted successfully", timer: 1200, showConfirmButton: false });
            fetchData();
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: "error", title: "Delete failed" });
        }
    };

    // ================= EDIT =================
    const handleEdit = async (item) => {
        const currentType = item.amount < 0 ? "minus" : "plus";
        const currentAmount = Math.abs(item.amount);

        // ISO ডেট ফরম্যাট থেকে datetime-local এর উপযোগী ফরম্যাটে রূপান্তর
        const currentDate = item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 16) : "";

        const { value } = await Swal.fire({
            title: "Edit Pabo Taka Record",
            html: `
        <div style="text-align: left; display: flex; flex-direction: column; gap: 10px;">
          <label style="font-weight: 600; font-size: 14px;">Customer Name:</label>
          <input id="swal-name" class="swal2-input" style="margin:0; width:100%" placeholder="Name" value="${item?.name || ""}">
          
          <label style="font-weight: 600; font-size: 14px; margin-top: 8px;">Transaction Type:</label>
          <select id="swal-type" class="swal2-input" style="margin:0; width:100%">
            <option value="minus" ${currentType === "minus" ? "selected" : ""}>দোকানের baki ba hawlad dele (-)</option>
            <option value="plus" ${currentType === "plus" ? "selected" : ""}>hawlad ba baki taka deye dele (+)</option>
          </select>
          
          <label style="font-weight: 600; font-size: 14px; margin-top: 8px;">Amount:</label>
          <input id="swal-amount" type="number" class="swal2-input" style="margin:0; width:100%" placeholder="Amount" value="${currentAmount}">
          
          <label style="font-weight: 600; font-size: 14px; margin-top: 8px;">Date (Optional):</label>
          <input id="swal-date" type="datetime-local" class="swal2-input" style="margin:0; width:100%" value="${currentDate}">
        </div>
      `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const name = document.getElementById("swal-name").value;
                const type = document.getElementById("swal-type").value;
                const amountInput = Math.abs(Number(document.getElementById("swal-amount").value));
                const date = document.getElementById("swal-date").value;

                const finalAmount = type === "minus" ? -amountInput : amountInput;
                return { name, amount: finalAmount, date };
            },
        });

        if (value) {
            try {
                await axiosSecure.patch(`/receivables/${item._id}`, value);
                Swal.fire({ icon: "success", title: "Updated successfully", timer: 1200, showConfirmButton: false });
                fetchData();
            } catch (error) {
                Swal.fire({ icon: "error", title: "Update failed" });
            }
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
        <div className="p-5 mt-10">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-green-500 flex justify-center items-center gap-2">
                    <FaMoneyBillWave /> Pabo Taka / Receivable List
                </h2>
                <p className="text-gray-500 mt-2">Total Records: {list.length}</p>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl shadow">
                <table className="table">
                    <thead className="bg-orange-100 text-orange-600">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Type / Status</th>
                            <th>Amount</th>
                            <th>Date & Time</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item, index) => {
                            const dt = formatDateTime(item.createdAt);
                            const isMinus = item.amount < 0;
                            return (
                                <tr key={item._id} className="hover">
                                    <td className="text-black">{index + 1}</td>
                                    <td className="font-bold text-black">{item?.name}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isMinus ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                                            {isMinus ? "বাকি দেওয়া হয়েছে (-)" : "টাকা আদায় হয়েছে (+)"}
                                        </span>
                                    </td>
                                    <td className={`font-bold ${isMinus ? "text-red-500" : "text-green-600"}`}>
                                        {isMinus ? `- ৳${Math.abs(item.amount)}` : `+ ৳${item.amount}`}
                                    </td>
                                    <td className="text-black">
                                        {dt?.date} <br />
                                        <span className="text-gray-500 text-sm">{dt?.time}</span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(item)} className="btn btn-sm btn-ghost text-blue-500">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-ghost text-red-500">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaboTakaList;