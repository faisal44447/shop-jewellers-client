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
    const auth = useContext(AuthContext);

    if (!auth) {
        return null;
    }

    const { user, logOut } = auth;
    const [isAdmin] = useAdmin() || [false];
    const [cart] = useCart() || [[]];

    const handleLogOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    };

    const linkStyle = "flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:text-orange-400 transition";

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
                    <FaShoppingCart /> Cart ({cart?.length || 0})
                </Link>
            </li>
            {isAdmin && (
                <>
                    <li>
                        <Link to="/dashboard/add-staff" className={linkStyle}>
                            <FaUserPlus /> Add Staff
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/expenses" className={linkStyle}>
                            <FaMoneyBill /> Expenses
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/add-profit" className={linkStyle}>
                            <FaMoneyBill /> Add Profit
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/add-cash" className={linkStyle}>
                            <FaPlusCircle /> Add Cash
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/paboTaka" className={linkStyle}>
                            <FaHandHoldingUsd /> Pabo Taka
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/howlad-newa" className={linkStyle}>
                            <FaFileInvoiceDollar /> Add Howlad
                        </Link>
                    </li>
                </>
            )}
        </>
    );

    return (
        <div className="navbar fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md text-white shadow-lg">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden text-orange-500 text-xl">
                        ☰
                    </label>
                    <ul tabIndex={0} className="menu dropdown-content mt-3 p-2 bg-slate-900 text-white rounded-box w-52 shadow-2xl border border-white/10 z-[100]">
                        {navOptions}
                    </ul>
                </div>
                <Link to="/" className="flex items-center gap-2 ml-2">
                    <img src={ljiCON} className="w-10 h-10 rounded-full border border-orange-500 object-cover" alt="Logo" />
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">{navOptions}</ul>
            </div>

            <div className="navbar-end flex items-center gap-3 pr-2">
                {user ? (
                    <>
                        <img
                            src={user?.photoURL || "https://i.ibb.co/vHZ369b/placeholder.png"} // সচল ইমেজ প্লেসহোল্ডার
                            className="w-9 h-9 rounded-full border-2 border-orange-500 object-cover"
                            alt="User"
                        />
                        <button
                            onClick={handleLogOut}
                            className="px-3 py-1.5 text-xs font-semibold text-orange-400 border border-orange-500/50 rounded-md hover:bg-orange-500 hover:text-black transition-all duration-200"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-1.5 text-xs font-semibold bg-orange-500 text-black rounded-md hover:bg-orange-600 transition-all duration-200"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default NavBar;