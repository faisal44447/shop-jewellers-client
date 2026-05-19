import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();

    if (loading || isAdminLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <span className="loading loading-spinner text-warning loading-lg"></span>
            </div>
        );
    }

    // ✅ ইউজার যদি লগইন করা থাকে এবং এডমিন হয়, তবেই কেবল Admin Component দেখাবে
    if (user && isAdmin) {
        return children;
    }

    // 🎯 ইউজার লগইন আছে কিন্তু এডমিন নয়, তাকে জেনারেল ইউজার ড্যাশবোর্ডে পাঠানো হোক
    if (user && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    // ইউজার একদমই লগইন না থাকলে লগইন পেজে পাঠাবে
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;