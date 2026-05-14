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
    FaFileInvoiceDollar
} from "react-icons/fa";

import ljiCON from "../../../assets/laivinIcon.png";

const NavBar = () => {
    const context = useContext(AuthContext);

    if (!context) return null;

    const { user, logOut } = context;
    const [cart = []] = useCart();
    const [isAdmin = false] = useAdmin();

    const handleLogOut = () => {
        logOut().catch(err => console.log(err));
    };

    // ডেক্সটপ মেনুর জন্য স্টাইল
    const linkStyle =
        "flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-orange-400 transition font-medium";

    // মোবাইল মেনুর জন্য কাস্টম স্টাইল (টেক্সট কালার যাতে সাদা না থাকে)
    const mobileLinkStyle =
        "flex items-center gap-2 px-3 py-2 rounded-lg text-gray-800 hover:bg-orange-100 hover:text-orange-600 transition font-semibold w-full";

    // কমন নেভিগেশন অপশনস (isMobile প্যারামিটার পাস করে কালার কন্ট্রোল করা হয়েছে)
    const renderNavOptions = (isMobile = false) => {
        const currentStyle = isMobile ? mobileLinkStyle : linkStyle;
        return (
            <>
                <li>
                    <Link to="/" className={currentStyle}>Home</Link>
                </li>
                <li>
                    <Link to="/dashboard" className={currentStyle}>Dashboard</Link>
                </li>
                <li>
                    <Link to="/dashboard/cart" className={currentStyle}>
                        <FaShoppingCart />
                        Cart <span className={`badge ${isMobile ? 'badge-warning text-black' : 'badge-ghost text-white'} ml-1`}>{cart.length}</span>
                    </Link>
                </li>

                {isAdmin && (
                    <>
                        <li><Link to="/dashboard/add-product" className={currentStyle}><FaUserPlus />Product</Link></li>
                        <li><Link to="/dashboard/add-staff" className={currentStyle}><FaUserPlus />Staff</Link></li>
                        <li><Link to="/dashboard/expenses" className={currentStyle}><FaMoneyBill />Expenses</Link></li>
                        <li><Link to="/dashboard/add-profit" className={currentStyle}><FaMoneyBill />Profit</Link></li>
                        <li><Link to="/dashboard/add-cash" className={currentStyle}><FaPlusCircle />Cash</Link></li>
                        <li><Link to="/dashboard/paboTaka" className={currentStyle}><FaHandHoldingUsd />PaboTaka</Link></li>
                        <li><Link to="/dashboard/howlad-newa" className={currentStyle}><FaFileInvoiceDollar />Howlad</Link></li>
                    </>
                )}
            </>
        );
    };

    return (
        <div className="navbar fixed top-8 left-0 w-full z-50 bg-black bg-opacity-70 backdrop-blur-md text-white shadow-md px-2 md:px-6 h-16">
            <div className="navbar-start">

                {/* মোবাইল ড্রপডাউন মেনু */}
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden text-orange-500 text-xl">
                        ☰
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow-2xl bg-white rounded-2xl w-60 border border-gray-100 gap-1">
                        {renderNavOptions(true)} {/* True মানে মোবাইল মোড, টেক্সট কালো দেখাবে */}
                    </ul>
                </div>

                {/* লোগো */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={ljiCON} className="skeleton w-11 h-11 rounded-full border border-orange-500 object-cover" alt="Logo" />
                </Link>
            </div>

            {/* ডেক্সটপ মেনু */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    {renderNavOptions(false)} {/* False মানে ডেক্সটপ মোড, টেক্সট সাদা দেখাবে */}
                </ul>
            </div>

            <div className="navbar-end flex items-center gap-2">
                {user ? (
                    <>
                        <img
                            src={user?.photoURL || "https://i.ibb.co/mJR9mkv/default-user.png"}
                            className="w-9 h-9 rounded-full border-2 border-orange-500 object-cover"
                            alt="User"
                        />
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