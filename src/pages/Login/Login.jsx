import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha'; import Swal from 'sweetalert2';

const Login = () => {
    const [disabled, setDisabled] = useState(true);
    const [showPass, setShowPass] = useState(false);
    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        loadCaptchaEnginge(6);
    }, []);

    const handleValidateCaptcha = (e) => {
        const user_captcha_value = e.target.value;
        if (validateCaptcha(user_captcha_value)) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };

    const handleLogin = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        signIn(email, password)
            .then(() => {
                Swal.fire("Success", "Login Successful", "success");
                navigate(from, { replace: true });
            })
            .catch(err => Swal.fire("Error", err.message, "error"));
    };

    return (
        <div className="hero min-h-screen pt-24 bg-gradient-to-br from-gray-900 via-black to-gray-800">            <div className="card w-full max-w-sm p-[2px] rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 shadow-[0_20px_60px_rgba(255,215,0,0.25)]">

            <div className="card-body rounded-2xl bg-black/70 backdrop-blur-xl text-white">

                <h2 className="text-3xl font-bold text-center text-yellow-400 tracking-wide">
                    Welcome Back
                </h2>

                {/* Email */}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="input input-bordered bg-black/40 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400 mt-4"
                    required
                />

                {/* Password */}
                <div className="relative mt-2">
                    <input
                        name="password"
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        className="input input-bordered w-full bg-black/40 border-yellow-500 text-white"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-3 text-yellow-400 text-sm"
                    >
                        {showPass ? "Hide" : "Show"}
                    </button>
                </div>

                {/* Captcha */}
                <div className="form-control">
                    <label className="label">
                        <LoadCanvasTemplate />
                    </label>
                    <input onBlur={handleValidateCaptcha} type="text" name="captcha" placeholder="type the captcha above" className="input input-bordered" />

                </div>

                {/* Button */}
                <button
                    disabled={disabled}
                    className="btn mt-5 bg-gradient-to-r from-yellow-400 to-orange-500 border-none text-black font-bold shadow-lg hover:scale-105 hover:shadow-yellow-500/50 transition-all duration-300"
                >
                    Login
                </button>

                {/* Signup */}
                <p className="text-sm mt-3 text-center">
                    New here?{" "}
                    <Link to="/signup" className="text-yellow-400 font-bold hover:underline">
                        Create account
                    </Link>
                </p>
            </div>
            <SocialLogin></SocialLogin>
        </div>
        </div>
    );
};

export default Login;