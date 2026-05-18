import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();

    // দুটি লোডিং স্টেটই একসাথে হ্যান্ডেল করা হলো যাতে ডাটা আসা পর্যন্ত পেজ হোল্ড থাকে
    if (loading || isAdminLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <span className="loading loading-spinner text-warning loading-lg"></span>
            </div>
        );
    }

    // ইউজার যদি লগইন করা থাকে এবং সে যদি এডমিন হয় তবেই কেবল চিলড্রেন দেখাবে
    if (user && isAdmin) {
        return children;
    }

    // ইউজার লগইন না থাকলে লগইন পেজে পাঠাবে
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // ইউজার লগইন আছে কিন্তু এডমিন নয়, তাকে ইউজার হোমে পাঠাবে
    return <Navigate to="/dashboard/userHome" replace />;
};

export default AdminRoute;