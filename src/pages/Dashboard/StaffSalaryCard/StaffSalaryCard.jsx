const StaffSalaryCard = ({ staff, handleDelete, handleEdit }) => {

    const formatDate = (date) => {
        if (!date) return "No date";
        return new Date(date).toLocaleString("bn-BD");
    };

    const safeNumber = (value) => Number(value) || 0;

    const weeklyTotal =
        safeNumber(staff.w1) +
        safeNumber(staff.w2) +
        safeNumber(staff.w3) +
        safeNumber(staff.w4);

    const remainingBalance =
        safeNumber(staff.monthlySalary) - safeNumber(staff.totalTaken);

    return (
        <div className="rounded-2xl shadow-lg p-5 bg-gray-900 text-white border border-gray-700 hover:scale-[1.01] transition">

            {/* NAME */}
            <h2 className="text-xl font-bold text-orange-400">
                {staff?.name || "Unknown Staff"}
            </h2>

            {/* DATE */}
            <p className="text-xs text-gray-400 mt-1">
                📅 {formatDate(staff?.createdAt)}
            </p>

            {/* MONTH */}
            <p className="text-sm text-yellow-400 mt-1">
                📆 {staff?.month || "No Month"}
            </p>

            {/* SALARY INFO */}
            <div className="mt-3 space-y-1">
                <p>💰 Salary: ৳{safeNumber(staff?.monthlySalary)}</p>
                <p>💸 Withdrawal: ৳{safeNumber(staff?.totalTaken)}</p>
            </div>

            {/* WEEKLY DETAILS */}
            <div className="mt-3 text-sm text-gray-300 space-y-1">
                <p>Week 1: ৳{safeNumber(staff?.w1)}</p>
                <p>Week 2: ৳{safeNumber(staff?.w2)}</p>
                <p>Week 3: ৳{safeNumber(staff?.w3)}</p>
                <p>Week 4: ৳{safeNumber(staff?.w4)}</p>
            </div>

            {/* TOTAL */}
            <p className="text-yellow-400 mt-2 font-semibold">
                Weekly Total: ৳{weeklyTotal}
            </p>

            {/* BALANCE */}
            <p className="text-green-400 font-bold mt-2">
                Balance: ৳{remainingBalance}
            </p>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 mt-4">

                <button
                    onClick={() => handleEdit?.(staff)}
                    className="btn btn-warning btn-sm"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete?.(staff?._id)}
                    className="btn btn-error btn-sm"
                >
                    Delete
                </button>

            </div>

        </div>
    );
};

export default StaffSalaryCard;