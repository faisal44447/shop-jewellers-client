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

        // ডিফল্ট অ্যাভাটার ইমেজ (সচল লিংক)
        const photoURL = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

        // পাসওয়ার্ড ভ্যালিডেশন
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

            // ১. নতুন ইউজার ফায়ারবেসে তৈরি করা
            await createUser(email, password);

            // ২. ফায়ারবেস প্রোফাইল আপডেট করা (Name & Photo)
            await updateUserProfile(name, photoURL);

            // ৩. ব্যাকএন্ডের মঙ্গোডিবি ডাটাবেজে ইউজার ডাটা সেভ করা (যুক্ত করা হলো)
            const userInfo = {
                name: name,
                email: email,
                image: photoURL
            };

            // আপনার লোকাল বা লাইভ ব্যাকএন্ড ইউআরএলটি এখানে ব্যবহার করুন
            // উদাহরণস্বরূপ: 'https://your-vercel-server.vercel.app/users' অথবা 'http://localhost:5000/users'
            const backendUrl = "http://localhost:5000/users";

            const response = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userInfo)
            });

            const dbData = await response.json();

            // ডাটাবেজে সফলভাবে সেভ হলে বা ইউজার আগে থেকে থাকলে ড্যাশবোর্ডে পাঠাবো
            if (dbData.insertedId || dbData.success) {
                Swal.fire({
                    icon: "success",
                    title: "অ্যাকাউন্ট তৈরি সফল হয়েছে!",
                    showConfirmButton: false,
                    timer: 1500
                });

                // রিডাইরেক্ট টু ড্যাশবোর্ড
                navigate("/dashboard/userHome", { replace: true });
            } else {
                throw new Error("ডাটাবেজে ইউজার ইনফো সেভ করা যায়নি।");
            }

        } catch (error) {
            console.error("SignUp Error:", error);

            let errorMessage = "সাইন-আপ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";

            if (error.code === "auth/email-already-in-use" || error.message?.includes("email-already-in-use")) {
                errorMessage = "এই ইমেইলটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে! দয়া করে লগইন করুন।";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "ইমেইল ফরম্যাটটি সঠিক নয়। সঠিক ইমেইল দিন।";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "পাসওয়ার্ডটি খুবই দুর্বল। আরও শক্তিশালী পাসওয়ার্ড দিন।";
            } else if (error.message) {
                errorMessage = error.message; // ডাটাবেজ এরর মেসেজ হ্যান্ডল করার জন্য
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