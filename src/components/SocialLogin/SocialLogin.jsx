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

            // ✅ এখানেই role add করো
            const userInfo = {
                email: user.email,
                name: user.displayName,
                role: "user"
            };

            await axiosPublic.post('/users', userInfo).catch(() => { });

            Swal.fire("Success", "Google Login Successful", "success");

            navigate('/');
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="p-6">
            <div className="divider">OR</div>

            <button onClick={handleGoogleSignIn} className="btn w-full bg-black/40 border-yellow-500 text-white mt-2 hover:bg-yellow-500 hover:text-black">
                <FaGoogle className="text-red-500 mr-2" />
                Google Login
            </button>
        </div>
    );
};

export default SocialLogin;