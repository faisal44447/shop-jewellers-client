import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import useCart from "../../../hooks/useCart";
import useAdmin from "../../../hooks/useAdmin";
import Swal from "sweetalert2";

import ljiCON from "../../../assets/laivinIcon.png";

import {
    FaShoppingCart,
    FaMoneyBill,
    FaUserPlus,
    FaPlus,
    FaPlusCircle,
    FaFileInvoiceDollar,
    FaHandHoldingUsd,
} from "react-icons/fa";

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [cart = []] = useCart();
    const [isAdmin] = useAdmin();

    const handleLogOut = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Logged out",
                    timer: 1200,
                    showConfirmButton: false,
                });
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Logout failed",
                });
            });
    };

    const linkStyle = ({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg transition duration-200 ${isActive
            ? "btn-glow:hover"
            : "nav-link-base"
        }`;

    return (
        <div className="navbar fixed top-0 left-0 z-50 bg-black/70 backdrop-blur-md text-white px-4 w-full">

            {/* LEFT */}
            <div className="navbar-start">

                {/* MOBILE MENU */}
                <div className="dropdown lg:hidden">
                    <label tabIndex={0} className="btn btn-ghost text-white">
                        ☰
                    </label>

                    <ul className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-black rounded-box w-60 z-[100]">

                        <li>
                            <NavLink to="/" className={linkStyle}>
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/dashboard" className={linkStyle}>
                                Dashboard
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/dashboard/product-card-page"
                                className={linkStyle}
                            >
                                Products
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/dashboard/cart"
                                className={linkStyle}
                            >
                                <FaShoppingCart />
                                Cart ({cart.length})
                            </NavLink>
                        </li>

                        {/* ADMIN MENU MOBILE */}
                        {isAdmin && (
                            <>
                                <li>
                                    <NavLink
                                        to="/dashboard/add-staff"
                                        className={linkStyle}
                                    >
                                        <FaUserPlus />
                                        Add Staff
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/dashboard/expenses"
                                        className={linkStyle}
                                    >
                                        <FaMoneyBill />
                                        Expenses
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/dashboard/add-profit"
                                        className={linkStyle}
                                    >
                                        <FaMoneyBill />
                                        Add Profit
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/dashboard/add-cash"
                                        className={linkStyle}
                                    >
                                        <FaPlusCircle />
                                        Add Cash
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/dashboard/paboTaka"
                                        className={linkStyle}
                                    >
                                        <FaHandHoldingUsd />
                                        Pabo Taka
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/dashboard/howlad-newa"
                                        className={linkStyle}
                                    >
                                        <FaFileInvoiceDollar />
                                        Add Howlad
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2 ml-2">
                    <img
                        src={ljiCON}
                        className="w-10 h-10 rounded-full border border-orange-500"
                        alt="Logo"
                    />

                </Link>
            </div>

            {/* CENTER */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-3">

                    <li>
                        <NavLink to="/" className={linkStyle}>
                            Home
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard" className={linkStyle}>
                            Dashboard
                        </NavLink>
                    </li>

                    {/* ADMIN MENU */}
                    {isAdmin && (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/add-staff"
                                    className={linkStyle}
                                >
                                    <FaUserPlus />
                                    Add Staff
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/expenses"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Expenses
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/add-profit"
                                    className={linkStyle}
                                >
                                    <FaMoneyBill />
                                    Add Profit
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/add-cash"
                                    className={linkStyle}
                                >
                                    <FaPlusCircle />
                                    Add Cash
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/paboTaka"
                                    className={linkStyle}
                                >
                                    <FaPlus />
                                    Pabo Taka
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/howlad-newa"
                                    className={linkStyle}
                                >
                                    <FaPlus />
                                    Add Howlad
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* CART */}
                    <li>
                        <NavLink
                            to="/dashboard/cart"
                            className={({ isActive }) =>
                                `relative flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive
                                    ? "bg-orange-600 text-white"
                                    : "text-white hover:bg-orange-500 hover:text-black"
                                }`
                            }
                        >
                            <FaShoppingCart />

                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-2 py-[2px] rounded-full">
                                {cart.length}
                            </span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* RIGHT */}
            <div className="navbar-end flex items-center gap-3">

                {user ? (
                    <>
                        <div className="relative group">
                            <img
                                src={
                                    user?.photoURL ||
                                    "https://i.ibb.co/mJR9mkv/default-user.png"
                                }
                                className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
                                alt="User"
                            />

                            <span className="absolute left-1/2 -translate-x-1/2 top-11 bg-black text-orange-500 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                {user?.displayName || "User"}
                            </span>
                        </div>

                        <button
                            onClick={handleLogOut}
                            className="px-4 py-2 rounded-lg border border-orange-500 hover:bg-orange-500 hover:text-black transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-2 rounded-lg border border-orange-500 hover:bg-orange-500 hover:text-black transition"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default NavBar;