import { Link, useNavigate } from "react-router-dom";
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
    FaChevronDown,
    FaStore
} from "react-icons/fa";
import laivinIcon from "../../../assets/laivinIcon.png";

const NavBar = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    // 🔄 যদি Auth কনটেক্সট লোড হতে সময় নেয় বা loading ট্রু থাকে, তবে কোনো কিছু রিটার্ন না করে অপেক্ষা করবে
    if (!auth || auth.loading) {
        return null;
    }

    const { user, logOut } = auth;
    const [isAdmin] = useAdmin() || [false];
    const [cart] = useCart() || [[]];

    const handleLogOut = async () => {
        try {
            await logOut();
            navigate("/login");
        } catch (error) {
            console.log("Logout Error:", error);
        }
    };

    // 🎯 ড্রপডাউন মেনু এবং ইন-অ্যাপ অ্যাকশনের পর ফোকাস রিমুভ করার ফাংশন
    const closeDropdown = () => {
        const elem = document.activeElement;
        if (elem) {
            elem.blur();
        }
    };

    const linkStyle = "flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-orange-400 hover:bg-white/5 transition duration-200";
    const dropdownLinkStyle = "flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:text-orange-400 hover:bg-slate-800 transition rounded-md";

    // 🛠️ ফিক্স: ভেরিয়েবলের বদলে ফাংশন করা হলো যাতে রিয়্যাক্ট লাইফসাইকেলে এরর #310 না আসে
    const renderCommonOptions = () => (
        <>
            <li>
                <Link to="/" onClick={closeDropdown} className={linkStyle}>Home</Link>
            </li>
            <li>
                <Link to="/dashboard" onClick={closeDropdown} className={linkStyle}>Dashboard</Link>
            </li>
            <li>
                <Link to="/dashboard/cart" onClick={closeDropdown} className={linkStyle}>
                    <FaShoppingCart className="text-orange-400" /> Cart
                    <span className="badge badge-sm bg-orange-500 border-none text-black font-bold px-1.5 py-0.5 ml-1">
                        {cart?.length || 0}
                    </span>
                </Link>
            </li>
            <li>
                <a
                    href="https://shop-jewellers-client.web.app"
                    onClick={(e) => {
                        const ua = navigator.userAgent || navigator.vendor || window.opera;
                        const isInApp = (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf("Instagram") > -1) || (ua.indexOf("Messenger") > -1);

                        if (isInApp) {
                            e.preventDefault();
                            closeDropdown();
                            window.location.href = "intent://shop-jewellers-client.web.app/#Intent;scheme=https;package=com.android.chrome;end";
                        } else {
                            closeDropdown();
                        }
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkStyle} text-orange-400 font-medium cursor-pointer`}
                >
                    <FaStore /> ভিジット শপ 👋
                </a>
            </li>
        </>
    );

    return (
        <div className="navbar fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md text-white shadow-lg border-b border-white/5 px-4 md:px-6 py-2.5">
            {/* ================= NAVBAR START ================= */}
            <div className="navbar-start">
                <div className="dropdown">
                    {/* 🎯 ফিক্স: label এর বদলে div role="button" ব্যবহার */}
                    <div role="button" tabIndex={0} className="btn btn-ghost lg:hidden text-orange-500 text-xl p-2 min-h-0 h-auto">
                        ☰
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-3 bg-slate-950 text-white rounded-xl w-56 shadow-2xl border border-white/10 z-[100] space-y-1">
                        {renderCommonOptions()}
                        {isAdmin && (
                            <>
                                {/* 🎯 ফিক্স: divider কে <li> এর ভেতরে রাখা হলো */}
                                <li className="menu-title px-2 py-1 text-xs text-orange-400/70 font-semibold tracking-wider uppercase border-b border-white/10 my-1">
                                    Admin Actions
                                </li>
                                <li><Link to="/dashboard/add-staff" onClick={closeDropdown} className={linkStyle}><FaUserPlus /> Add Staff</Link></li>
                                <li><Link to="/dashboard/expenses" onClick={closeDropdown} className={linkStyle}><FaMoneyBill /> Expenses</Link></li>
                                <li><Link to="/dashboard/add-profit" onClick={closeDropdown} className={linkStyle}><FaMoneyBill /> Add Profit</Link></li>
                                <li><Link to="/dashboard/add-cash" onClick={closeDropdown} className={linkStyle}><FaPlusCircle /> Add Cash</Link></li>
                                <li><Link to="/dashboard/paboTaka" onClick={closeDropdown} className={linkStyle}><FaHandHoldingUsd /> Pabo Taka</Link></li>
                                <li><Link to="/dashboard/howlad-newa" onClick={closeDropdown} className={linkStyle}><FaFileInvoiceDollar /> Add Howlad</Link></li>
                            </>
                        )}
                    </ul>
                </div>

                <Link to="/" className="flex items-center gap-2 ml-2 transition hover:opacity-90">
                    <img src={laivinIcon} className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover shadow-md shadow-orange-500/20" alt="Logo" />
                </Link>
            </div>

            {/* ================= NAVBAR CENTER ================= */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2 items-center">
                    {renderCommonOptions()}

                    {isAdmin && (
                        <li className="dropdown dropdown-hover group">
                            <label tabIndex={0} className={`${linkStyle} cursor-pointer gap-1 text-orange-400 font-medium`}>
                                Admin Management
                                <FaChevronDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-xl w-56 shadow-2xl mt-0 z-[100] space-y-0.5">
                                <li><Link to="/dashboard/add-staff" onClick={closeDropdown} className={dropdownLinkStyle}><FaUserPlus className="text-orange-400" /> Add Staff</Link></li>
                                <li><Link to="/dashboard/expenses" onClick={closeDropdown} className={dropdownLinkStyle}><FaMoneyBill className="text-red-400" /> Expenses</Link></li>
                                <li><Link to="/dashboard/add-profit" onClick={closeDropdown} className={dropdownLinkStyle}><FaMoneyBill className="text-green-400" /> Add Profit</Link></li>
                                <li><Link to="/dashboard/add-cash" onClick={closeDropdown} className={dropdownLinkStyle}><FaPlusCircle className="text-blue-400" /> Add Cash</Link></li>
                                <li><Link to="/dashboard/paboTaka" onClick={closeDropdown} className={dropdownLinkStyle}><FaHandHoldingUsd className="text-amber-400" /> Pabo Taka</Link></li>
                                <li><Link to="/dashboard/howlad-newa" onClick={closeDropdown} className={dropdownLinkStyle}><FaFileInvoiceDollar className="text-purple-400" /> Add Howlad</Link></li>
                            </ul>
                        </li>
                    )}
                </ul>
            </div>

            {/* ================= NAVBAR END ================= */}
            <div className="navbar-end flex items-center gap-3 pr-1">
                {user ? (
                    <div className="flex items-center gap-2.5 bg-white/5 p-1.5 pr-3 rounded-full border border-white/10">
                        <img
                            src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=ff7e47&color=fff"}
                            className="w-8 h-8 rounded-full border border-orange-500 object-cover shadow-inner"
                            alt="User"
                            title={user?.displayName || "User"}
                        />
                        <button
                            onClick={handleLogOut}
                            className="text-xs font-semibold text-orange-400 hover:text-orange-500 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-md hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md shadow-orange-500/10"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default NavBar;