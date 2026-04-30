import { FaEdit, FaTrashAlt } from "react-icons/fa";
import useAdmin from "../../../hooks/useAdmin";

const StaffSalaryCard = ({ staff, handleDelete, handleEdit }) => {
    const [isAdmin] = useAdmin(); // ✅ FIX

    const remaining = staff.monthlySalary - staff.totalTaken;

    return (
        <div className="rounded-2xl shadow-lg p-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white hover:scale-105 transition duration-300">

            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">{staff.name}</h2>
                <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                    {staff.month}
                </span>
            </div>

            <p className="text-sm">💰 Salary: ৳{staff.monthlySalary}</p>
            <p className="text-sm">📉 Taken: ৳{staff.totalTaken}</p>

            <p className="text-green-400 font-semibold mt-2">
                💵 Balance: ৳{staff.monthlySalary - staff.totalTaken}
            </p>

            <div className="text-xs text-gray-300 mt-2">
                📆 {staff.submissionDate} <br />
                ⏰ {staff.submissionTime}
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-sm bg-yellow-500 text-black border-none">
                    Edit
                </button>
                <button className="btn btn-sm bg-red-500 border-none">
                    Delete
                </button>
            </div>

        </div>
    );
};

export default StaffSalaryCard;