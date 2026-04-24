import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const EditStaff = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [staff, setStaff] = useState(null);

    // 🔥 load single staff
    useEffect(() => {
        axiosSecure.get(`/staffs`)
            .then(res => {
                const found = res.data.find(s => s._id === id);
                setStaff(found);
            });
    }, [id, axiosSecure]);

    // 🔥 update
    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;

        const updatedData = {
            name: form.name.value,
            monthlySalary: parseFloat(form.salary.value),
            totalTaken: parseFloat(form.taken.value),
        };

        try {
            const res = await axiosSecure.put(`/staffs/${id}`, updatedData);

            if (res.data.modifiedCount > 0) {
                Swal.fire("Success!", "Updated successfully", "success");
                navigate('/staff-records');
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Update failed", "error");
        }
    };

    if (!staff) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="p-10 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-5 text-center">Edit Staff</h2>

            <form onSubmit={handleUpdate} className="space-y-4">

                <input
                    defaultValue={staff.name}
                    name="name"
                    className="input input-bordered w-full"
                    required
                />

                <input
                    defaultValue={staff.monthlySalary}
                    name="salary"
                    type="number"
                    className="input input-bordered w-full"
                    required
                />

                <input
                    defaultValue={staff.totalTaken}
                    name="taken"
                    type="number"
                    className="input input-bordered w-full"
                    required
                />

                <button className="btn btn-primary w-full">
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditStaff;