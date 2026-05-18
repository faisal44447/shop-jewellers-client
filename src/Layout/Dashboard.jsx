import { useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";

import {
    FaHome,
    FaBoxOpen,
    FaShoppingCart,
    FaMoneyBill,
    FaUsers,
    FaHandHoldingUsd,
    FaArrowLeft,
    FaCashRegister,
    FaChartLine,
    FaUserPlus,
    FaFileInvoiceDollar,
    FaBoxes,
    FaWallet,
    FaClipboardList
} from "react-icons/fa";

const Dashboard = () => {
    const { user } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();
    const scrollContainerRef = useRef(null);

    // মাউস দিয়ে ক্লিক করে টেনে (Drag) স্ক্রোল করার জন্য স্টেট
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // ১. মাউসের চাকা ঘুরালে ডানে-বামে স্ক্রোল করার লজিক
    const handleWheel = (e) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += e.deltaY * 1.5; // ১.৫ গুণ গতি বাড়ানো হয়েছে
        }
    };

    // ২. মাউস ক্লিক করে ড্র্যাগ (Drag) শুরু করার লজিক
    const handleMouseDown = (e) => {
        setIsDown(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    // মাউস ছেড়ে দিলে বা কন্টেইনারের বাইরে চলে গেলে
    const handleMouseLeaveOrUp = () => {
        setIsDown(false);
    };

    // মাউস ড্র্যাগ করার সময় স্ক্রোল মুভমেন্ট
    const handleMouseMove = (e) => {
        if (!isDown) return;

        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // স্ক্রোলের স্পিড দ্বিগুণ করা হয়েছে

        // 🎯 ফিক্স: ক্লিক করার সময় হাত সামান্য নড়লে যেন লিংক কাজ করে (Threshold সেট করা হলো)
        if (Math.abs(x - startX) > 5) {
            e.preventDefault(); // শুধুমাত্র বেশি দূর ড্র্যাগ করলেই ডিফল্ট ক্লিক আটকাবে
        }

        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const linkStyle = ({ isActive }) =>
        `flex flex-col items-center justify-center min-w-[70px] sm:min-w-[75px] md:min-w-[95px] py-2 px-1 sm:px-2 rounded-2xl transition-all duration-300 flex-shrink-0 gap-1 text-center select-none ${isActive
            ? "bg-white text-orange-600 shadow-lg scale-105 font-bold"
            : "text-orange-50 hover:bg-orange-400/50"
        }`;

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex flex-col">

            {/* PAGE CONTENT CONTAINER */}
            <div className="relative z-10 flex-1 pt-6 pb-48">
                <div className="w-full max-w-7xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-sm min-h-[70vh] p-4 md:p-6 border border-gray-100">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* ================= BOTTOM NAVBAR ================= */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[96%] md:w-[94%] lg:w-[90%] xl:w-[85%] z-50">
                <div className="bg-orange-600/95 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/20">

                    {/* SCROLLABLE / FLEX BOX */}
                    <div
                        ref={scrollContainerRef}
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeaveOrUp}
                        onMouseUp={handleMouseLeaveOrUp}
                        onMouseMove={handleMouseMove}
                        className={`overflow-x-auto no-scrollbar w-full py-3 px-4 ${isDown ? "cursor-grabbing" : "cursor-grab"
                            }`}
                        style={{
                            WebkitOverflowScrolling: "touch",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        {/* CSS: স্ক্রোলবার হাইড করার জন্য */}
                        <style>{`
                            .no-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>

                        <div className="flex items-center justify-start gap-1 sm:gap-2 md:gap-4 min-w-max mx-auto">

                            {/* PROFILE */}
                            <div className="flex-shrink-0 bg-transparent pr-1 md:pr-2 sticky left-0 z-10 pointer-events-none">
                                <img
                                    src={
                                        user?.photoURL ||
                                        "https://i.ibb.co/mJR9mkv/default-user.png"
                                    }
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover shadow-md"
                                    alt="user"
                                />
                            </div>

                            {/* LINKS */}
                            <NavLink to="/dashboard/userHome" className={linkStyle}>
                                <FaHome className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Home</span>
                            </NavLink>

                            <NavLink to="/" className={linkStyle}>
                                <FaArrowLeft className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Back</span>
                            </NavLink>

                            <NavLink to="/dashboard/product-card-page" className={linkStyle}>
                                <FaBoxOpen className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Products</span>
                            </NavLink>

                            <NavLink to="/dashboard/sales" className={linkStyle}>
                                <FaCashRegister className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Sales</span>
                            </NavLink>

                            <NavLink to="/dashboard/sold-products" className={linkStyle}>
                                <FaClipboardList className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Sold</span>
                            </NavLink>

                            <NavLink to="/dashboard/cash-list" className={linkStyle}>
                                <FaWallet className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Cash</span>
                            </NavLink>

                            <NavLink to="/dashboard/cart" className={linkStyle}>
                                <FaShoppingCart className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Cart</span>
                            </NavLink>

                            <NavLink to="/dashboard/expense-list" className={linkStyle}>
                                <FaMoneyBill className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Expense</span>
                            </NavLink>

                            <NavLink to="/dashboard/profit-list" className={linkStyle}>
                                <FaChartLine className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Profit</span>
                            </NavLink>

                            <NavLink to="/dashboard/paboTaka-list" className={linkStyle}>
                                <FaHandHoldingUsd className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Pabo</span>
                            </NavLink>

                            <NavLink to="/dashboard/howlad-list" className={linkStyle}>
                                <FaFileInvoiceDollar className="text-lg md:text-xl" />
                                <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Howlad</span>
                            </NavLink>

                            {/* ADMIN LINKS */}
                            {!isAdminLoading && isAdmin && (
                                <>
                                    <NavLink to="/dashboard/all-users" className={linkStyle}>
                                        <FaUsers className="text-lg md:text-xl" />
                                        <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Users</span>
                                    </NavLink>

                                    <NavLink to="/dashboard/manage-product" className={linkStyle}>
                                        <FaBoxes className="text-lg md:text-xl" />
                                        <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Manage</span>
                                    </NavLink>

                                    <NavLink to="/dashboard/staff-list" className={linkStyle}>
                                        <FaUserPlus className="text-lg md:text-xl" />
                                        <span className="text-[9px] md:text-[11px] uppercase tracking-tighter sm:tracking-normal">Staff</span>
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;