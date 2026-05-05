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
      // ✅ Firebase login
      const result = await signIn(email, password);
      const user = result.user;

      // ✅ Get JWT token
      const res = await axiosPublic.post("/jwt", {
        email: user.email,
      });

      localStorage.setItem("access-token", res.data.token);

      // ✅ Save user in DB (optional)
      const userInfo = {
        email: user.email,
        name: user.displayName || "User",
      };

      await axiosPublic.post("/users", userInfo);

      Swal.fire("Success", "Login Successful", "success");
      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="hero min-h-screen pt-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 -mt-20 py-10">
      <div className="card w-full max-w-sm p-[2px] rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 shadow-lg">

        <form
          onSubmit={handleLogin}
          className="card-body rounded-2xl bg-black/70 text-white"
        >
          <h2 className="text-3xl font-bold text-center text-yellow-400">
            Welcome Back
          </h2>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered mt-4"
            required
          />

          {/* Password */}
          <div className="relative mt-2">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-sm"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {/* Captcha */}
          <div className="form-control mt-3">
            <LoadCanvasTemplate />
            <input
              onBlur={handleValidateCaptcha}
              type="text"
              placeholder="type captcha"
              className="input input-bordered mt-2"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={disabled}
            className="btn mt-5 bg-yellow-400 text-black font-bold"
          >
            Login
          </button>

          {/* Signup */}
          <p className="text-sm mt-3 text-center">
            New here?{" "}
            <Link to="/signup" className="text-yellow-400 font-bold">
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