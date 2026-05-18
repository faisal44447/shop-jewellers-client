import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
    const [showPass, setShowPass] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const photoURL = form.photoURL?.value || "https://i.ibb.co/vHZ369b/placeholder.png";

        // পাসওয়ার্ড ভ্যালিডেশন (কমপক্ষে ৬ ক্যারেক্টার)
        if (password.length < 6) {
            Swal.fire({
                icon: "warning",
                title: "পাসওয়ার্ড দুর্বল!",
                text: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
            });
            return;
        }

        try {
            setSubmitLoading(true);

            // ১. নতুন ইউজার তৈরি করা
            await createUser(email, password);

            // ২. প্রোফাইল আপডেট করা (নাম ও ছবি সেট করা)
            await updateUserProfile(name, photoURL);

            Swal.fire({
                icon: "success",
                title: "অ্যাকাউন্ট তৈরি সফল হয়েছে!",
                showConfirmButton: false,
                timer: 1500
            });

            // অ্যাকাউন্ট তৈরির পর সরাসরি ড্যাশবোর্ডে নিয়ে যাবে
            navigate("/dashboard/userHome", { replace: true });

        } catch (error) {
            console.error("SignUp Error:", error);

            // 🎯 Firebase Email Already in Use এবং অন্যান্য এরর হ্যান্ডলিং
            let errorMessage = "সাইন-আপ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";

            if (error.code === "auth/email-already-in-use" || error.message.includes("email-already-in-use")) {
                errorMessage = "এই ইমেইলটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে! দয়া করে লগইন করুন।";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "ইমেইল ফরম্যাটটি সঠিক নয়। সঠিক ইমেইল দিন।";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "পাসওয়ার্ডটি খুবই দুর্বল। আরও শক্তিশালী পাসওয়ার্ড দিন।";
            }

            Swal.fire({
                icon: "error",
                title: "সাইন-আপ ফেইল!",
                text: errorMessage
            });

        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="card w-full max-w-md p-[2px] rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 shadow-[0_20px_60px_rgba(255,215,0,0.25)]">
                <form onSubmit={handleSignUp} className="card-body rounded-2xl bg-black/70 backdrop-blur-xl text-white">
                    <h2 className="text-3xl font-bold text-center text-yellow-400 tracking-wide">Create Account</h2>

                    {/* Name Input */}
                    <div className="form-control mt-4">
                        <input name="name" type="text" placeholder="Full Name" className="input input-bordered bg-black/40 border-yellow-500 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400" required />
                    </div>

                    {/* Email Input */}
                    <div className="form-control mt-3">
                        <input name="email" type="email" placeholder="Email" className="input input-bordered bg-black/40 border-yellow-500 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400" required />
                    </div>

                    {/* Photo URL Input (Optional) */}
                    <div className="form-control mt-3">
                        <input name="photoURL" type="url" placeholder="Photo URL (Optional)" className="input input-bordered bg-black/40 border-yellow-500 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400" />
                    </div>

                    {/* Password Input */}
                    <div className="form-control relative mt-3">
                        <input name="password" type={showPass ? "text" : "password"} placeholder="Password" className="input input-bordered w-full bg-black/40 border-yellow-500 text-white pr-10" required />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-yellow-400 focus:outline-none">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={submitLoading} className="btn mt-5 bg-gradient-to-r from-yellow-400 to-orange-500 border-none text-black font-bold shadow-lg hover:scale-105 transition-all disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:scale-100">
                        {submitLoading ? "Creating Account..." : "Sign Up"}
                    </button>

                    <p className="text-sm mt-3 text-center text-gray-300">
                        Already have an account? <Link to="/login" className="text-yellow-400 font-bold hover:underline">Login here</Link>
                    </p>
                    <div className="divider before:bg-gray-700 after:bg-gray-700 text-gray-400 text-xs">OR CONNECT WITH</div>
                    <SocialLogin />
                </form>
            </div>
        </div>
    );
};

export default SignUp;