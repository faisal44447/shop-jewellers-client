import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUsers, FaUtensils, FaList, FaBook, FaCalendar, FaAd, FaSearch, FaEnvelope } from "react-icons/fa";
import useCart from "../hooks/useCart";
import useAdmin from "../hooks/useAdmin";

const Dashboard = () => {
    const [cart] = useCart();
    const [isAdmin] = useAdmin();

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-orange-500 text-white min-h-screen p-4">
                <h2 className="text-2xl font-bold text-center mb-8 uppercase">Shop Panel</h2>
                <ul className="menu space-y-2">

                    {isAdmin ? (
                        <>
                            <li><NavLink to="/dashboard/adminHome">Admin Home</NavLink></li>
                            <li><NavLink to="/dashboard/add-product">Add Product</NavLink></li>
                            <li><NavLink to="/dashboard/manage-products">Manage Products</NavLink></li>
                            <li><NavLink to="/dashboard/all-users">All Users</NavLink></li>
                            <li><NavLink to="/dashboard/sales">Sales History</NavLink></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/dashboard/userHome">User Home</NavLink></li>
                            <li><NavLink to="/dashboard/sell-product">Sell Product</NavLink></li>
                            <li><NavLink to="/dashboard/history">History</NavLink></li>
                        </>
                    )}

                </ul>
            </div>
            <div className="flex-1 p-10">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;