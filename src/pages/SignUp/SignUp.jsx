import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useNavigate, Link } from "react-router-dom";
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
                            email: data.email,
                            role: data.email === 'md9897653@gmail.com' ? 'admin' : 'user' 
                        };

                        axiosPublic.post('/users', userInfo)
                            .then(res => {
                                if (res.data.insertedId || res.data.message === 'user already exists') {
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
            <div className="card w-full max-w-sm shadow-2xl bg-base-100 p-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
                    
                    <div className="form-control">
                        <label className="label text-sm font-bold">Name</label>
                        <input {...register("name", { required: true })} className="input input-bordered" placeholder="Your Name" />
                    </div>

                    <div className="form-control mt-2">
                        <label className="label text-sm font-bold">Email</label>
                        <input {...register("email", { required: true })} className="input input-bordered" placeholder="Email" />
                    </div>

                    <div className="form-control mt-2">
                        <label className="label text-sm font-bold">Password</label>
                        <input {...register("password", { required: true, minLength: 6 })} type="password" title="Min 6 chars" className="input input-bordered" placeholder="Password" />
                    </div>

                    <button className="btn btn-primary w-full mt-6">Create Account</button>
                    <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link></p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;