import { NavLink, Outlet } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

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
    const { user } = useAuth();

    if (isAdminLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner text-warning loading-lg"></span>
            </div>
        );
    }

    const linkStyle = ({ isActive }) =>
        `flex items-center gap-3 p-2 rounded-lg transition-all ${isActive ? "bg-red-600 text-white" : "hover:bg-red-500 text-white"
        }`;

    return (
        <div className="flex min-h-screen">

            {/* SIDEBAR */}
            <div className="w-64 bg-orange-500 text-white p-4">

                <div className="text-center mb-5">
                    <img
                        src={user?.photoURL || "https://i.ibb.co/mJR9mkv/default-user.png"}
                        className="w-16 h-16 rounded-full mx-auto"
                    />
                    <h2 className="font-bold">{user?.displayName || "User"}</h2>
                    <p>{isAdmin ? "Admin" : "User"}</p>
                </div>

                <ul className="space-y-2">

                    {isAdmin && (
                        <>
                            <li><NavLink to="/dashboard/adminHome" className={linkStyle}><FaHome /> Home</NavLink></li>
                            <li><NavLink to="/dashboard/add-product" className={linkStyle}><FaPlus /> Add Product</NavLink></li>
                            <li><NavLink to="/dashboard/manage-product" className={linkStyle}><FaBoxOpen /> Manage</NavLink></li>

                            {/* FIXED ROUTES */}
                            <li><NavLink to="/dashboard/expense-list" className={linkStyle}><FaMoneyBill /> Expenses</NavLink></li>
                            <li><NavLink to="/dashboard/paboTaka" className={linkStyle}><FaMoneyCheckAlt /> Pabo</NavLink></li>
                            <li><NavLink to="/dashboard/profit-list" className={linkStyle}>💸 Profit</NavLink></li>

                            <li><NavLink to="/dashboard/sales" className={linkStyle}><FaShoppingCart /> Sales</NavLink></li>
                            <li><NavLink to="/dashboard/staff-list" className={linkStyle}><FaUsers /> Staff</NavLink></li>
                        </>
                    )}

                    {!isAdmin && (
                        <>
                            <li><NavLink to="/dashboard/userHome" className={linkStyle}><FaHome /></NavLink></li>
                            <li><NavLink to="/dashboard/products" className={linkStyle}><FaBoxOpen /></NavLink></li>
                            <li><NavLink to="/dashboard/cart" className={linkStyle}><FaShoppingCart /> ({cart?.length})</NavLink></li>
                        </>
                    )}

                    <li className="mt-5 border-t pt-3">
                        <NavLink to="/" className={linkStyle}>
                            <FaArrowLeft /> Back
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-6 bg-gray-50">
                <Outlet />
            </div>

        </div>
    );
};

export default Dashboard;