import { FaGoogle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        // 📱 চেক করা হচ্ছে ইউজার ফেসবুক, ইনস্টাগ্রাম বা কোনো অ্যাপের ভেতরের (In-App) ব্রাউজারে আছে কিনা
        const isInsideApp = /FBAN|FBAV|Instagram|Twitter|TGAndroid|Line/i.test(navigator.userAgent);

        if (isInsideApp) {
            Swal.fire({
                title: "ব্রাউজার পরিবর্তন করুন",
                text: "গুগল সিকিউরিটির কারণে দয়া করে এই পেজটি Chrome, Safari বা ফোনের আসল ব্রাউজারে ওপেন করুন।",
                icon: "warning",
                confirmButtonText: "ঠিক আছে"
            });
            return; // 🛑 অ্যাপের ভেতর থাকলে রিডাইরেক্ট রান হবে না, ফলে গুগলের সেই 403 এররও আসবে না।
        }

        try {
            // 🔥 আসল ব্রাউজারে থাকলে রিডাইরেক্ট রান হবে (কোনো রেজাল্ট ভ্যারিয়েবল ছাড়া)
            await googleSignIn();

            // নোট: রিডাইরেক্ট হওয়ার কারণে পেজ রিলোড হবে। 
            // ইউজার ব্যাক করার পর তার ডাটা AuthProvider-এর onAuthStateChanged হ্যান্ডেল করবে।
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="p-6">
            <div className="divider">OR</div>

            <button
                onClick={handleGoogleSignIn}
                className="btn w-full flex items-center gap-2 justify-center bg-white text-black hover:bg-gray-200"
            >
                <FaGoogle className="text-red-500 text-lg" />
                Continue with Google
            </button>
        </div>
    );
};

export default SocialLogin;