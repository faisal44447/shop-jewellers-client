import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import {
  LoadCanvasTemplate,
  loadCaptchaEnginge,
  validateCaptcha,
} from "react-simple-captcha";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [disabled, setDisabled] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const { signIn } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleValidateCaptcha = (e) => {
    const value = e.target.value;
    setDisabled(!validateCaptcha(value));
  };
  const handleLogin = async (event) => {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await signIn(email, password);
      const user = result.user;

      const res = await axiosPublic.post("/jwt", {
        email: user.email,
      });

      localStorage.setItem("access-token", res.data.token);

      await axiosPublic.post("/users", {
        email: user.email,
        name: user.displayName || "User",
      });

      Swal.fire("Success", "Login Successful", "success");
      navigate(from, { replace: true });

    } catch (error) {
      console.log("ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.code || error.message,
      });
    }
  };

  return (
    <div className="hero min-h-screen flex items-center justify-center bg-gray-900">

      {/* 🔥 MATCHED SIGNUP STYLE CARD */}
      <div className="card w-96 p-[2px] rounded-2xl 
        bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 
        shadow-[0_20px_60px_rgba(255,215,0,0.25)]">

        <form
          onSubmit={handleLogin}
          className="card-body rounded-2xl bg-black/70 backdrop-blur-xl text-white"
        >
          <h2 className="text-3xl font-bold text-center text-yellow-400 tracking-wide">
            Welcome Back
          </h2>

          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered bg-black/40 border-yellow-500 
            focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400 mt-4"
            required
          />

          {/* PASSWORD */}
          <div className="relative mt-3">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full bg-black/40 border-yellow-500 
              text-white pr-10"
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
            <LoadCanvasTemplate />
            <input
              onBlur={handleValidateCaptcha}
              type="text"
              placeholder="type captcha"
              className="input input-bordered bg-black/40 border-yellow-500 text-white mt-2"
            />
          </div>

          {/* LOGIN BTN */}
          <button
            type="submit"
            disabled={disabled}
            className="btn mt-5 bg-gradient-to-r from-yellow-400 to-orange-500 
            border-none text-black font-bold shadow-lg 
            hover:scale-105 transition-all"
          >
            Login
          </button>

          {/* SIGNUP LINK */}
          <p className="text-sm mt-3 text-center">
            New here?{" "}
            <Link to="/signup" className="text-yellow-400 font-bold hover:underline">
              Create account
            </Link>
          </p>
        </form>

        <SocialLogin />
      </div>
    </div>
  );
};

export default Login;