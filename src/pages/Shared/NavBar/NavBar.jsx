import { Link } from "react-router-dom";
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

    // DESKTOP STYLE
    const linkStyle =
        "flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-orange-400 hover:bg-white/10 transition font-medium";

    // MOBILE STYLE
    const mobileLinkStyle =
        "flex items-center gap-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-orange-100 hover:text-orange-600 transition font-semibold w-full";

    // NAV ITEMS
    const renderNavOptions = (isMobile = false) => {
        const currentStyle = isMobile
            ? mobileLinkStyle
            : linkStyle;

        return (
            <>
                {/* COMMON MENU */}
                <li>
                    <Link to="/" className={currentStyle}>
                        <FaHome />
                        Home
                    </Link>
                </li>

                <li>
                    <Link to="/dashboard" className={currentStyle}>
                        <FaTachometerAlt />
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link
                        to="/dashboard/product-card-page"
                        className={currentStyle}
                    >
                        <FaBoxOpen />
                        Products
                    </Link>
                </li>

                <li>
                    <Link
                        to="/dashboard/cart"
                        className={currentStyle}
                    >
                        <FaShoppingCart />
                        Cart

                        <span
                            className={`badge ml-1 ${isMobile
                                ? "badge-warning text-black"
                                : "badge-ghost text-orange-500"
                                }`}
                        >
                            {cart.length}
                        </span>
                    </Link>
                </li>

                {/* ADMIN ONLY */}
                {isAdmin && (
                    <>
                        <li>
                            <Link
                                to="/dashboard/add-product"
                                className={currentStyle}
                            >
                                <FaBoxOpen />
                                Product
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/add-staff"
                                className={currentStyle}
                            >
                                <FaUserPlus />
                                Staff
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/expenses"
                                className={currentStyle}
                            >
                                <FaMoneyBill />
                                Expenses
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/add-profit"
                                className={currentStyle}
                            >
                                <FaMoneyBill />
                                Profit
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/add-cash"
                                className={currentStyle}
                            >
                                <FaPlusCircle />
                                Cash
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/paboTaka"
                                className={currentStyle}
                            >
                                <FaHandHoldingUsd />
                                PaboTaka
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/howlad-newa"
                                className={currentStyle}
                            >
                                <FaFileInvoiceDollar />
                                Howlad
                            </Link>
                        </li>
                    </>
                )}
            </>
        );
    };

    return (
        <div className="navbar fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md text-white shadow-md px-2 md:px-6 h-16">

            {/* LEFT */}
            <div className="navbar-start">

                {/* MOBILE DROPDOWN */}
                <div className="dropdown">
                    <label
                        tabIndex={0}
                        className="btn btn-ghost lg:hidden text-orange-500 text-xl"
                    >
                        ☰
                    </label>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow-2xl bg-white rounded-2xl w-60 border border-gray-100 gap-1"
                    >
                        {renderNavOptions(true)}
                    </ul>
                </div>

                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src={ljiCON}
                        className="w-11 h-11 rounded-full border border-orange-500 object-cover"
                        alt="Logo"
                    />

                    <h1 className="hidden md:block text-lg font-bold text-orange-400">
                        Laivin Jewellers
                    </h1>
                </Link>
            </div>

            {/* CENTER */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    {renderNavOptions(false)}
                </ul>
            </div>

            {/* RIGHT */}
            <div className="navbar-end flex items-center gap-2">

                {user ? (
                    <>
                        {/* USER IMAGE */}
                        <div className="relative group">
                            <img
                                src={
                                    user?.photoURL ||
                                    "https://i.ibb.co/mJR9mkv/default-user.png"
                                }
                                className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
                                alt="user"
                            />

                            <span className="absolute right-0 top-12 bg-black text-orange-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                {user?.displayName || "User"}
                            </span>
                        </div>

                        {/* LOGOUT */}
                        <button
                            onClick={handleLogOut}
                            className="px-3 py-1.5 text-xs md:text-sm font-semibold text-orange-400 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-black transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-1.5 text-xs md:text-sm font-semibold bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default NavBar;