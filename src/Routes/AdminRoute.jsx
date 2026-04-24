import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin(); // ✅ correct destructuring
    const location = useLocation();

    if (loading || isAdminLoading) {
        return (
            <div className="flex justify-center mt-10">
                <span className="loading loading-spinner text-warning"></span>
            </div>
        );
    }

    // ❌ login না থাকলে login page এ পাঠাবে
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // ❌ admin না হলে user dashboard এ পাঠাবে
    if (!isAdmin) {
        return <Navigate to="/dashboard/userHome" replace />;
    }

    // ✅ admin হলে access দিবে
    return children;
};

export default AdminRoute;