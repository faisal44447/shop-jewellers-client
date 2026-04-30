const StaffSalaryCard = ({ staff, handleDelete, handleEdit }) => {
    return (
        <div className="rounded-2xl shadow-lg p-5 bg-gray-800 text-white">

            <h2 className="text-xl font-bold">{staff.name}</h2>

            <p>💰 Salary: ৳{staff.monthlySalary}</p>
            <p>💸 Withdrawal: ৳{staff.totalTaken}</p>

            <p className="text-green-400 font-bold">
                Balance: ৳{staff.monthlySalary - staff.totalTaken}
            </p>

            <div className="flex justify-end gap-2 mt-4">

                <button
                    onClick={() => handleEdit(staff)}
                    className="btn btn-sm btn-warning"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(staff._id)}
                    className="btn btn-sm btn-error"
                >
                    Delete
                </button>

            </div>

        </div>
    );
};

export default StaffSalaryCard;