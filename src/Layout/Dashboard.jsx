import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import useCart from "../hooks/useCart";

import {
    FaHome,
    FaBoxOpen,
    FaShoppingCart,
    FaMoneyBill,
    FaUsers,
    FaPlus,
    FaArrowLeft
} from "react-icons/fa";

const Dashboard = () => {
    const { user } = useAuth();
    const [isAdmin] = useAdmin();
    const [cart] = useCart();

    const linkStyle = ({ isActive }) =>
        `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${isActive
            ? "bg-red-600 text-white"
            : "text-white hover:bg-red-500"
        }`;

    return (
        <div className="flex min-h-screen">

            {/* SIDEBAR */}
            <div className="w-64 bg-orange-500 p-4 text-white">

                {/* USER INFO */}
                <div className="text-center mb-5">
                    <img
                        src={
                            user?.photoURL ||
                            "https://i.ibb.co/mJR9mkv/default-user.png"
                        }
                        className="w-16 h-16 rounded-full mx-auto"
                        alt="user"
                    />
                    <h2 className="font-bold">
                        {user?.displayName || "User"}
                    </h2>
                    <p>{isAdmin ? "Admin Panel" : "User Panel"}</p>
                </div>

                <ul className="space-y-2">

                    {/* USER ROUTES */}
                    {!isAdmin && (
                        <>
                            <NavLink to="/dashboard/userHome" className={linkStyle}>
                                <FaHome /> Home
                            </NavLink>

                            <NavLink to="/dashboard/sell" className={linkStyle}>
                                🛒 Sell Product
                            </NavLink>

                            <NavLink to="/dashboard/cart" className={linkStyle}>
                                <FaShoppingCart /> Cart ({cart?.length || 0})
                            </NavLink>

                            <NavLink to="/dashboard/howlad-list" className={linkStyle}>
                                <FaMoneyBill /> Howlad List
                            </NavLink>

                            <NavLink to="/dashboard/paboTaka-list" className={linkStyle}>
                                <FaMoneyBill /> Pabo Taka List
                            </NavLink>

                            <NavLink to="/dashboard/expense-list" className={linkStyle}>
                                <FaMoneyBill /> Expenses List
                            </NavLink>

                            <NavLink to="/dashboard/profit-list" className={linkStyle}>
                                💸 Profit List
                            </NavLink>

                            <NavLink to="/dashboard/staff-list" className={linkStyle}>
                                <FaUsers /> Staff List
                            </NavLink>

                        </>
                    )}

                    {/* ADMIN ROUTES */}
                    {isAdmin && (
                        <>
                            <NavLink to="/dashboard/adminHome" className={linkStyle}>
                                <FaHome /> Admin Home
                            </NavLink>

                            <NavLink to="/dashboard/userHome" className={linkStyle}>
                                <FaHome /> User View
                            </NavLink>

                            <NavLink to="/dashboard/all-users" className={linkStyle}>
                                <FaUsers /> All Users
                            </NavLink>

                            <NavLink to="/dashboard/add-product" className={linkStyle}>
                                <FaPlus /> Add Product
                            </NavLink>

                            <NavLink to="/dashboard/product-card-page" className={linkStyle}>
                                <FaBoxOpen /> Products
                            </NavLink>

                            <NavLink to="/dashboard/manage-product" className={linkStyle}>
                                <FaBoxOpen /> Manage Products
                            </NavLink>

                            <NavLink to="/dashboard/sales" className={linkStyle}>
                                <FaShoppingCart /> Sales
                            </NavLink>

                            <NavLink to="/dashboard/cart" className={linkStyle}>
                                <FaShoppingCart /> Cart
                            </NavLink>

                            <NavLink to="/dashboard/expenses" className={linkStyle}>
                                <FaMoneyBill /> Add Expenses
                            </NavLink>

                            <NavLink to="/dashboard/expense-list" className={linkStyle}>
                                <FaMoneyBill /> Expenses List
                            </NavLink>

                            <NavLink to="/dashboard/howlad-newa" className={linkStyle}>
                                <FaMoneyBill /> Add Howlad
                            </NavLink>

                            <NavLink to="/dashboard/howlad-list" className={linkStyle}>
                                <FaMoneyBill /> Howlad List
                            </NavLink>

                            <NavLink to="/dashboard/paboTaka" className={linkStyle}>
                                <FaMoneyBill /> Pabo Taka
                            </NavLink>

                            <NavLink to="/dashboard/paboTaka-list" className={linkStyle}>
                                <FaMoneyBill /> Pabo Taka List
                            </NavLink>

                            <NavLink to="/dashboard/profit-list" className={linkStyle}>
                                💸 Profit
                            </NavLink>

                            <NavLink to="/dashboard/add-profit" className={linkStyle}>
                                💸 Add Profit
                            </NavLink>

                            <NavLink to="/dashboard/add-staff" className={linkStyle}>
                                <FaUsers /> Add Staff
                            </NavLink>

                            <NavLink to="/dashboard/staff-list" className={linkStyle}>
                                <FaUsers /> Staff List
                            </NavLink>
                        </>
                    )}

                    {/* BACK */}
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