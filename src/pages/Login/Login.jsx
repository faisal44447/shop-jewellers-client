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
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { signIn, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

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

      // ১ সেকেন্ড বিরতি যাতে AuthProvider টোকেন সেট করার সুযোগ পায়
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

    } catch (error) {
      console.error(error);
      setSubmitLoading(false);

      let errorMessage = "লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।";
      if (error.code === "auth/invalid-credential" || error.message.includes("invalid-credential")) {
        errorMessage = "ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন! দয়া করে সঠিক তথ্য দিন।";
      }

      Swal.fire({
        icon: "error",
        title: "লগইন ফেইল!",
        text: errorMessage
      });

      loadCaptchaEnginge(6);
      setIsCaptchaVerified(false);
      if (captchaRef.current) captchaRef.current.value = "";
    }
  };

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
              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input type="email" name="email" placeholder="email" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Password</span></label>
                <input type="password" name="password" placeholder="password" className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label"><LoadCanvasTemplate /></label>
                <input onBlur={handleValidateCaptcha} type="text" ref={captchaRef} name="captcha" placeholder="Type captcha" className="input input-bordered" required />
              </div>
              <div className="form-control mt-6">
                <button disabled={submitLoading} className="btn btn-primary">
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