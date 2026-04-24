import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // ১. useNavigate ইমপোর্ট করুন
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddStaff = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate(); // ২. নেভিগেট ফাংশনটি কল করুন

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const now = new Date();
        const date = now.toLocaleDateString('bn-BD');
        const time = now.toLocaleTimeString('bn-BD');

        const staffData = {
            name: form.name.value,
            monthlySalary: parseFloat(form.salary.value),
            totalTaken: parseFloat(form.taken.value),
            weeklyExpenses: [
                parseFloat(form.w1.value) || 0,
                parseFloat(form.w2.value) || 0,
                parseFloat(form.w3.value) || 0,
                parseFloat(form.w4.value) || 0
            ],
            month: form.month.value,
            year: now.getFullYear(),
            submissionDate: date,
            submissionTime: time
        };

        try {
            const res = await axiosSecure.post('/staffs', staffData);

            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'সফল!',
                    text: 'স্টাফ ডাটা সেভ করা হয়েছে',
                    showConfirmButton: false,
                    timer: 1500
                });

                form.reset();

                // সংশোধন ২: আপনার router ফাইলে পাথ দেওয়া আছে 'staff-records'
                navigate('/staff-records');
            }
        } catch (error) {
            console.error("Error adding staff:", error);
            Swal.fire({
                icon: 'error',
                title: 'ভুল হয়েছে',
                text: 'সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। API লিঙ্ক চেক করুন।',
            });
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-5 text-center">নতুন স্টাফ ডাটা যোগ করুন</h2>
            <form onSubmit={handleSubmit} className="p-10 bg-white shadow-xl rounded-lg max-w-xl mx-auto grid grid-cols-2 gap-4 border">
                {/* ... আপনার বাকি ইনপুট ফিল্ডগুলো এখানে থাকবে ... */}
                <input type="text" name="name" placeholder="স্টাফের নাম" className="input input-bordered w-full col-span-2" required />
                <input type="number" name="salary" placeholder="মাসিক বেতন" className="input input-bordered w-full" required />
                <input type="number" name="taken" placeholder="মোট কত নিয়েছেন" className="input input-bordered w-full" required />

                <p className="col-span-2 font-semibold mt-2 text-gray-500">সাপ্তাহিক খরচসমূহ:</p>
                <input type="number" name="w1" placeholder="সপ্তাহ ১" className="input input-bordered w-full" />
                <input type="number" name="w2" placeholder="সপ্তাহ ২" className="input input-bordered w-full" />
                <input type="number" name="w3" placeholder="সপ্তাহ ৩" className="input input-bordered w-full" />
                <input type="number" name="w4" placeholder="সপ্তাহ ৪" className="input input-bordered w-full" />

                <select name="month" className="select select-bordered w-full col-span-2" required defaultValue="">
                    <option value="" disabled>মাস নির্বাচন করুন</option>
                    <option value="January">জানুয়ারি</option>
                    <option value="February">ফেব্রুয়ারি</option>
                    <option value="March">মার্চ</option>
                    <option value="April">এপ্রিল</option>
                    <option value="May">মে</option>
                    <option value="June">জুন</option>
                    <option value="July">জুলাই</option>
                    <option value="August">আগস্ট</option>
                    <option value="September">সেপ্টেম্বর</option>
                    <option value="October">অক্টোবর</option>
                    <option value="November">নভেম্বর</option>
                    <option value="December">ডিসেম্বর</option>
                </select>

                <button type="submit" className="btn btn-primary w-full col-span-2 mt-4 text-white uppercase">সেভ করুন</button>
            </form>
        </div>
    );
};

export default AddStaff;