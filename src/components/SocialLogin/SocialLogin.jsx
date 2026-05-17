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
            // 🔥 redirect will happen here (no result)
            await googleSignIn();

            // NOTE: after redirect, user will come back
            // real user handling is in onAuthStateChanged
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="p-6">
            <div className="divider">OR</div>

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