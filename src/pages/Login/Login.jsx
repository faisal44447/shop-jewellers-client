import { useContext, useEffect, useRef, useState } from "react";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha
} from "react-simple-captcha";
import { AuthContext } from "../../providers/AuthProvider"; // আপনার পাথ অনুযায়ী ঠিক থাকতে পারে
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

const Login = () => {
  const captchaRef = useRef(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { signIn, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ইউজার যে পেজ থেকে ব্যাক করেছে সেখানে পাঠানো, অথবা সরাসরি ড্যাশবোর্ডে পাঠানো
  const from = location.state?.from?.pathname || "/dashboard";

  // ================= CAPTCHA INITIALIZATION =================
  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  // ================= HANDLE CAPTCHA VALIDATION =================
  const handleValidateCaptcha = (e) => {
    const user_captcha_value = e.target.value;
    if (validateCaptcha(user_captcha_value)) {
      setIsCaptchaVerified(true);
      Swal.fire({
        icon: "success",
        title: "Captcha Verified Successfully!",
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      setIsCaptchaVerified(false);
    }
  };

  // ================= MAIN LOGIN HANDLER =================
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

      // ১. ফায়ারবেস দিয়ে লগইন সফল করা
      await signIn(email, password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500
      });

      // 🎯 ফিক্স: ১ সেকেন্ড বিরতি দেওয়া হলো যাতে AuthProvider ব্যাকএন্ড থেকে JWT টোকেন এনে 
      // LocalStorage-এ সেট করার জন্য পর্যাপ্ত সময় পায়।
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

    } catch (error) {
      console.error("Login Error Details:", error);
      setSubmitLoading(false); // এরর আসলে লোডিং এখানেই বন্ধ হবে

      // 🎯 Firebase Invalid Credential Error Handling
      let errorMessage = "লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।";
      if (error.code === "auth/invalid-credential" || error.message.includes("invalid-credential")) {
        errorMessage = "ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন! দয়া করে সঠিক তথ্য দিন।";
      }

      Swal.fire({
        icon: "error",
        title: "লগইন ফেইল!",
        text: errorMessage
      });

      // ক্যাপচা রিসেট করা
      loadCaptchaEnginge(6);
      setIsCaptchaVerified(false);
      if (captchaRef.current) captchaRef.current.value = "";
    }
  };

  // ================= GOOGLE LOGIN HANDLER =================
  const handleGoogleLogin = async () => {
    try {
      setSubmitLoading(true);
      await googleLogin();
      Swal.fire({
        icon: "success",
        title: "Google Login Successful",
        showConfirmButton: false,
        timer: 1500
      });

      // গুগল লগইনের জন্যও ১ সেকেন্ডের সেফটি ডিলে
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

    } catch (error) {
      console.error("Google Login Error:", error);
      setSubmitLoading(false);
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Al Amin Jewellers | Login</title>
      </Helmet>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left md:w-1/2">
            <h1 className="text-5xl font-bold">Login now! 💎</h1>
            <p className="py-6">
              Welcome back to Al Amin Jewellers Shop Management System. Please securely log in to access your dashboard.
            </p>
          </div>
          <div className="card md:w-1/2 max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleLogin} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* ================= CAPTCHA CANVAS ================= */}
              <div className="form-control">
                <label className="label">
                  <LoadCanvasTemplate />
                </label>
                <input
                  onBlur={handleValidateCaptcha}
                  type="text"
                  ref={captchaRef}
                  name="captcha"
                  placeholder="Type the captcha text above"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button
                  disabled={submitLoading}
                  className="btn btn-primary"
                >
                  {submitLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>

            <div className="p-6 text-center pt-0">
              <div className="divider">OR</div>
              <button
                disabled={submitLoading}
                onClick={handleGoogleLogin}
                className="btn btn-outline btn-secondary w-full mb-4"
              >
                Sign in with Google
              </button>
              <p>
                <small>
                  New here? <Link to="/signup" className="text-primary font-bold">Create an account</Link>
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;