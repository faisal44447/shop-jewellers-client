import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import { CartContext } from "../../../providers/CartProvider";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import ljiCON from "../../../assets/ljIcon.JPG";

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    const [open, setOpen] = useState(false);
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
                showConfirmButton: false
            });
        });
    };

    const navStyle = ({ isActive }) =>
        isActive ? "nav-link-active" : "nav-link-base";

    const menu = (
        <>
            <NavLink to="/" className={navStyle} onClick={() => setOpen(false)}>Home</NavLink>

            {user && (
                <>
                    <NavLink to="/dashboard" className={navStyle} onClick={() => setOpen(false)}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/dashboard/product-card-page" className={navStyle} onClick={() => setOpen(false)}>
                        Products
                    </NavLink>
                </>
            )}
        </>
    );

    return (
        <div className={`navbar-glow fixed top-0 w-full z-50 transition-all duration-300 
            ${scrolled ? "py-2 shadow-xl bg-black/80 backdrop-blur-xl" : "py-4"} max-w-7xl mx-auto mb-5
        `}>

            <div className=" flex justify-between items-center px-6">

                {/* LEFT */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={ljiCON} className="w-10 h-10 rounded-full" />
                    <span className="text-white font-bold">Laivin Jewellers</span>
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden lg:flex gap-8">
                    {menu}
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">

                    {/* CART */}
                    {user && (
                        <Link to="/dashboard/cart" className="relative">
                            <FaShoppingCart className="text-2xl text-orange-400" />

                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 rounded-full animate-pulse">
                                {cart?.length || 0}
                            </span>
                        </Link>
                    )}

                    {/* USER */}
                    {user && (
                        <div className="relative group">
                            <img
                                src={user?.photoURL || "https://i.ibb.co/mJR9mkv/default-user.png"}
                                className="w-10 h-10 rounded-full ring-2 ring-orange-400 cursor-pointer"
                            />

                            <div className="absolute hidden group-hover:block top-12 right-0 bg-black text-white text-xs px-3 py-1 rounded">
                                {user?.displayName || "User"}
                            </div>
                        </div>
                    )}

                    {/* BUTTON */}
                    {user ? (
                        <button onClick={handleLogOut} className="btn-glow px-4 py-1 rounded text-white">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="btn-glow px-4 py-1 rounded text-white">
                            Login
                        </Link>
                    )}

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className="lg:hidden text-white text-xl"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div className="lg:hidden bg-black/90 backdrop-blur-xl px-6 py-4 flex flex-col gap-4">
                    {menu}
                </div>
            )}
        </div>
    );
};

export default NavBar;