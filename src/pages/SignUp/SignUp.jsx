import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import SocialLogin from "../../components/SocialLogin/SocialLogin";

const SignUp = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { createUser, updateUserProfile } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            // CREATE USER
            const result = await createUser(
                data.email,
                data.password
            );

            // UPDATE PROFILE
            await updateUserProfile(data.name, "");

            // SAVE USER TO DB
            await axiosPublic.post("/users", {
                name: data.name,
                email: data.email,
                role: "user",
            });

            Swal.fire(
                "Success",
                "Account created successfully",
                "success"
            );

            navigate("/");

        } catch (err) {

            Swal.fire(
                "Error",
                err.message,
                "error"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen flex items-center justify-center bg-gray-900">

            <div className="card w-96 bg-black/70 p-5 text-white rounded-xl shadow-lg">

                <h2 className="text-2xl font-bold text-center mb-5 text-yellow-400">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* NAME */}
                    <input
                        {...register("name", { required: true })}
                        placeholder="Name"
                        className="input input-bordered w-full mb-2 text-black"
                    />
                    {errors.name && (
                        <p className="text-red-400 text-sm mb-2">
                            Name is required
                        </p>
                    )}

                    {/* EMAIL */}
                    <input
                        {...register("email", { required: true })}
                        placeholder="Email"
                        className="input input-bordered w-full mb-2 text-black"
                    />
                    {errors.email && (
                        <p className="text-red-400 text-sm mb-2">
                            Email is required
                        </p>
                    )}

                    {/* PASSWORD */}
                    <div className="relative mb-2">
                        <input
                            {...register("password", {
                                required: true,
                                minLength: 6,
                            })}
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            className="input input-bordered w-full pr-10 text-black"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-3 text-yellow-400"
                        >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-red-400 text-sm mb-2">
                            Password must be at least 6 characters
                        </p>
                    )}

                    {/* SUBMIT */}
                    <button
                        disabled={loading}
                        className="btn btn-warning w-full"
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                </form>

                {/* LOGIN LINK */}
                <p className="text-center mt-3 text-sm">
                    Already have account?{" "}
                    <Link to="/login" className="text-yellow-400">
                        Login
                    </Link>
                </p>

                {/* SOCIAL LOGIN */}
                <SocialLogin />

            </div>
        </div>
    );
};

export default SignUp;