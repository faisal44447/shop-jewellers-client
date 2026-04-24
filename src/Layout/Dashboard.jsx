import { NavLink, Outlet } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAdmin from "../hooks/useAdmin";

const Dashboard = () => {
    const [cart] = useCart();
    const [isAdmin, isAdminLoading] = useAdmin(); // ✅ FIX

    if (isAdminLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner text-warning loading-lg"></span>
            </div>
        );
    }

    const linkStyle = ({ isActive }) =>
        `flex items-center gap-2 p-2 rounded-lg ${isActive ? "bg-orange-700 text-white" : "hover:bg-orange-600 text-white"
        }`;

    return (
        <div className="flex min-h-screen">
            <div className="w-64 bg-orange-500 text-white p-4">
                <h2 className="text-xl font-bold mb-5">Dashboard</h2>

                <ul className="space-y-2">
                    {isAdmin ? (
                        <>
                            <li><NavLink to="/dashboard/adminHome" className={linkStyle}>Admin Home</NavLink></li>
                            <li><NavLink to="/dashboard/add-product" className={linkStyle}>Add Product</NavLink></li>
                            <li><NavLink to="/dashboard/manage-product" className={linkStyle}>Manage Product</NavLink></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/dashboard/userHome" className={linkStyle}>User Home</NavLink></li>
                            <li><NavLink to="/dashboard/products" className={linkStyle}>Products</NavLink></li>
                            <li><NavLink to="/dashboard/cart" className={linkStyle}>Cart ({cart.length})</NavLink></li>
                        </>
                    )}

                    <li><NavLink to="/" className={linkStyle}>Back Home</NavLink></li>
                </ul>
            </div>

            <div className="flex-1 p-6 bg-gray-50">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;