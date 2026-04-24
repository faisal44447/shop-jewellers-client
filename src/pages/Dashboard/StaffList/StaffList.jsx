import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import StaffSalaryCard from '../StaffSalaryCard/StaffSalaryCard';

const StaffList = () => {
    const [staffs, setStaffs] = useState([]);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleEdit = (staff) => {
        navigate(`/edit-staff/${staff._id}`);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "এটি ডিলিট করলে আর ফিরে পাবেন না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
            cancelButtonText: "না"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/staffs/${id}`);
                if (res.data.deletedCount > 0) {
                    const remainingStaffs = staffs.filter(s => s._id !== id);
                    setStaffs(remainingStaffs);
                    Swal.fire("ডিলিট হয়েছে!", "রেকর্ডটি মুছে ফেলা হয়েছে।", "success");
                }
            }
        });
    };

    useEffect(() => {
        axiosSecure.get('/staffs') // আপনার ব্যাকএন্ডের রুট অনুযায়ী
            .then(res => setStaffs(res.data))
            .catch(err => console.error(err));
    }, [axiosSecure]);

    return (
        <div className="max-w-7xl mx-auto p-5">
            <h2 className="text-3xl font-bold text-center mb-10">স্টাফ বেতন ও খরচ রেকর্ড</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffs.map(staff => (
                    <StaffSalaryCard
                        key={staff._id}
                        staff={staff}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                    />
                ))}
            </div>
        </div>
    );
};

export default StaffList;