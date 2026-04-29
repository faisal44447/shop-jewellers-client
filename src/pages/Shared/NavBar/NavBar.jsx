import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../../providers/AuthProvider';
import { FaShoppingCart } from 'react-icons/fa';
import Swal from 'sweetalert2'; 
import ljiCON from '../../../assets/ljIcon.JPG'; // Adjust the path as needed

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);


    const handleLogOut = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Logged out successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((error) => console.log("Log out error:", error));
    };

    // Active style logic
    const navStyle = ({ isActive }) =>
        isActive
            ? "nav-link-base nav-link-active underline text-orange-400"
            : "nav-link-base text-white";

    const navOptions = (
        <>
            <li><NavLink to="/" className={navStyle}>Home</NavLink></li>
            {user && <li><NavLink to="/dashboard" className={navStyle}>Dashboard</NavLink></li>}
        </>
    );

    return (
        <div className="navbar navbar-glow fixed top-0 z-50 bg-black/70 backdrop-blur-xl px-6 shadow-lg">
            {/* Left side: Logo & Dropdown */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white">
                        ☰
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-black rounded-box w-52">
                        {navOptions}
                    </ul>
                </div>
                <Link to="/" className="flex items-center gap-2">
                    <img src={ljiCON} alt="Logo" className="w-20 h-20 rounded-full " />
                </Link>
            </div>

            {/* Center side: NavLinks */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-8">
                    {navOptions}
                </ul>
            </div>

            {/* Right side: Cart, User Image & Buttons */}
            <div className="navbar-end gap-4">
                {user ? (
                    <>
                        <FaShoppingCart className="text-xl text-red-500 cursor-pointer" />

                        <div className="tooltip tooltip-bottom" data-tip={user?.displayName || "User Name"}>
                            <div className="avatar">
                                <div className="w-10 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-2">
                                    <img
                                        src={user?.photoURL || "https://i.ibb.co/mJR9mkv/default-user.png"}
                                        alt="User Profile"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogOut} // এখানে ক্লিক করলে ফাংশনটি কল হবে
                            className="btn btn-sm bg-red-500 text-white hover:bg-red-600 border-none"
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <Link to="/login">
                        <button className="btn btn-sm bg-red-500 text-white hover:bg-red-600 border-none">
                            Log In
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default NavBar;