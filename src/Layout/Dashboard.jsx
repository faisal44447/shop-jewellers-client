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
    FaUserShield,
    FaClipboardList,
    FaCashRegister,
    FaChartLine,
    FaUserPlus,
    FaFileInvoiceDollar,
    FaBoxes,
    FaWallet,
} from "react-icons/fa";

const Dashboard = () => {
    const { user } = useAuth();
    const [isAdmin] = useAdmin();

    // মোবাইল স্ক্রিনে টেক্সট ও আইকন স্পষ্ট করার জন্য কালার অপ্টিমাইজেশন
    const linkStyle = ({ isActive }) =>
        `flex flex-col items-center justify-center min-w-[70px] py-1.5 px-2 rounded-xl transition-all duration-200 text-[11px] font-semibold flex-shrink-0 ${isActive
            ? "bg-white text-orange-600 shadow-md transform scale-105"
            : "text-orange-100 hover:bg-orange-600 hover:text-white"
        }`;

    return (
        <div className="min-h-screen bg-gray-100 -mt-10">

            {/* PAGE CONTENT */}
            <div className="pb-32"> {/* বটম নেভবার যাতে কন্টেন্ট ঢেকে না ফেলে তাই প্যাডিং বাড়ানো হয়েছে */}
                <div className="w-full max-w-7xl mx-auto p-2 md:p-4">
                    <Outlet />
                </div>
            </div>

            {/* ================= BOTTOM NAVBAR ================= */}
            <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] lg:w-[75%] bg-orange-500 rounded-2xl shadow-2xl z-50 px-2 py-2">

                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none snap-x touch-pan-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

                    {/* USER IMAGE */}
                    <div className="flex-shrink-0 px-1">
                        <img
                            src={
                                user?.photoURL ||
                                "https://i.ibb.co/mJR9mkv/default-user.png"
                            }
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                            alt="user"
                        />
                    </div>

                    {/* ================= COMMON LINKS ================= */}
                    <NavLink to="/dashboard/userHome" className={linkStyle}>
                        <FaHome className="text-base" />
                        <span>Home</span>
                    </NavLink>

                    <NavLink to="/" className={linkStyle}>
                        <FaArrowLeft className="text-base" />
                        <span>Back</span>
                    </NavLink>

                    <NavLink to="/dashboard/product-card-page" className={linkStyle}>
                        <FaBoxOpen className="text-base" />
                        <span>Products</span>
                    </NavLink>

                    <NavLink to="/dashboard/cash-list" className={linkStyle}>
                        <FaWallet className="text-base" />
                        <span>Cash</span>
                    </NavLink>

                    <NavLink to="/dashboard/sales" className={linkStyle}>
                        <FaCashRegister className="text-base" />
                        <span>Sales</span>
                    </NavLink>

                    <NavLink to="/dashboard/sold-products" className={linkStyle}>
                        <FaClipboardList className="text-base" />
                        <span>Sold</span>
                    </NavLink>

                    <NavLink to="/dashboard/cart" className={linkStyle}>
                        <FaShoppingCart className="text-base" />
                        <span>Cart</span>
                    </NavLink>

                    <NavLink to="/dashboard/expense-list" className={linkStyle}>
                        <FaMoneyBill className="text-base" />
                        <span>Expense</span>
                    </NavLink>

                    <NavLink to="/dashboard/profit-list" className={linkStyle}>
                        <FaChartLine className="text-base" />
                        <span>Profit</span>
                    </NavLink>

                    <NavLink to="/dashboard/paboTaka-list" className={linkStyle}>
                        <FaHandHoldingUsd className="text-base" />
                        <span>Pabo</span>
                    </NavLink>

                    <NavLink to="/dashboard/howlad-list" className={linkStyle}>
                        <FaFileInvoiceDollar className="text-base" />
                        <span>Howlad</span>
                    </NavLink>

                    <NavLink to="/dashboard/staff-list" className={linkStyle}>
                        <FaUsers className="text-base" />
                        <span>Staff</span>
                    </NavLink>

                    {/* ================= ADMIN ONLY ================= */}
                    {isAdmin && (
                        <>
                            <NavLink to="/dashboard/adminHome" className={linkStyle}>
                                <FaUserShield className="text-base" />
                                <span>Admin</span>
                            </NavLink>

                            <NavLink to="/dashboard/all-users" className={linkStyle}>
                                <FaUsers className="text-base" />
                                <span>Users</span>
                            </NavLink>

                            <NavLink to="/dashboard/manage-product" className={linkStyle}>
                                <FaBoxes className="text-base" />
                                <span>Manage</span>
                            </NavLink>

                            <NavLink to="/dashboard/staff-list" className={linkStyle}>
                                <FaUserPlus className="text-base" />
                                <span>+Staff</span>
                            </NavLink>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;