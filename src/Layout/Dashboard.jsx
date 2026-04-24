import { NavLink, Outlet } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth"; // ✅ add this

import {
    FaHome,
    FaBoxOpen,
    FaShoppingCart,
    FaUserShield,
    FaPlus,
    FaMoneyBill,
    FaTruck,
    FaMoneyCheckAlt,
    FaUsers,
    FaArrowLeft
} from "react-icons/fa";

const Dashboard = () => {
    const [cart] = useCart();
    const [isAdmin, isAdminLoading] = useAdmin();
    const { user } = useAuth(); // ✅ user info

    if (isAdminLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner text-warning loading-lg"></span>
            </div>
        );
    }

    const linkStyle = ({ isActive }) =>
        `flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${isActive
            ? "bg-red-600 text-white shadow-lg"
            : "hover:bg-red-500 hover:shadow-md text-white"
        }`;

    return (
        <div className="flex min-h-screen navbar-glow">

            {/* Sidebar */}
            <div className="w-64 bg-orange-500 text-white p-4">

                {/* ✅ ADMIN PROFILE SECTION */}
                <div className="flex flex-col items-center mb-6 p-3 bg-orange-600 rounded-xl shadow-md">
                    <img
                        src={user?.photoURL || "https://i.ibb.co/mJR9mkv/default-user.png"}
                        alt="profile"
                        className="w-16 h-16 rounded-full ring-2 ring-white"
                    />
                    <h2 className="mt-2 font-bold text-sm">
                        {user?.displayName || "Admin Name"}
                    </h2>
                    <p className="text-xs opacity-80">
                        {isAdmin ? "Admin Panel" : "User"}
                    </p>
                </div>

                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                    <FaUserShield /> Dashboard
                </h2>

                <ul className="space-y-2">

                    {isAdmin ? (
                        <>
                            <li><NavLink to="/dashboard/adminHome" className={linkStyle}><FaHome /> Admin Home</NavLink></li>
                            <li><NavLink to="/dashboard/add-product" className={linkStyle}><FaPlus /> Add Product</NavLink></li>
                            <li><NavLink to="/dashboard/manage-product" className={linkStyle}><FaBoxOpen /> Manage Product</NavLink></li>
                            <li><NavLink to="/dashboard/expense-list" className={linkStyle}><FaMoneyBill /> Expenses</NavLink></li>
                            <li><NavLink to="/dashboard/howlad-list" className={linkStyle}><FaTruck /> Howlad</NavLink></li>
                            <li><NavLink to="/dashboard/pabo-list" className={linkStyle}><FaMoneyCheckAlt /> Pabo Taka</NavLink></li>
                            <li><NavLink to="/dashboard/sales" className={linkStyle}><FaShoppingCart /> Sales</NavLink></li>
                            <li><NavLink to="/dashboard/staff-list" className={linkStyle}><FaUsers /> Staff</NavLink></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/dashboard/userHome" className={linkStyle}><FaHome /> User Home</NavLink></li>
                            <li><NavLink to="/dashboard/products" className={linkStyle}><FaBoxOpen /> Products</NavLink></li>
                            <li><NavLink to="/dashboard/cart" className={linkStyle}><FaShoppingCart /> Cart ({cart.length})</NavLink></li>
                        </>
                    )}

                    <li className="mt-5 border-t border-white/30 pt-3">
                        <NavLink to="/" className={linkStyle}>
                            <FaArrowLeft /> Back Home
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 bg-gray-50">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;