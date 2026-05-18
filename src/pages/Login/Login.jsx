import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha } from "react-simple-captcha";
import Swal from "sweetalert2";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

const Login = () => {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const captchaRef = useRef(null);
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/userHome";

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleVerifyCaptcha = () => {
    const user_captcha_value = captchaRef.current.value;
    if (validateCaptcha(user_captcha_value)) {
      setIsCaptchaVerified(true);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Captcha Verified",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      setIsCaptchaVerified(false);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Invalid Captcha! Try again.",
        showConfirmButton: false,
        timer: 1500
      });
      captchaRef.current.value = "";
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    if (!isCaptchaVerified) {
      Swal.fire({ icon: "warning", title: "Please verify the captcha first!" });
      return;
    }

    try {
      setSubmitLoading(true);
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
      loadCaptchaEnginge(6);
      setIsCaptchaVerified(false);
      if (captchaRef.current) captchaRef.current.value = "";
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="card w-full max-w-md p-[2px] rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 shadow-[0_20px_60px_rgba(255,215,0,0.25)]">
        <form onSubmit={handleLogin} className="card-body rounded-2xl bg-black/70 backdrop-blur-xl text-white">
          <h2 className="text-3xl font-bold text-center text-yellow-400 tracking-wide">Welcome Back</h2>

          {/* Email Input */}
          <div className="form-control mt-4">
            <input name="email" type="email" placeholder="Email" className="input input-bordered bg-black/40 border-yellow-500 focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400" required />
          </div>

          {/* Password Input */}
          <div className="form-control relative mt-3">
            <input name="password" type={showPass ? "text" : "password"} placeholder="Password" className="input input-bordered w-full bg-black/40 border-yellow-500 text-white pr-10" required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-yellow-400 focus:outline-none">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Captcha Section */}
          <div className="form-control mt-3">
            <div className="bg-white rounded-lg p-1 overflow-hidden flex justify-center items-center">
              <LoadCanvasTemplate />
            </div>
            <div className="relative flex gap-2 mt-2">
              <input
                ref={captchaRef}
                type="text"
                placeholder="Type captcha above"
                className="input input-bordered flex-1 bg-black/40 border-yellow-500 text-white"
                disabled={isCaptchaVerified}
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // ফর্ম সাবমিট হওয়া রোধ করবে
                    handleVerifyCaptcha(); // ক্যাপচা ভেরিফাই ফাংশন রান করবে
                  }
                }}
              />
              <button type="button" onClick={handleVerifyCaptcha} disabled={isCaptchaVerified} className={`btn font-bold px-4 transition-all ${isCaptchaVerified ? "bg-green-600 border-none text-white disabled:bg-green-600 disabled:text-white" : "bg-yellow-500 hover:bg-yellow-600 text-black border-none"}`}>
                {isCaptchaVerified ? <CheckCircle size={18} /> : "Verify"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" disabled={!isCaptchaVerified || submitLoading} className="btn mt-5 bg-gradient-to-r from-yellow-400 to-orange-500 border-none text-black font-bold shadow-lg hover:scale-105 transition-all disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:scale-100">
            {submitLoading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm mt-3 text-center text-gray-300">
            New here? <Link to="/signup" className="text-yellow-400 font-bold hover:underline">Create account</Link>
          </p>
          <div className="divider before:bg-gray-700 after:bg-gray-700 text-gray-400 text-xs">OR CONNECT WITH</div>
          <SocialLogin />
        </form>
      </div>
    </div>
  );
};

export default Login;