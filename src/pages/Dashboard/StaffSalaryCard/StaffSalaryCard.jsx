const StaffSalaryCard = ({ staff, handleDelete, handleEdit }) => {

    const formatDate = (date) => {
        if (!date) return "No date";
        return new Date(date).toLocaleString("bn-BD");
    };

    const weeklyTotal =
        (staff.w1 || 0) +
        (staff.w2 || 0) +
        (staff.w3 || 0) +
        (staff.w4 || 0);

    return (
        <div className="rounded-2xl shadow-lg p-5 bg-gray-900 text-white border border-gray-700">

            {/* NAME */}
            <h2 className="text-xl font-bold">{staff.name}</h2>

            {/* DATE + TIME */}
            <p className="text-xs text-gray-400 mt-1">
                📅 {formatDate(staff.createdAt)}
            </p>

            {/* MONTH */}
            <p className="text-sm text-yellow-400 mt-1">
                📆 {staff.month}
            </p>

            {/* SALARY */}
            <p className="mt-2">💰 Salary: ৳{staff.monthlySalary}</p>
            <p>💸 Withdrawal: ৳{staff.totalTaken}</p>

            {/* WEEKLY */}
            <div className="mt-3 text-sm text-gray-300">
                <p>Week 1: ৳{staff.w1 || 0}</p>
                <p>Week 2: ৳{staff.w2 || 0}</p>
                <p>Week 3: ৳{staff.w3 || 0}</p>
                <p>Week 4: ৳{staff.w4 || 0}</p>
            </div>

            {/* TOTAL */}
            <p className="text-yellow-400 mt-2">
                Weekly Total: ৳{weeklyTotal}
            </p>

            {/* BALANCE */}
            <p className="text-green-400 font-bold mt-2">
                Balance: ৳{(staff.monthlySalary || 0) - (staff.totalTaken || 0)}
            </p>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 mt-4">

                <button onClick={() => handleEdit(staff)} className="btn btn-warning btn-sm">
                    Edit
                </button>

                <button onClick={() => handleDelete(staff._id)} className="btn btn-error btn-sm">
                    Delete
                </button>

            </div>

        </div>
    );
};

export default StaffSalaryCard;