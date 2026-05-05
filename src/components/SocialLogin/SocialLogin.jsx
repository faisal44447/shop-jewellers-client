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

            // ✅ 1. Save user to DB
            await axiosPublic.post("/users", {
                email: user.email,
                name: user.displayName,
                role: "user",
            });

            // ✅ 2. Get JWT token
            const jwtRes = await axiosPublic.post("/jwt", {
                email: user.email,
            });

            // ✅ 3. Save token
            localStorage.setItem("access-token", jwtRes.data.token);

            Swal.fire("Success", "Google Login Successful", "success");
            navigate("/");
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="p-6">
            <div className="divider">OR</div>

            <button onClick={handleGoogleSignIn} className="btn w-full">
                <div className="btn btn-sm text-red-400"><FaGoogle></FaGoogle></div> Google Login
            </button>
        </div>
    );
};

export default SocialLogin;