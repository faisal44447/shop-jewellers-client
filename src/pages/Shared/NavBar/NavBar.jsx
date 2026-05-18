import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import useCart from "../../../hooks/useCart";
import useAdmin from "../../../hooks/useAdmin";

import {
    FaShoppingCart,
    FaUserPlus,
    FaMoneyBill,
    FaPlusCircle,
    FaHandHoldingUsd,
    FaFileInvoiceDollar,
    FaBoxOpen,
    FaHome,
    FaTachometerAlt,
    FaGem,
} from "react-icons/fa";

import ljiCON from "../../../assets/laivinIcon.png";

const NavBar = () => {
    const context = useContext(AuthContext);

    if (!context) return null;

    const { user, logOut } = context;

    const [cart = []] = useCart();
    const [isAdmin = false] = useAdmin();

    const handleLogOut = () => {
        logOut().catch((err) => console.log(err));
    };

    // DESKTOP NAV STYLE
    const navLink =
        "relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300";

    const activeClass =
        "bg-orange-500 text-black shadow-lg";

    const normalClass =
        "text-gray-200 hover:bg-white/10 hover:text-orange-400";

    // MOBILE NAV STYLE
    const mobileNav =
        "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-all duration-200 font-semibold";

    // NAV ITEMS
    const renderNavOptions = (isMobile = false) => {
        const mobile = isMobile;

        const navItem = (to, icon, label, extra = null) => (
            <li>
                <NavLink
                    to={to}
                    className={({ isActive }) =>
                        mobile
                            ? mobileNav
                            : `${navLink} ${isActive
                                ? activeClass
                                : normalClass
                            }`
                    }
                >
                    {icon}
                    {label}
                    {extra}
                </NavLink>
            </li>
        );

        return (
            <>
                {navItem(
                    "/",
                    <FaHome className="text-base" />,
                    "Home"
                )}

                {navItem(
                    "/dashboard",
                    <FaTachometerAlt className="text-base" />,
                    "Dashboard"
                )}

                {navItem(
                    "/dashboard/product-card-page",
                    <FaBoxOpen className="text-base" />,
                    "Products"
                )}

                {navItem(
                    "/dashboard/cart",
                    <FaShoppingCart className="text-base" />,
                    "Cart",
                    <span
                        className={`badge badge-sm ${mobile
                                ? "badge-warning text-black"
                                : "bg-orange-500 border-none text-white"
                            }`}
                    >
                        {cart.length}
                    </span>
                )}

                {/* ADMIN MENU */}
                {isAdmin && (
                    <>
                        {navItem(
                            "/dashboard/add-product",
                            <FaBoxOpen className="text-base" />,
                            "Product"
                        )}

                        {navItem(
                            "/dashboard/add-staff",
                            <FaUserPlus className="text-base" />,
                            "Staff"
                        )}

                        {navItem(
                            "/dashboard/expenses",
                            <FaMoneyBill className="text-base" />,
                            "Expenses"
                        )}

                        {navItem(
                            "/dashboard/add-profit",
                            <FaMoneyBill className="text-base" />,
                            "Profit"
                        )}

                        {navItem(
                            "/dashboard/add-cash",
                            <FaPlusCircle className="text-base" />,
                            "Cash"
                        )}

                        {navItem(
                            "/dashboard/paboTaka",
                            <FaHandHoldingUsd className="text-base" />,
                            "PaboTaka"
                        )}

                        {navItem(
                            "/dashboard/howlad-newa",
                            <FaFileInvoiceDollar className="text-base" />,
                            "Howlad"
                        )}
                    </>
                )}
            </>
        );
    };

    return (
        <div className="navbar fixed top-0 left-0 w-full z-50 px-4 lg:px-8 h-20 bg-gradient-to-r from-slate-950 via-slate-900 to-black border-b border-orange-500/20 shadow-2xl backdrop-blur-xl">

            {/* LEFT */}
            <div className="navbar-start">

                {/* MOBILE MENU */}
                <div className="dropdown lg:hidden">
                    <label
                        tabIndex={0}
                        className="btn btn-ghost text-orange-400 text-2xl hover:bg-white/10 border-none"
                    >
                        ☰
                    </label>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-4 z-[100] p-4 shadow-2xl bg-white rounded-2xl w-72 border border-gray-100 gap-2"
                    >
                        {renderNavOptions(true)}
                    </ul>
                </div>

                {/* LOGO */}
                <Link
                    to="/"
                    className="flex items-center gap-3 group"
                >
                    <div className="relative">
                        <img
                            src={ljiCON}
                            className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover shadow-lg group-hover:scale-105 transition duration-300"
                            alt="Logo"
                        />

                        <div className="absolute -bottom-1 -right-1 bg-orange-500 p-1 rounded-full">
                            <FaGem className="text-black text-[10px]" />
                        </div>
                    </div>

                    {/* BRAND TEXT */}
                    <div className="hidden sm:flex flex-col leading-none">
                        <span className="text-white font-bold text-lg tracking-wide">
                            Premium Store
                        </span>

                        <span className="text-orange-400 text-xs tracking-[4px] uppercase">
                            Luxury Collection
                        </span>
                    </div>
                </Link>
            </div>

            {/* CENTER */}
            <div className="navbar-center hidden lg:flex flex-1">
                <ul className="menu menu-horizontal gap-2 px-1 mx-auto">
                    {renderNavOptions(false)}
                </ul>
            </div>

            {/* RIGHT */}
            <div className="navbar-end gap-3">

                {user ? (
                    <>
                        {/* USER IMAGE */}
                        <div className="relative group cursor-pointer">
                            <div className="p-[2px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-400">
                                <img
                                    src={
                                        user?.photoURL ||
                                        "https://i.ibb.co/mJR9mkv/default-user.png"
                                    }
                                    className="w-10 h-10 rounded-full object-cover bg-black"
                                    alt="user"
                                />
                            </div>

                            {/* TOOLTIP */}
                            <div className="absolute right-0 top-14 bg-slate-900 text-orange-400 text-xs px-3 py-2 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap border border-orange-500/20">
                                {user?.displayName || "User"}
                            </div>
                        </div>

                        {/* LOGOUT */}
                        <button
                            onClick={handleLogOut}
                            className="px-4 py-2 rounded-xl bg-transparent border border-orange-500 text-orange-400 font-semibold hover:bg-orange-500 hover:text-black transition-all duration-300 shadow-lg hover:scale-105"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="px-5 py-2 rounded-xl bg-orange-500 text-black font-bold hover:bg-orange-400 transition-all duration-300 shadow-lg hover:scale-105"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default NavBar;