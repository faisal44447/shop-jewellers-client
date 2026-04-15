import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SignUp = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);

    const onSubmit = (data) => {
        createUser(data.email, data.password)
            .then(() => {
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        const userInfo = {
                            name: data.name,
                            email: data.email
                        };

                        axiosPublic.post('/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId) {
                                    reset();
                                    Swal.fire("Success", "User created successfully", "success");
                                    navigate('/');
                                }
                            });
                    });
            })
            .catch(err => Swal.fire("Error", err.message, "error"));
    };

    return (
        <div className="hero min-h-screen bg-base-200 py-20">
            <div className="card w-full max-w-sm shadow-2xl bg-base-100">
                <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                    <h2 className="text-2xl font-bold text-center">Sign Up</h2>
                    
                    <div className="form-control">
                        <label className="label"><span className="label-text">Name</span></label>
                        <input {...register("name", { required: true })} className="input input-bordered" placeholder="Your Name" />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Photo URL</span></label>
                        <input {...register("photoURL", { required: true })} className="input input-bordered" placeholder="Photo URL" />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input {...register("email", { required: true })} className="input input-bordered" placeholder="Email" />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <div className="relative">
                            <input
                                {...register("password", { required: true, minLength: 6 })}
                                type={showPass ? "text" : "password"}
                                className="input input-bordered w-full"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-3 text-sm text-blue-500"
                            >
                                {showPass ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button className="btn btn-primary mt-4">Sign Up</button>
                    <p className="text-center mt-2">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;