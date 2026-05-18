import { FaGoogle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const userInfo = {
                email: result.user?.email,
                name: result.user?.displayName,
                image: result.user?.photoURL || "https://i.ibb.co/vHZ369b/placeholder.png",
                role: "user",
            };

            // ডাটাবেজে ইউজার চেক/সেভ হবে
            await axiosPublic.post("/users", userInfo);

            Swal.fire({
                icon: "success",
                title: "Login Successful",
                showConfirmButton: false,
                timer: 1500,
            });
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Google Login Failed",
                text: error.message,
            });
        }
    };

    return (
        <div className="mt-4">
            <button
                onClick={handleGoogleSignIn}
                className="btn btn-outline border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black w-full"
            >
                <FaGoogle /> Continue With Google
            </button>
        </div>
    );
};

export default SocialLogin;