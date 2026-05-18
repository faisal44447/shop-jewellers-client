import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import SocialLogin from "../../components/SocialLogin/SocialLogin";

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile, setLoading } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLocalLoading(true);
            // ১. ফায়ারবেসে ইউজার তৈরি
            await createUser(data.email, data.password);
            // ২. প্রোফাইল আপডেট
            await updateUserProfile(data.name, "");
            // ৩. ডাটাবেজে ইউজার রোলসহ সেভ করা
            const dbRes = await axiosPublic.post("/users", {
                name: data.name,
                email: data.email,
                role: "user",
            });

            if (dbRes.data.insertedId || dbRes.data.message === "User already exists") {
                Swal.fire({
                    icon: "success",
                    title: "Account Created Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.message, "error");
            setLoading(false);
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="card w-full max-w-md p-5 bg-black/70 border border-yellow-500/30 text-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-5 text-yellow-400">Create Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* NAME */}
                    <div>
                        <input {...register("name", { required: true })} placeholder="Name" className="input input-bordered w-full bg-black/40 border-yellow-500 text-white" />
                        {errors.name && <p className="text-red-400 text-sm mt-1">Name is required</p>}
                    </div>
                    {/* EMAIL */}
                    <div>
                        <input {...register("email", { required: true })} type="email" placeholder="Email" className="input input-bordered w-full bg-black/40 border-yellow-500 text-white" />
                        {errors.email && <p className="text-red-400 text-sm mt-1">Email is required</p>}
                    </div>
                    {/* PASSWORD */}
                    <div className="relative">
                        <input {...register("password", { required: true, minLength: 6 })} type={showPass ? "text" : "password"} placeholder="Password" className="input input-bordered w-full bg-black/40 border-yellow-500 text-white pr-10" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-yellow-400">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {errors.password && <p className="text-red-400 text-sm mt-1">Password must be at least 6 characters</p>}
                    </div>
                    {/* SUBMIT BTN */}
                    <button type="submit" disabled={localLoading} className="btn w-full bg-gradient-to-r from-yellow-400 to-orange-500 border-none text-black font-bold">
                        {localLoading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
                <p className="text-sm mt-3 text-center text-gray-300">
                    Already have an account? <Link to="/login" className="text-yellow-400 font-bold hover:underline">Login</Link>
                </p>
                <div className="divider before:bg-gray-700 after:bg-gray-700 text-gray-400 text-xs">OR</div>
                <SocialLogin />
            </div>
        </div>
    );
};

export default SignUp;