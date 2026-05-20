import { useContext, useEffect, useRef, useState } from "react";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha
} from "react-simple-captcha";
import { AuthContext } from "../../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

const Login = () => {
  const captchaRef = useRef(null);

  // 🎯 প্রোডাকশন এরর দূর করার জন্য স্টেট ডিফাইন (Controlled Inputs)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // AuthContext থেকে ফাংশনগুলো আনা হলো
  const { signIn, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // ক্যাপচা ইঞ্জিন লোড
  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  // ক্যাপচা ভ্যালিডেশন হ্যান্ডলার
  const handleValidateCaptcha = () => {
    if (validateCaptcha(captchaInput)) {
      setIsCaptchaVerified(true);
      Swal.fire({
        icon: "success",
        title: "Captcha Verified!",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      setIsCaptchaVerified(false);
      Swal.fire({
        icon: "error",
        title: "Wrong Captcha!",
        text: "ক্যাপচা কোডটি মিলেনি, আবার চেষ্টা করুন।"
      });
      setCaptchaInput("");
      if (captchaRef.current) captchaRef.current.value = "";
    }
  };

  // ইমেইল-পাসওয়ার্ড লগইন হ্যান্ডলার
  const handleLogin = async (event) => {
    event.preventDefault();

    // সেফটি চেক: ডাটা খালি আছে কিনা
    if (!email || !password) {
      Swal.fire({ icon: "error", title: "ইমেইল এবং পাসওয়ার্ড দুটিই আবশ্যক!" });
      return;
    }

    // ক্যাপচা ভেরিফিকেশন চেক
    if (!isCaptchaVerified) {
      Swal.fire({
        icon: "warning",
        title: "Please verify the captcha first!",
        text: "দয়া করে ক্যাপচা কোডটি লিখে পাশের Verify বাটনে ক্লিক করুন।"
      });
      return;
    }

    try {
      setSubmitLoading(true);

      // 🎯 ফায়ারবেজে স্টেট থেকে সরাসরি ডাটা পাঠানো হচ্ছে (১০০% নিরাপদ)
      await signIn(email, password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500
      });

      // টোকেন সেট হওয়ার জন্য সামান্য বিরতি
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

    } catch (error) {
      console.error("Firebase Auth Error Details:", error);
      setSubmitLoading(false);

      let errorMessage = "লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।";

      // সুনির্দিষ্ট এরর মেসেজ হ্যান্ডলিং
      if (error.code === "auth/invalid-credential" || error.message.includes("invalid-credential")) {
        errorMessage = "ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন! অথবা আপনার ফায়ারবেজে এই অ্যাকাউন্টটি নেই।";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। প্রথমে সাইন-আপ করুন।";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "পাসওয়ার্ডটি সঠিক নয়! আবার চেষ্টা করুন।";
      }

      Swal.fire({
        icon: "error",
        title: "লগইন ফেইল!",
        text: errorMessage
      });

      // এরর হলে ক্যাপচা রিসেট
      loadCaptchaEnginge(6);
      setIsCaptchaVerified(false);
      setCaptchaInput("");
      if (captchaRef.current) captchaRef.current.value = "";
    }
  };

  // গুগল লগইন হ্যান্ডলার
  const handleGoogleLogin = async () => {
    try {
      setSubmitLoading(true);
      await googleSignIn();

      Swal.fire({
        icon: "success",
        title: "Google Login Successful",
        showConfirmButton: false,
        timer: 1500
      });

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

    } catch (error) {
      console.error(error);
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
            <p className="py-6">Welcome back to Al Amin Jewellers Shop Management System.</p>
          </div>
          <div className="card md:w-1/2 max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleLogin} className="card-body">
              {/* ইমেল ইনপুট */}
              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* পাসওয়ার্ড ইনপুট */}
              <div className="form-control">
                <label className="label"><span className="label-text">Password</span></label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* ক্যাপচা সেকশন */}
              <div className="form-control">
                <label className="label"><LoadCanvasTemplate /></label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    ref={captchaRef}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Type captcha"
                    className="input input-bordered w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleValidateCaptcha}
                    className="btn btn-outline btn-xs h-auto py-3"
                  >
                    Verify
                  </button>
                </div>
                {isCaptchaVerified && <span className="text-xs text-success mt-1">✓ Captcha Verified</span>}
              </div>

              <div className="form-control mt-6">
                <button disabled={submitLoading} className="btn btn-primary w-full">
                  {submitLoading ? <span className="loading loading-spinner"></span> : "Login"}
                </button>
              </div>
            </form>

            <div className="p-6 text-center pt-0">
              <div className="divider">OR</div>
              <button disabled={submitLoading} onClick={handleGoogleLogin} className="btn btn-outline btn-secondary w-full mb-4">
                Sign in with Google
              </button>
              <p><small>New here? <Link to="/signup" className="text-primary font-bold">Create an account</Link></small></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;