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

    // DESKTOP STYLE (কম্প্যাক্ট এবং প্রিমিয়াম লুকের জন্য প্যাডিং ও ফন্ট সাইজ টিউন করা হয়েছে)
    const linkStyle =
        "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs xl:text-sm text-gray-200 hover:text-orange-400 hover:bg-white/5 transition-all duration-200 font-medium whitespace-nowrap";

    // MOBILE STYLE
    const mobileLinkStyle =
        "flex items-center gap-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition font-semibold w-full";

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
                        <FaHome className="text-base" />
                        Home
                    </Link>
                </li>

                <li>
                    <Link to="/dashboard" className={currentStyle}>
                        <FaTachometerAlt className="text-base" />
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link
                        to="/dashboard/product-card-page"
                        className={currentStyle}
                    >
                        <FaBoxOpen className="text-base" />
                        Products
                    </Link>
                </li>

                <li>
                    <Link
                        to="/dashboard/cart"
                        className={currentStyle}
                    >
                        <FaShoppingCart className="text-base" />
                        Cart

                        <span
                            className={`badge badge-sm ml-1 ${isMobile
                                ? "badge-warning text-black"
                                : "bg-orange-500 text-white border-none px-1.5 h-5 min-h-0"
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
                                <FaBoxOpen className="text-base" />
                                Product
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/add-staff"
                                className={currentStyle}
                            >
                                <FaUserPlus className="text-base" />
                                Staff
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/expenses"
                                className={currentStyle}
                            >
                                <FaMoneyBill className="text-base" />
                                Expenses
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/add-profit"
                                className={currentStyle}
                            >
                                <FaMoneyBill className="text-base" />
                                Profit
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/add-cash"
                                className={currentStyle}
                            >
                                <FaPlusCircle className="text-base" />
                                Cash
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/paboTaka"
                                className={currentStyle}
                            >
                                <FaHandHoldingUsd className="text-base" />
                                PaboTaka
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/howlad-newa"
                                className={currentStyle}
                            >
                                <FaFileInvoiceDollar className="text-base" />
                                Howlad
                            </Link>
                        </li>
                    </>
                )}
            </>
        );
    };

    return (
        <div className="navbar fixed top-0 left-0 w-full z-50 bg-slate-900/90 backdrop-blur-md text-white shadow-lg px-4 xl:px-4 h-16 border-b border-white/10">

            {/* LEFT */}
            <div className="navbar-start w-auto mx-auto px-2">

                {/* MOBILE DROPDOWN */}
                <div className="dropdown">
                    <label
                        tabIndex={0}
                        className="btn btn-ghost lg:hidden text-orange-500 text-xl px-2"
                    >
                        ☰
                    </label>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow-2xl bg-white rounded-2xl w-60 border border-gray-100 gap-2"
                    >
                        {renderNavOptions(true)}
                    </ul>
                </div>

                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2 mr-1">
                    <img
                        src={ljiCON}
                        className="w-11 h-11 rounded-full border border-orange-500 object-cover shadow-sm"
                        alt="Logo"
                    />
                </Link>
            </div>

            {/* CENTER (সব মেনু একসাথে জায়গা দেওয়ার জন্য max-w কাস্টমাইজ করা হয়েছে) */}
            <div className="navbar-center hidden lg:flex flex-1 justify-center max-w-[calc(100%-200px)]">
                <ul className="menu menu-horizontal px-1 gap-3 w-full justify-center flex-nowrap overflow-x-auto scrollbar-none">
                    {renderNavOptions(false)}
                </ul>
            </div>

            {/* RIGHT */}
            <div className="navbar-end w-auto flex items-center gap-2 ml-auto">

                {user ? (
                    <>
                        {/* USER IMAGE */}
                        <div className="relative group cursor-pointer ml-1">
                            <img
                                src={
                                    user?.photoURL ||
                                    "https://i.ibb.co/mJR9mkv/default-user.png"
                                }
                                className="w-8 h-8 rounded-full border-2 border-orange-500 object-cover shadow-sm"
                                alt="user"
                            />

                            <span className="absolute right-0 top-11 bg-slate-800 text-orange-400 text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap z-50 border border-white/10">
                                {user?.displayName || "User"}
                            </span>
                        </div>

                        {/* LOGOUT */}
                        <button
                            onClick={handleLogOut}
                            className="px-2.5 py-1.5 text-xs font-semibold text-orange-400 border border-orange-500/50 rounded-md hover:bg-orange-500 hover:text-black transition-all duration-200"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="px-2.5 py-1.5 text-xs font-semibold bg-orange-500 text-black rounded-md hover:bg-orange-600 transition-all duration-200 shadow-sm"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default NavBar;