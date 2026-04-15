import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../../providers/AuthProvider';
import { FaShoppingCart } from 'react-icons/fa';
import shopLogo from '../../../assets/shopLogo.png';

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);

    const handleLogOut = () => {
        logOut()
            .then(() => console.log("Logged out successfully"))
            .catch((error) => console.log("Log out error:", error));
    };

    // Active style
    const navStyle = ({ isActive }) =>
        isActive
            ? "nav-link-base nav-link-active"
            : "nav-link-base";

    const navOptions = (
        <>
            <li><NavLink to="/" className={navStyle}>Home</NavLink></li>
            <li><NavLink to="/staff-records" className={navStyle}>Staff Records</NavLink></li>
            <li><NavLink to="/add-staff" className={navStyle}>Add Staff</NavLink></li>
            {user && <li><NavLink to="/dashboard" className={navStyle}>Dashboard</NavLink></li>}
        </>
    );

    return (
        <div className="navbar navbar-glow fixed top-0 z-50 bg-black/70 backdrop-blur-xl px-6 shadow-lg">

            {/* Left */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white">
                        ☰
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-black rounded-box w-52">
                        {navOptions}
                    </ul>
                </div>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={shopLogo} alt="Logo" className="w-20 h-20" />
                </Link>
            </div>

            {/* Center */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-8">
                    {navOptions}
                </ul>
            </div>

            {/* Right */}
            {/* Right */}
            <div className="navbar-end gap-4">
                {user ? (
                    <>
                        <FaShoppingCart className="text-xl text-red-500 cursor-pointer" />

                        {/* User Image with Tooltip */}
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
                            onClick={handleLogOut}
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