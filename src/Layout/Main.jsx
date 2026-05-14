import { Outlet } from "react-router-dom";
import NavBar from "../pages/Shared/NavBar/NavBar";
import Footer from '../pages/Shared/Footer/Footer';

const Main = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">

            {/* 📱 মোবাইল ও ডেক্সটপ ফ্রেন্ডলি নেভবার কন্টেইনার */}
            {/* top-3 বা top-6 দিয়ে পুরো বারটিকে উপর থেকে নিচে নামিয়ে দেওয়া হয়েছে */}
            <div className="fixed top-4 md:top-6 left-0 w-full z-50">
                <div className="mx-auto max-w-7xl px-2 md:px-4 text-black">
                    <NavBar />
                </div>
            </div>

            {/* 💎 মেইন কন্টেন্ট এরিয়া (Outlet) */}
            {/* নেভবার নিচে নামানোর কারণে কন্টেন্টকেও আরও নিচে নামাতে হবে, তাই pt-36 করা হলো */}
            <div className="pt-24 md:pt-32 flex-grow">
                <div className="w-full max-w-7xl mx-auto text-black">
                    <Outlet />
                </div>
            </div>

            {/* ফুটার */}
            <Footer />
        </div>
    );
};

export default Main;