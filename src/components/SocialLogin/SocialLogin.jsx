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
    const from = location.state?.from?.pathname || "/dashboard/userHome";

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const currentUser = result.user;

            const userInfo = {
                email: currentUser?.email,
                name: currentUser?.displayName,
                image: currentUser?.photoURL || "https://i.ibb.co/vHZ369b/placeholder.png",
                role: "user",
            };

            // ১. ডাটাবেজে ইউজার চেক/সেভ হবে
            await axiosPublic.post("/users", userInfo);

            // ২. JWT টোকেন তৈরি এবং লোকাল স্টোরেজে সেভ (নিরাপত্তার জন্য যুক্ত করা হলো)
            const jwtResponse = await axiosPublic.post("/jwt", { email: currentUser?.email });
            if (jwtResponse.data?.token) {
                localStorage.setItem("access-token", jwtResponse.data.token);
            }

            Swal.fire({
                icon: "success",
                title: "Login Successful",
                showConfirmButton: false,
                timer: 1500,
            });

            navigate(from, { replace: true });
        } catch (error) {
            console.error("Google Sign-In Error:", error);
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
                type="button"
                onClick={handleGoogleSignIn}
                className="btn btn-outline border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black w-full"
            >
                <FaGoogle /> Continue With Google
            </button>
        </div>
    );
};

export default SocialLogin;