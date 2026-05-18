import { FaGoogle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();

    // 👑 'from' লোকেশন ডিক্লেয়ার করা হলো যাতে গুগল লগইনের পর সঠিক পেজে যায়
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName
                };

                // প্রথমে ইউজার ডাটাবেজে সেভ বা চেক করুন
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        // এবার ব্যাকএন্ড থেকে JWT টোকেনটি জেনারেট করে আনুন
                        axiosPublic.post('/jwt', { email: result.user?.email })
                            .then(tokenRes => {
                                if (tokenRes.data.token) {
                                    localStorage.setItem('access-token', tokenRes.data.token);

                                    Swal.fire({
                                        icon: "success",
                                        title: "Google Login Successful",
                                        showConfirmButton: false,
                                        timer: 1500
                                    });

                                    navigate(from, { replace: true });
                                }
                            });
                    });
            })
            .catch(error => {
                console.error("Google Sign In Error:", error);
                Swal.fire({ icon: "error", title: "Authentication Failed", text: error.message });
            });
    };

    return (
        <div className="mt-4">
            <div className="divider text-gray-400 text-xs">OR CONTINUE WITH</div>
            <div className="flex justify-center mt-2">
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="btn btn-outline border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black w-full"
                >
                    <FaGoogle className="mr-2" />
                    Google
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;