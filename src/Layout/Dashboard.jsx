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
    FaArrowLeft,
} from "react-icons/fa";

const Dashboard = () => {
    const { user } = useAuth();
    const [isAdmin] = useAdmin();
    const [cart] = useCart();

    const linkStyle = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
            isActive
                ? "bg-white text-orange-600 shadow-md"
                : "text-white hover:bg-orange-400"
        }`;

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <div className="w-72 bg-orange-500 p-5 shadow-lg">

                {/* USER INFO */}
                <div className="text-center mb-8">

                    <img
                        src={
                            user?.photoURL ||
                            "https://i.ibb.co/mJR9mkv/default-user.png"
                        }
                        className="w-20 h-20 rounded-full mx-auto border-4 border-white object-cover"
                        alt="user"
                    />

                    <h2 className="font-bold text-lg text-white mt-3">
                        {user?.displayName || "User"}
                    </h2>

                    <p className="text-sm text-orange-100">
                        {isAdmin ? "Admin Panel" : "User Panel"}
                    </p>
                </div>

                {/* MENU */}
                <ul className="space-y-2">

                    {/* USER ROUTES */}
                    {!isAdmin && (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/userHome"
                                    className={linkStyle}
                                >
                                    <FaHome />
                                    Home
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/product-card-page"
                                    className={linkStyle}
                                >
                                    <FaBoxOpen />
                                    Products
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/sales"
                                    className={linkStyle}
                                >
                                    🛒 Sell Product
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/sold-products"
                                    className={linkStyle}
                                >
                                    🧾 Sold Products
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/cart"
                                    className={linkStyle}
                                >
                                    <FaShoppingCart />
                                    Cart  
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/howlad-list"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Howlad List
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/paboTaka-list"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Pabo Taka List
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/expense-list"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Expenses List
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/profit-list"
                                    className={linkStyle}
                                >
                                    💸 Profit List
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/staff-list"
                                    className={linkStyle}
                                >
                                    <FaUsers />
                                    Staff List
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* ADMIN ROUTES */}
                    {isAdmin && (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/adminHome"
                                    className={linkStyle}
                                >
                                    <FaHome />
                                    Admin Home
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/userHome"
                                    className={linkStyle}
                                >
                                    <FaHome />
                                    User View
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/all-users"
                                    className={linkStyle}
                                >
                                    <FaUsers />
                                    All Users
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/add-product"
                                    className={linkStyle}
                                >
                                    <FaPlus />
                                    Add Product
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/product-card-page"
                                    className={linkStyle}
                                >
                                    <FaBoxOpen />
                                    Products
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/manage-product"
                                    className={linkStyle}
                                >
                                    <FaBoxOpen />
                                    Manage Products
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/sales"
                                    className={linkStyle}
                                >
                                    🛒 Sell Product
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/sold-products"
                                    className={linkStyle}
                                >
                                    🧾 Sold Products
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/cart"
                                    className={linkStyle}
                                >
                                    <FaShoppingCart />
                                    Cart 
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/expenses"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Add Expenses
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/expense-list"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Expenses List
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/howlad-newa"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Add Howlad
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/howlad-list"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Howlad List
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/paboTaka"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Pabo Taka
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/paboTaka-list"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Pabo Taka List
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/profit-list"
                                    className={linkStyle}
                                >
                                    💸 Profit
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/add-profit"
                                    className={linkStyle}
                                >
                                    💸 Add Profit
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/add-staff"
                                    className={linkStyle}
                                >
                                    <FaUsers />
                                    Add Staff
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/staff-list"
                                    className={linkStyle}
                                >
                                    <FaUsers />
                                    Staff List
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* BACK BUTTON */}
                    <li className="pt-5 mt-5 border-t border-orange-300">
                        <NavLink to="/" className={linkStyle}>
                            <FaArrowLeft />
                            Back To Home
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;