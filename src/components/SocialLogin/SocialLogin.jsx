import { FaGoogle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const SocialLogin = () => {
    const { googleSignIn } = useAuth();

    const handleGoogleSignIn = async () => {
        const ua = navigator.userAgent;

        // 📱 ১. অ্যাপের ভেতরের ব্রাউজার চেক (Facebook, Messenger, Instagram, WhatsApp, Twitter, Line ইত্যাদি)
        const isInApp = /FBAN|FBAV|Instagram|Twitter|TGAndroid|Line|WhatsApp|GSA/i.test(ua);

        // 🌐 ২. ফোনের নিজস্ব দুর্বল ব্রাউজার চেক (Mi Browser, Oppo, Vivo, Samsung Internet ইত্যাদি)
        // তবে Samsung বা Mi ব্রাউজারে অনেক সময় ক্রোম ও সাফারির নামও থাকে, তাই নিখুঁতভাবে চেক করার লজিক:
        const isSafeBrowser = /Chrome|Safari|Firefox|Edge|CriOS|FxiOS/i.test(ua) && !/SamsungBrowser|MiuiBrowser|HeyTapBrowser|VivoBrowser/i.test(ua);

        // ইউজার যদি ইন-অ্যাপ ব্রাউজারে থাকে অথবা কোনো নিরাপদ ব্রাউজারে না থাকে
        if (isInApp || !isSafeBrowser) {
            Swal.fire({
                title: "সুরক্ষিত ব্রাউজার ব্যবহার করুন",
                text: "গুগলের সিকিউরিটি পলিসির কারণে এই ব্রাউজার থেকে লগইন ব্লক করা হয়েছে। দয়া করে এই পেজটি সরাসরি Google Chrome বা Safari ব্রাউজারে ওপেন করে চেষ্টা করুন।",
                icon: "warning",
                confirmButtonText: "ঠিক আছে",
                confirmButtonColor: "#e6b800"
            });
            return; // 🛑 রিডাইরেক্ট রান হবে না, ফলে গুগলের সেই 403 এরর পেজও আসবে না।
        }

        try {
            // 🔥 ইউজার আসল ক্রোম বা সাফারিতে থাকলে কোনো এরর ছাড়া রিডাইরেক্ট সফলভাবে কাজ করবে
            await googleSignIn();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="p-6">
            <div className="divider">OR</div>

            <button
                type="button"
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