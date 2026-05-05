import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const SignUp = () => {
    const { register, handleSubmit, reset } = useForm();
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await createUser(data.email, data.password);

            await updateUserProfile(data.name, "");

            // save user
            await axiosPublic.post("/users", {
                name: data.name,
                email: data.email,
                role: data.email === "md9897653@gmail.com" ? "admin" : "user",
            });

            // JWT TOKEN
            const tokenRes = await axiosPublic.post("/jwt", {
                email: data.email,
            });

            localStorage.setItem("access-token", tokenRes.data.token);

            Swal.fire("Success", "User created", "success");
            navigate("/");

        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div className="hero min-h-screen pt-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 -mt-20 py-10">

            <div className="card w-full max-w-sm p-[2px] rounded-2xl 
            bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 
            shadow-[0_20px_60px_rgba(255,215,0,0.25)]">

                <form onSubmit={handleSubmit(onSubmit)}
                    className="card-body rounded-2xl bg-black/70 backdrop-blur-xl text-white">

                    <h2 className="text-3xl font-bold text-center text-yellow-400 tracking-wide">
                        Create Account
                    </h2>

                    {/* Name */}
                    <input
                        {...register("name", { required: true })}
                        placeholder="Full Name"
                        className="input input-bordered bg-black/40 border-yellow-500 
                    focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400 mt-4"
                    />

                    {/* Email */}
                    <input
                        {...register("email", { required: true })}
                        placeholder="Email"
                        className="input input-bordered bg-black/40 border-yellow-500 
                    focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400 mt-2"
                    />

                    {/* Password */}
                    <div className="relative mt-2">
                        <input
                            {...register("password", { required: true, minLength: 6 })}
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            className="input input-bordered w-full bg-black/40 border-yellow-500 text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-3 text-yellow-400 text-sm"
                        >
                            {showPass ? "Hide" : "Show"}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-red-400 text-sm mt-1">
                            Password must be at least 6 characters
                        </p>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        className="btn mt-5 bg-gradient-to-r from-yellow-400 to-orange-500 
                    border-none text-black font-bold shadow-lg 
                    hover:scale-105 hover:shadow-yellow-500/50 transition-all duration-300"
                    >
                        Create Account
                    </button>

                    {/* Login link */}
                    <p className="text-sm mt-3 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-yellow-400 font-bold hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );

};

export default SignUp;