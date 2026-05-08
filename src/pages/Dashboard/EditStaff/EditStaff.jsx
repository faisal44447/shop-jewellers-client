import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const EditStaff = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);

    // ================= LOAD SINGLE STAFF =================
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axiosSecure.get(`/staffs/${id}`);
                setStaff(res.data);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to load staff", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [id, axiosSecure]);

    // ================= UPDATE STAFF =================
    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;

        const name = form.name.value.trim();
        const salary = Number(form.salary.value);
        const taken = Number(form.taken.value);

        // ✅ validation fix
        if (!name || isNaN(salary) || isNaN(taken)) {
            return Swal.fire(
                "Error",
                "Please fill all fields correctly",
                "error"
            );
        }

        const updatedData = {
            name,
            monthlySalary: salary,
            totalTaken: taken,
            month: staff?.month || "",
            year: staff?.year || new Date().getFullYear(),
            submissionDate: staff?.submissionDate || "",
            submissionTime: staff?.submissionTime || "",
        };

        try {
            const res = await axiosSecure.put(`/staffs/${id}`, updatedData);

            // safer check
            if (res.data?.modifiedCount > 0 || res.data?.success) {
                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Staff updated successfully",
                }).then(() => {
                    navigate("/dashboard/staff-list");
                });
            } else {
                Swal.fire("Info", "No changes were made", "info");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Update failed", "error");
        }
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <p className="text-center mt-10 text-lg">
                Loading...
            </p>
        );
    }

    if (!staff) {
        return (
            <p className="text-center mt-10 text-red-500">
                Staff not found
            </p>
        );
    }

    return (
        <div className="p-10 max-w-xl mx-auto">

            <h2 className="text-3xl font-bold mb-5 text-center">
                Edit Staff
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">

                {/* NAME */}
                <input
                    defaultValue={staff.name}
                    name="name"
                    className="input input-bordered w-full"
                    placeholder="Name"
                    required
                />

                {/* SALARY */}
                <input
                    defaultValue={staff.monthlySalary}
                    name="salary"
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="Monthly Salary"
                    required
                />

                {/* TAKEN */}
                <input
                    defaultValue={staff.totalTaken}
                    name="taken"
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="Total Taken"
                    required
                />

                {/* BUTTON */}
                <button className="btn btn-primary w-full">
                    Update Staff
                </button>

            </form>
        </div>
    );
};

export default EditStaff;