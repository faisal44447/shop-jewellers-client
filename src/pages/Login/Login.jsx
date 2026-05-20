import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider"; // আপনার পাথ অনুযায়ী চেঞ্জ করতে পারেন
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInUser } = useContext(AuthContext); // AuthProvider এ আপনার লিঙ্কিং মেথড (যেমন: signIn)
  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/userHome";

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value.trim(); // ট্রিমিং করা হলো যেন এক্সট্রা স্পেস না থাকে
    const password = form.password.value;

    try {
      setLoading(true);

      // ১. ফায়ারবেস সাইন-ইন
      const result = await signInUser(email, password);
      const loggedUser = result.user;

      // ২. লগইন সফল হলে JWT টোকেন জেনারেট ও লোকাল স্টোরেজে সেট
      const jwtResponse = await axiosPublic.post("/jwt", { email: loggedUser?.email });
      if (jwtResponse.data?.token) {
        localStorage.setItem("access-token", jwtResponse.data.token);
      }

      Swal.fire({
        icon: "success",
        title: "লগইন সফল হয়েছে!",
        showConfirmButton: false,
        timer: 1500
      });

      navigate(from, { replace: true });

    } catch (error) {
      console.error("Firebase Auth Error Details:", error);

      let errorMessage = "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";

      // সুনির্দিষ্টভাবে invalid-credential বা ভুল পাসওয়ার্ড ক্যাচ করা
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        errorMessage = "আপনার দেওয়া ইমেইল অথবা পাসওয়ার্ডটি সঠিক নয়! দয়া করে আবার চেক করুন।";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "ভুল পাসওয়ার্ড দিয়ে অনেকবার চেষ্টা করা হয়েছে। অ্যাকাউন্টটি সাময়িকভাবে লক করা হয়েছে। একটু পরে চেষ্টা করুন।";
      }

      Swal.fire({
        icon: "error",
        title: "লগইন ফেইল!",
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="card w-full max-w-md p-[2px] rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 shadow-[0_20px_60px_rgba(255,215,0,0.25)]">
        <form onSubmit={handleLogin} className="card-body rounded-2xl bg-black/70 backdrop-blur-xl text-white">
          <h2 className="text-3xl font-bold text-center text-yellow-400 tracking-wide">Welcome Back</h2>

          {/* Email Input */}
          <div className="form-control mt-4">
            <input name="email" type="email" placeholder="Your Email" className="input input-bordered bg-black/40 border-yellow-500 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400" required />
          </div>

          {/* Password Input */}
          <div className="form-control relative mt-3">
            <input name="password" type={showPass ? "text" : "password"} placeholder="Your Password" className="input input-bordered w-full bg-black/40 border-yellow-500 text-white pr-10" required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-yellow-400 focus:outline-none">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn mt-5 bg-gradient-to-r from-yellow-400 to-orange-500 border-none text-black font-bold shadow-lg hover:scale-105 transition-all disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:scale-100">
            {loading ? "Logging In..." : "Login"}
          </button>

          <p className="text-sm mt-3 text-center text-gray-300">
            New here? <Link to="/signup" className="text-yellow-400 font-bold hover:underline">Create an account</Link>
          </p>
          <div className="divider before:bg-gray-700 after:bg-gray-700 text-gray-400 text-xs">OR CONNECT WITH</div>
          <SocialLogin />
        </form>
      </div>
    </div>
  );
};

export default Login;