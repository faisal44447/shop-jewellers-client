import { FaEdit, FaTrashAlt } from "react-icons/fa";
import useAdmin from "../../../hooks/useAdmin";

const StaffSalaryCard = ({ staff, handleDelete, handleEdit }) => {
    const [isAdmin] = useAdmin(); // ✅ FIX

    const remaining = staff.monthlySalary - staff.totalTaken;

    return (
        <div className="card shadow p-4">
            <h2>{staff.name}</h2>

            {isAdmin && (
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(staff)}>
                        <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(staff._id)}>
                        <FaTrashAlt />
                    </button>
                </div>
            )}

            <p>Salary: {staff.monthlySalary}</p>
            <p>Taken: {staff.totalTaken}</p>
            <p>Remaining: {remaining}</p>
        </div>
    );
};

export default StaffSalaryCard;