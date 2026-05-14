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

    const linkStyle =
        "flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-orange-400 transition";

    const navOptions = (
        <>
            <li>
                <Link to="/" className={linkStyle}>Home</Link>
            </li>

            <li>
                <Link to="/dashboard" className={linkStyle}>Dashboard</Link>
            </li>

            <li>
                <Link to="/dashboard/cart" className={linkStyle}>
                    <FaShoppingCart />
                    Cart ({cart.length})
                </Link>
            </li>

            {isAdmin && (
                <>
                    <li><Link to="/dashboard/add-product" className={linkStyle}><FaUserPlus />Product</Link></li>
                    <li><Link to="/dashboard/add-staff" className={linkStyle}><FaUserPlus />Staff</Link></li>
                    <li><Link to="/dashboard/expenses" className={linkStyle}><FaMoneyBill />Expenses</Link></li>
                    <li><Link to="/dashboard/add-profit" className={linkStyle}><FaMoneyBill />Profit</Link></li>
                    <li><Link to="/dashboard/add-cash" className={linkStyle}><FaPlusCircle />Cash</Link></li>
                    <li><Link to="/dashboard/paboTaka" className={linkStyle}><FaHandHoldingUsd />PaboTaka</Link></li>
                    <li><Link to="/dashboard/howlad-newa" className={linkStyle}><FaFileInvoiceDollar />Howlad</Link></li>
                </>
            )}
        </>
    );

    return (
        <div className="navbar fixed z-10 bg-opacity-30 max-w-screen-xl bg-black text-white">
            <div className="navbar-start mt-5">

                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">☰</label>

                    <ul className="menu dropdown-content p-2 bg-base-100 rounded-box w-52 ">
                        {navOptions}
                    </ul>
                </div>

                <Link to="/" className="flex items-center gap-2 ml-2">
                    <img src={ljiCON} className="w-14 h-14 -mt-4  rounded-full" alt="Logo" />
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 ">
                    {navOptions}
                </ul>
            </div>

            <div className="navbar-end flex items-center gap-3">
                {user ? (
                    <>
                        <img
                            src={user?.photoURL || "https://i.ibb.co/mJR9mkv/default-user.png"}
                            className="w-10 h-10 rounded-full border-2 border-orange-500"
                            alt="User"
                        />

                        <button
                            onClick={handleLogOut}
                            className="px-4 py-2 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-black"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-2 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-black"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default NavBar;