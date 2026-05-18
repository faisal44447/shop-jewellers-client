import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha } from "react-simple-captcha";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { signIn } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const captchaValue = form.captcha.value; // ক্যাপচা ইনপুটের ভ্যালু

    // ১. প্রথমেই ক্যাপচা চেক করা হচ্ছে (ভুল হলে এখানেই আটকে দেবে, রি-রেন্ডার হবে না)
    if (!validateCaptcha(captchaValue)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Captcha",
        text: "Captcha did not match. Please try again!",
      });
      return; // কোড এখানেই থেমে যাবে, লগইন রিকোয়েস্ট যাবে না
    }

    try {
      setSubmitLoading(true);

      // ২. ক্যাপচা সঠিক হলে ফায়ারবেস লগইন হবে
      await signIn(email, password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Login Failed", text: error.message });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="card w-full max-w-md p-[2px] rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 shadow-[0_20px_60px_rgba(255,215,0,0.25)]">
        <form onSubmit={handleLogin} className="card-body rounded-2xl bg-black/70 backdrop-blur-xl text-white">
          <h2 className="text-3xl font-bold text-center text-yellow-400 tracking-wide">Welcome Back</h2>

          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered bg-black/40 border-yellow-500 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400 mt-4"
            required
          />

          {/* PASSWORD */}
          <div className="relative mt-3">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full bg-black/40 border-yellow-500 text-white pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-yellow-400"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* CAPTCHA */}
          <div className="form-control mt-3">
            <div className="bg-white rounded-lg p-1 overflow-hidden">
              <LoadCanvasTemplate />
            </div>
            <input
              name="captcha" // এখানে name="captcha" দেওয়া হয়েছে ফর্ম ডেটা সহজে পাওয়ার জন্য
              type="text"
              placeholder="Type captcha above"
              className="input input-bordered bg-black/40 border-yellow-500 text-white mt-2"
              required
            />
          </div>

          {/* LOGIN BTN */}
          <button
            type="submit"
            disabled={submitLoading} // শুধু সাবমিট লোডিং হলে বাটন ডিজেবল থাকবে
            className="btn mt-5 bg-gradient-to-r from-yellow-400 to-orange-500 border-none text-black font-bold shadow-lg hover:scale-105 transition-all disabled:bg-gray-600 disabled:text-gray-400"
          >
            {submitLoading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm mt-3 text-center">
            New here? <Link to="/signup" className="text-yellow-400 font-bold hover:underline">Create account</Link>
          </p>

          <SocialLogin />
        </form>
      </div>
    </div>
  );
};

export default Login;