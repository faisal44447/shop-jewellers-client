import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import useCart from "../../../hooks/useCart";
import { FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import ljiCON from "../../../assets/laivinIcon.png";

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [cart = []] = useCart();

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
        `flex items-center gap-2 px-3 py-2 rounded-lg transition duration-200 ${
            isActive
                ? "bg-orange-600 text-white"
                : "text-white hover:bg-orange-500 hover:text-black"
        }`;

    return (
        <div className="navbar fixed top-10 left-0 z-50 bg-black/70 backdrop-blur-md text-white px-4">

            {/* LEFT */}
            <div className="navbar-start">

                {/* MOBILE */}
                <div className="dropdown lg:hidden">
                    <label tabIndex={0} className="btn btn-ghost text-white">
                        ☰
                    </label>

                    <ul className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-black rounded-box w-52 z-[100]">

                        <li><NavLink to="/" className={linkStyle}>Home</NavLink></li>

                        <li><NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink></li>

                        <li>
                            <NavLink to="/dashboard/product-card-page" className={linkStyle}>
                                Products
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/dashboard/cart" className={linkStyle}>
                                <FaShoppingCart />
                                Cart ({cart.length})
                            </NavLink>
                        </li>

                    </ul>
                </div>

                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2 ml-2">
                    <img
                        src={ljiCON}
                        className="w-10 h-10 rounded-full border border-orange-500"
                        alt="Logo"
                    />
                    <span className="font-bold text-lg">
                        Laivin Jewellers
                    </span>
                </Link>

            </div>

            {/* CENTER */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-3">

                    <li><NavLink to="/" className={linkStyle}>Home</NavLink></li>

                    <li><NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink></li>

                    <li>
                        <NavLink to="/dashboard/product-card-page" className={linkStyle}>
                            Products
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/cart"
                            className={({ isActive }) =>
                                `relative flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                                    isActive
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
                                src={user?.photoURL || "https://i.ibb.co/mJR9mkv/default-user.png"}
                                className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
                                alt="User"
                            />
                            <span className="absolute left-1/2 -translate-x-1/2 top-8 bg-black text-orange-500 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
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