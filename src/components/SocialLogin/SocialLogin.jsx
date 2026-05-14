import { FaGoogle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            // শুধু ডাটাবেজে ইউজার ইনফো সেভ করার জন্য রিকোয়েস্ট পাঠান
            await axiosPublic.post("/users", {
                email: user.email,
                name: user.displayName,
                role: "user",
            });

            Swal.fire("Success", "Google Login Successful", "success");
            navigate("/"); // সরাসরি রিডাইরেক্ট, টোকেন AuthProvider সেট করে দেবে।
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="p-6">

            <div className="divider">OR</div>

            {/* CLEAN BUTTON */}
            <button
                onClick={handleGoogleSignIn}
                className="btn w-full flex items-center gap-2 justify-center bg-white text-black hover:bg-gray-200"
            >
                <FaGoogle className="text-red-500 text-lg" />
                Continue with Google
            </button>

        </div>
    );
};

export default SocialLogin;