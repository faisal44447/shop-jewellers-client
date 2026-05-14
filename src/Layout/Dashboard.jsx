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

    const linkStyle = ({ isActive }) =>
        `flex flex-col items-center justify-center min-w-[75px] py-2 px-2 rounded-2xl transition-all duration-300 flex-shrink-0 gap-1 ${isActive
            ? "bg-white text-orange-600 shadow-lg scale-105 font-bold"
            : "text-orange-50 hover:bg-orange-400/50"
        }`;

    return (
        <div className="min-h-screen bg-[#F3F4F6]">

            {/* PAGE CONTENT */}
            <div className="relative z-10 pb-40 pt-4">
                <div className="w-full max-w-7xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-sm min-h-[70vh] p-4 border border-gray-100">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* ================= BOTTOM NAVBAR ================= */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[96%] md:w-[88%] lg:w-[72%] z-50">

                <div className="bg-orange-600/95 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/20">

                    {/* SCROLLABLE AREA */}
                    <div
                        className="overflow-x-auto no-scrollbar"
                        style={{
                            WebkitOverflowScrolling: "touch",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        <div className="flex items-center gap-2 px-4 py-3 min-w-max">

                            {/* PROFILE */}
                            <div className="flex-shrink-0 sticky left-0 z-20 bg-orange-600 pr-2">
                                <img
                                    src={
                                        user?.photoURL ||
                                        "https://i.ibb.co/mJR9mkv/default-user.png"
                                    }
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
                                    alt="user"
                                />
                            </div>

                            {/* LINKS */}
                            <NavLink to="/dashboard/userHome" className={linkStyle}>
                                <FaHome className="text-lg" />
                                <span className="text-[9px] uppercase">Home</span>
                            </NavLink>

                            <NavLink to="/" className={linkStyle}>
                                <FaArrowLeft className="text-lg" />
                                <span className="text-[9px] uppercase">Back</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/product-card-page"
                                className={linkStyle}
                            >
                                <FaBoxOpen className="text-lg" />
                                <span className="text-[9px] uppercase">
                                    Products
                                </span>
                            </NavLink>

                            <NavLink to="/dashboard/sales" className={linkStyle}>
                                <FaCashRegister className="text-lg" />
                                <span className="text-[9px] uppercase">Sales</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/sold-products"
                                className={linkStyle}
                            >
                                <FaClipboardList className="text-lg" />
                                <span className="text-[9px] uppercase">Sold</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/cash-list"
                                className={linkStyle}
                            >
                                <FaWallet className="text-lg" />
                                <span className="text-[9px] uppercase">Cash</span>
                            </NavLink>

                            <NavLink to="/dashboard/cart" className={linkStyle}>
                                <FaShoppingCart className="text-lg" />
                                <span className="text-[9px] uppercase">Cart</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/expense-list"
                                className={linkStyle}
                            >
                                <FaMoneyBill className="text-lg" />
                                <span className="text-[9px] uppercase">
                                    Expense
                                </span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/profit-list"
                                className={linkStyle}
                            >
                                <FaChartLine className="text-lg" />
                                <span className="text-[9px] uppercase">
                                    Profit
                                </span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/paboTaka-list"
                                className={linkStyle}
                            >
                                <FaHandHoldingUsd className="text-lg" />
                                <span className="text-[9px] uppercase">Pabo</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/howlad-list"
                                className={linkStyle}
                            >
                                <FaFileInvoiceDollar className="text-lg" />
                                <span className="text-[9px] uppercase">
                                    Howlad
                                </span>
                            </NavLink>

                            {/* ADMIN */}
                            {!isAdminLoading && isAdmin && (
                                <>
                                    <div className="w-[1px] h-8 bg-white/20 mx-2 flex-shrink-0" />

                                    <NavLink
                                        to="/dashboard/all-users"
                                        className={linkStyle}
                                    >
                                        <FaUsers className="text-lg" />
                                        <span className="text-[9px] uppercase">
                                            Users
                                        </span>
                                    </NavLink>

                                    <NavLink
                                        to="/dashboard/manage-product"
                                        className={linkStyle}
                                    >
                                        <FaBoxes className="text-lg" />
                                        <span className="text-[9px] uppercase">
                                            Manage
                                        </span>
                                    </NavLink>

                                    <NavLink
                                        to="/dashboard/staff-list"
                                        className={linkStyle}
                                    >
                                        <FaUserPlus className="text-lg" />
                                        <span className="text-[9px] uppercase">
                                            Staff
                                        </span>
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