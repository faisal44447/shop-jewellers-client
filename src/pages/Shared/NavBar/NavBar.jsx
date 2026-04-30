import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import { CartContext } from "../../../providers/CartProvider";
import { FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import ljiCON from "../../../assets/ljIcon.JPG";

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

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
        isActive
            ? "text-orange-400 border-b-2 border-orange-400 pb-1"
            : "text-white hover:text-orange-400";

    return (
        <div className="navbar fixed top-0 z-50 bg-black/80 backdrop-blur-md px-6 shadow-lg">

            {/* LEFT */}
            <div className="navbar-start">
                <Link to="/" className="flex items-center gap-2">
                    <img src={ljiCON} className="w-12 h-12 rounded-full" />
                    <span className="text-white font-bold">LJ Shop</span>
                </Link>
            </div>

            {/* CENTER */}
            <div className="navbar-center hidden lg:flex gap-8">
                <NavLink to="/" className={navStyle}>Home</NavLink>

                {user && (
                    <>
                        <NavLink to="/dashboard" className={navStyle}>Dashboard</NavLink>
                        <NavLink to="/dashboard/product-card-page" className={navStyle}>
                            Products
                        </NavLink>
                    </>
                )}
            </div>

            {/* RIGHT */}
            <div className="navbar-end flex items-center gap-4">

                {/* CART ICON */}
                {user && (
                    <NavLink to="/dashboard/cart" className="relative">
                        <FaShoppingCart className="text-2xl text-red-500" />

                        {/* BADGE */}
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                            {cart?.length || 0}
                        </span>
                    </NavLink>
                )}

                {user ? (
                    <button
                        onClick={handleLogOut}
                        className="btn btn-sm bg-red-500 text-white"
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="btn btn-sm bg-orange-500 text-white">
                        Login
                    </Link>
                )}

            </div>
        </div>
    );
};

export default NavBar;