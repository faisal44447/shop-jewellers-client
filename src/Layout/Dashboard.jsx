import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";

import {
    FaHome,
    FaBoxOpen,
    FaShoppingCart,
    FaMoneyBill,
    FaUsers,
    FaPlus,
    FaArrowLeft,
    FaUserShield,
    FaClipboardList,
    FaCashRegister,
    FaChartLine,
    FaTools,
    FaUserPlus,
    FaBoxes,
} from "react-icons/fa";

const Dashboard = () => {
    const { user } = useAuth();
    const [isAdmin] = useAdmin();

    const linkStyle = ({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition ${isActive
            ? "bg-white text-orange-600 shadow"
            : "text-white hover:bg-orange-400"
        }`;

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <div className="w-52 md:w-56 bg-orange-500 p-2 shadow-lg">

                {/* USER INFO */}
                <div className="text-center mb-4">
                    <img
                        src={user?.photoURL || "https://i.ibb.co/mJR9mkv/default-user.png"}
                        className="w-12 h-12 rounded-full mx-auto border border-white"
                        alt="user"
                    />
                    <h2 className="text-xs font-semibold text-white mt-1">
                        {user?.displayName || "User"}
                    </h2>
                    <p className="text-[10px] text-orange-100">
                        {isAdmin ? "Admin Panel" : "User Panel"}
                    </p>
                </div>

                {/* MENU */}
                <ul className="space-y-1">

                    {/* USER ROUTES */}
                    {!isAdmin && (
                        <>
                            <li><NavLink to="/dashboard/userHome" className={linkStyle}><FaHome /> Home</NavLink></li>
                            <li><NavLink to="/dashboard/product-card-page" className={linkStyle}><FaBoxOpen /> Products</NavLink></li>
                            <li><NavLink to="/dashboard/sales" className={linkStyle}><FaCashRegister /> Sell Product</NavLink></li>
                            <li><NavLink to="/dashboard/sold-products" className={linkStyle}><FaClipboardList /> Sold Products</NavLink></li>
                            <li><NavLink to="/dashboard/cart" className={linkStyle}><FaShoppingCart /> Cart</NavLink></li>
                            <li><NavLink to="/dashboard/howlad-list" className={linkStyle}><FaMoneyBill /> Howlad List</NavLink></li>
                            <li><NavLink to="/dashboard/paboTaka-list" className={linkStyle}><FaMoneyBill /> Pabo Taka List</NavLink></li>
                            <li><NavLink to="/dashboard/expense-list" className={linkStyle}><FaMoneyBill /> Expense List</NavLink></li>
                            <li><NavLink to="/dashboard/profit-list" className={linkStyle}><FaChartLine /> Profit List</NavLink></li>
                            <li><NavLink to="/dashboard/staff-list" className={linkStyle}><FaUsers /> Staff List</NavLink></li>
                        </>
                    )}

                    {/* ADMIN ROUTES */}
                    {isAdmin && (
                        <>
                            <li><NavLink to="/dashboard/adminHome" className={linkStyle}><FaUserShield /> Admin Home</NavLink></li>
                            <li><NavLink to="/dashboard/all-users" className={linkStyle}><FaUsers /> All Users</NavLink></li>
                            <li><NavLink to="/dashboard/add-product" className={linkStyle}><FaPlus /> Add Product</NavLink></li>
                            <li><NavLink to="/dashboard/product-card-page" className={linkStyle}><FaBoxOpen /> Products</NavLink></li>
                            <li><NavLink to="/dashboard/manage-product" className={linkStyle}><FaBoxes /> Manage Products</NavLink></li>
                            <li><NavLink to="/dashboard/sales" className={linkStyle}><FaCashRegister /> Sell Product</NavLink></li>
                            <li><NavLink to="/dashboard/sold-products" className={linkStyle}><FaClipboardList /> Sold Products</NavLink></li>
                            <li><NavLink to="/dashboard/cart" className={linkStyle}><FaShoppingCart /> Cart</NavLink></li>
                            <li><NavLink to="/dashboard/expenses" className={linkStyle}><FaMoneyBill /> Add Expenses</NavLink></li>
                            <li><NavLink to="/dashboard/expense-list" className={linkStyle}><FaMoneyBill /> Expense List</NavLink></li>
                            <li><NavLink to="/dashboard/howlad-newa" className={linkStyle}><FaMoneyBill /> Add Howlad</NavLink></li>
                            <li><NavLink to="/dashboard/howlad-list" className={linkStyle}><FaMoneyBill /> Howlad List</NavLink></li>
                            <li><NavLink to="/dashboard/paboTaka" className={linkStyle}><FaMoneyBill /> Pabo Taka</NavLink></li>
                            <li><NavLink to="/dashboard/paboTaka-list" className={linkStyle}><FaMoneyBill /> Pabo Taka List</NavLink></li>
                            <li><NavLink to="/dashboard/profit-list" className={linkStyle}><FaChartLine /> Profit List</NavLink></li>
                            <li><NavLink to="/dashboard/add-profit" className={linkStyle}><FaMoneyBill /> Add Profit</NavLink></li>
                            <li><NavLink to="/dashboard/add-staff" className={linkStyle}><FaUserPlus /> Add Staff</NavLink></li>
                            <li><NavLink to="/dashboard/staff-list" className={linkStyle}><FaUsers /> Staff List</NavLink></li>
                        </>
                    )}

                    {/* BACK */}
                    <li className="pt-2 mt-2 border-t border-orange-300">
                        <NavLink to="/" className={linkStyle}>
                            <FaArrowLeft /> Back Home
                        </NavLink>
                    </li>

                </ul>
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-3 overflow-y-auto">
                <Outlet />
            </div>

        </div>
    );
};

export default Dashboard;