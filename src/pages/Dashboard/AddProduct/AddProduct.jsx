import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddProduct = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(false);

    // ✅ ONLY image upload function
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await axiosPublic.post(image_hosting_api, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (res?.data?.success) {
            return res.data.data.display_url;
        } else {
            throw new Error("Image upload failed");
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // ✅ image validation
            if (!data.image || data.image.length === 0) {
                return Swal.fire("Error", "Image is required", "error");
            }

            // ✅ date + time safe
            const fullDateTime =
                data.date && data.time
                    ? new Date(`${data.date}T${data.time}`)
                    : new Date();

            // ✅ upload image first
            const imageUrl = await uploadImage(data.image[0]);

            // ✅ create product object
            const productData = {
                name: data.name,
                karat: data.karat,
                vori: parseFloat(data.vori) || 0,
                ana: parseFloat(data.ana) || 0,
                rati: parseFloat(data.rati) || 0,
                point: parseFloat(data.point) || 0,
                buyPrice: parseFloat(data.buyPrice) || 0,
                image: imageUrl,
                createdAt: fullDateTime,
            };

            // ✅ send to backend
            const productRes = await axiosSecure.post("/products", productData);

            // ✅ correct success check
            if (productRes?.data?.insertedId || productRes?.data?.acknowledged || productRes?.data?.success) {
                reset();
                Swal.fire("Success", "Product Added Successfully", "success");
            } else {
                throw new Error("Product not added");
            }

        } catch (error) {
            console.error("Add Product Error:", error);
            Swal.fire(
                "Error",
                error?.message || "Failed to add product",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl mt-10 font-bold text-center my-6">
                ➕ Add Product
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <input
                    {...register("name", { required: true })}
                    placeholder="Product Name"
                    className="input input-bordered w-full"
                />

                <input
                    {...register("karat", { required: true })}
                    placeholder="Karat"
                    className="input input-bordered w-full"
                />

                <div className="grid grid-cols-4 gap-2">
                    <input {...register("vori")} placeholder="Vori" className="input input-bordered" />
                    <input {...register("ana")} placeholder="Ana" className="input input-bordered" />
                    <input {...register("rati")} placeholder="Rati" className="input input-bordered" />
                    <input {...register("point")} placeholder="Point" className="input input-bordered" />
                </div>

                <input
                    type="number"
                    {...register("buyPrice", { required: true })}
                    placeholder="Buy Price"
                    className="input input-bordered w-full"
                />

                <div className="flex gap-2">
                    <input type="date" {...register("date")} className="input input-bordered w-full" />
                    <input type="time" {...register("time")} className="input input-bordered w-full" />
                </div>

                <input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: true })}
                    className="file-input file-input-bordered w-full"
                />

                <button
                    disabled={loading}
                    className="btn btn-primary w-full"
                >
                    {loading ? "Uploading..." : "Add Product"}
                    <FaPlus className="ml-2" />
                </button>

            </form>
        </div>
    );
};

export default AddProduct;