import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import { CartContext } from "../../../providers/CartProvider";
import { FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import ljiCON from "../../../assets/ljIcon.JPG";

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogOut = () => {
        logOut().then(() => {
            Swal.fire({
                icon: "success",
                title: "Logged out!",
                timer: 1200,
                showConfirmButton: false,
            });
        });
    };

    // ACTIVE LINK STYLE (using your CSS classes)
    const navStyle = ({ isActive }) =>
        isActive ? "nav-link-base nav-link-active" : "nav-link-base";

    return (
        <div
            className={`navbar navbar-glow fixed top-0 w-full z-50 transition-all duration-300
            ${scrolled ? "shadow-xl" : ""}`}
        >
            {/* LEFT */}
            <div className="navbar-start">
                <Link to="/" className="flex items-center gap-2 text-white">
                    <img src={ljiCON} className="w-10 h-10 rounded-full" />
                    <span className="font-bold">Laivin Jewellers</span>
                </Link>
            </div>

            {/* CENTER MENU */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-6">

                    <li>
                        <NavLink to="/" className={navStyle}>
                            Home
                        </NavLink>
                    </li>

                    {user && (
                        <>
                            <li>
                                <NavLink to="/dashboard" className={navStyle}>
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/product-card-page" className={navStyle}>
                                    Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/sell" className={navStyle}>
                                    Sell
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* RIGHT */}
            <div className="navbar-end gap-4">

                {/* CART */}
                {user && (
                    <Link to="/dashboard/cart" className="relative text-white">
                        <FaShoppingCart className="text-xl" />
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 rounded-full">
                            {cart?.length || 0}
                        </span>
                    </Link>
                )}

                {/* USER */}
                {user && (
                    <img
                        src={user?.photoURL || "https://i.ibb.co/mJR9mkv/default-user.png"}
                        className="w-10 h-10 rounded-full border border-orange-300"
                    />
                )}

                {/* LOGIN / LOGOUT */}
                {user ? (
                    <button onClick={handleLogOut} className="btn-glow btn btn-sm text-white">
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="btn-glow btn btn-sm text-white">
                        Login
                    </Link>
                )}
            </div>

            {/* MOBILE MENU */}
            <div className="dropdown lg:hidden text-white">
                <div tabIndex={0} role="button" className="btn btn-ghost text-white">
                    ☰
                </div>

                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>

                    {user && (
                        <>
                            <li>
                                <NavLink to="/dashboard">Dashboard</NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/product-card-page">
                                    Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/sell">Sell</NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NavBar;