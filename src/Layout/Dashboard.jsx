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

    const linkStyle = ({ isActive }) =>
        `flex flex-col items-center justify-center min-w-[68px] py-2 px-2 rounded-xl transition-all duration-200 text-[10px] font-medium flex-shrink-0 ${isActive
            ? "bg-white text-orange-600 shadow-lg"
            : "text-white hover:bg-orange-400"
        }`;

    return (
        <div className="min-h-screen bg-gray-100 -mt-10">

            {/* PAGE CONTENT */}
            <div className="pb-28">
                <div className="w-full max-w-7xl mx-auto p-2 md:p-4">
                    <Outlet />
                </div>
            </div>

            {/* ================= BOTTOM NAVBAR ================= */}
            <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[97%] md:w-[90%] lg:w-[75%] bg-orange-500 rounded-3xl shadow-2xl z-50 px-2 py-2">

                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">

                    {/* USER IMAGE */}
                    <div className="flex-shrink-0 px-1">
                        <img
                            src={
                                user?.photoURL ||
                                "https://i.ibb.co/mJR9mkv/default-user.png"
                            }
                            className="w-11 h-11 rounded-full border-2 border-white"
                            alt="user"
                        />
                    </div>

                    {/* ================= COMMON LINKS ================= */}

                    <NavLink to="/dashboard/userHome" className={linkStyle}>
                        <FaHome className="text-lg" />
                        <span>Home</span>
                    </NavLink>

                    {/* BACK */}
                    <NavLink to="/" className={linkStyle}>
                        <FaArrowLeft className="text-lg" />
                        <span>Back</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/product-card-page"
                        className={linkStyle}
                    >
                        <FaBoxOpen className="text-lg" />
                        <span>Products</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/cash-list"
                        className={linkStyle}
                    >
                        <FaWallet className="text-lg" />
                        <span>Cash</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/sales"
                        className={linkStyle}
                    >
                        <FaCashRegister className="text-lg" />
                        <span>Sales</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/sold-products"
                        className={linkStyle}
                    >
                        <FaClipboardList className="text-lg" />
                        <span>Sold</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/cart"
                        className={linkStyle}
                    >
                        <FaShoppingCart className="text-lg" />
                        <span>Cart</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/expense-list"
                        className={linkStyle}
                    >
                        <FaMoneyBill className="text-lg" />
                        <span>Expense</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/profit-list"
                        className={linkStyle}
                    >
                        <FaChartLine className="text-lg" />
                        <span>Profit</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/paboTaka-list"
                        className={linkStyle}
                    >
                        <FaHandHoldingUsd className="text-lg" />
                        <span>Pabo</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/howlad-list"
                        className={linkStyle}
                    >
                        <FaFileInvoiceDollar className="text-lg" />
                        <span>Howlad</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/staff-list"
                        className={linkStyle}
                    >
                        <FaUsers className="text-lg" />
                        <span>Staff</span>
                    </NavLink>

                    {/* ================= ADMIN ONLY ================= */}

                    {isAdmin && (
                        <>
                            {/* BACK */}
                            <NavLink to="/" className={linkStyle}>
                                <FaArrowLeft className="text-lg" />
                                <span>Back</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/adminHome"
                                className={linkStyle}
                            >
                                <FaUserShield className="text-lg" />
                                <span>Admin</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/all-users"
                                className={linkStyle}
                            >
                                <FaUsers className="text-lg" />
                                <span>Users</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/manage-product"
                                className={linkStyle}
                            >
                                <FaBoxes className="text-lg" />
                                <span>Manage</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/staff-list"
                                className={linkStyle}
                            >
                                <FaUserPlus className="text-lg" />
                                <span>Staff</span>
                            </NavLink>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;