import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 👑 অ্যাপ রিলোড হলে ফায়ারবেস চেক করা পর্যন্ত এই স্পিনারটি ইউজারকে আটকে রাখবে
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <span className="loading loading-spinner text-warning loading-lg"></span>
            </div>
        );
    }

    if (!user) {
        // লগইন না থাকলে লগইন পেজে পাঠাবে এবং আগের লোকেশন মনে রাখবে
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;