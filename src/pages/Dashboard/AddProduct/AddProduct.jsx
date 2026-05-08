import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";

import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// ================= IMAGE HOSTING =================
const image_hosting_key =
    import.meta.env.VITE_IMAGE_HOSTING_KEY;

const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddProduct = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(false);

    // ================= IMAGE UPLOAD =================
    const uploadImage = async (file) => {

        const formData = new FormData();

        formData.append("image", file);

        const res = await axiosPublic.post(
            image_hosting_api,
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

        if (res?.data?.success) {
            return res.data.data.display_url;
        }

        throw new Error("Image upload failed");
    };

    // ================= SUBMIT =================
    const onSubmit = async (data) => {

        try {

            setLoading(true);

            // ================= IMAGE VALIDATION =================
            if (
                !data.image ||
                data.image.length === 0
            ) {
                return Swal.fire(
                    "Error",
                    "Product image is required",
                    "error"
                );
            }

            // ================= DATE TIME =================
            const fullDateTime =
                data.date && data.time
                    ? new Date(
                        `${data.date}T${data.time}`
                    )
                    : new Date();

            // ================= UPLOAD IMAGE =================
            const imageUrl = await uploadImage(
                data.image[0]
            );

            // ================= PRODUCT DATA =================
            const productData = {
                name: data.name,
                category: data.category,
                karat: data.karat,

                vori:
                    parseFloat(data.vori) || 0,

                ana:
                    parseFloat(data.ana) || 0,

                rati:
                    parseFloat(data.rati) || 0,

                point:
                    parseFloat(data.point) || 0,

                stock:
                    parseInt(data.stock) || 0,

                buyPrice:
                    parseFloat(data.buyPrice) || 0,

                sellPrice:
                    parseFloat(data.sellPrice) || 0,

                image: imageUrl,

                createdAt: fullDateTime,
            };

            // ================= SAVE PRODUCT =================
            const productRes =
                await axiosSecure.post(
                    "/products",
                    productData
                );

            if (
                productRes?.data?.insertedId ||
                productRes?.data?.acknowledged ||
                productRes?.data?.success
            ) {

                reset();

                Swal.fire({
                    icon: "success",
                    title:
                        "Product Added Successfully",
                    timer: 1500,
                    showConfirmButton: false,
                });

            } else {

                throw new Error(
                    "Failed to add product"
                );

            }

        } catch (error) {

            console.error(
                "Add Product Error:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                    error?.message ||
                    "Failed to add product",
            });

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">

                {/* TITLE */}
                <div className="text-center mb-8">

                    <h2 className="text-4xl font-bold text-orange-500">
                        ➕ Add New Product
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Add your jewellery products easily
                    </p>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    {/* PRODUCT NAME */}
                    <div>

                        <label className="font-semibold text-gray-700">
                            Product Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter product name"
                            {...register("name", {
                                required:
                                    "Product name is required",
                            })}
                            className="input input-bordered w-full mt-2 text-black"
                        />

                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}

                    </div>

                    {/* CATEGORY + KARAT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>

                            <label className="font-semibold text-gray-700">
                                Category
                            </label>

                            <input
                                type="text"
                                placeholder="Gold Ring / Necklace"
                                {...register("category")}
                                className="input input-bordered w-full mt-2 text-black"
                            />

                        </div>

                        <div>

                            <label className="font-semibold text-gray-700">
                                Karat
                            </label>

                            <input
                                type="text"
                                placeholder="22K"
                                {...register("karat", {
                                    required:
                                        "Karat is required",
                                })}
                                className="input input-bordered w-full mt-2 text-black"
                            />

                            {errors.karat && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.karat.message}
                                </p>
                            )}

                        </div>

                    </div>

                    {/* WEIGHT */}
                    <div>

                        <label className="font-semibold text-gray-700">
                            Product Weight
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">

                            <input
                                type="number"
                                step="0.01"
                                placeholder="Vori"
                                {...register("vori")}
                                className="input input-bordered"
                            />

                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ana"
                                {...register("ana")}
                                className="input input-bordered"
                            />

                            <input
                                type="number"
                                step="0.01"
                                placeholder="Rati"
                                {...register("rati")}
                                className="input input-bordered"
                            />

                            <input
                                type="number"
                                step="0.01"
                                placeholder="Point"
                                {...register("point")}
                                className="input input-bordered"
                            />

                        </div>

                    </div>

                    {/* PRICE */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        <div>

                            <label className="font-semibold text-gray-700">
                                Buy Price
                            </label>

                            <input
                                type="number"
                                placeholder="৳ Buy Price"
                                {...register("buyPrice", {
                                    required:
                                        "Buy price is required",
                                })}
                                className="input input-bordered w-full mt-2 text-black"
                            />

                        </div>

                        <div>

                            <label className="font-semibold text-gray-700">
                                Stock
                            </label>

                            <input
                                type="number"
                                placeholder="Stock Quantity"
                                {...register("stock")}
                                className="input input-bordered w-full mt-2 text-black"
                            />

                        </div>

                    </div>

                    {/* DATE TIME */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>

                            <label className="font-semibold text-gray-700">
                                Date
                            </label>

                            <input
                                type="date"
                                {...register("date")}
                                className="input input-bordered w-full mt-2 text-black"
                            />

                        </div>

                        <div>

                            <label className="font-semibold text-gray-700">
                                Time
                            </label>

                            <input
                                type="time"
                                {...register("time")}
                                className="input input-bordered w-full mt-2 text-black"
                            />

                        </div>

                    </div>

                    {/* IMAGE */}
                    <div>

                        <label className="font-semibold text-gray-700">
                            Product Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            {...register("image", {
                                required:
                                    "Product image is required",
                            })}
                            className="file-input file-input-bordered w-full mt-2 text-black"
                        />

                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.image.message}
                            </p>
                        )}

                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full text-lg"
                    >

                        {loading
                            ? "Uploading..."
                            : "Add Product"}

                        <FaPlus className="ml-2" />

                    </button>

                </form>

            </div>

        </div>
    );
};

export default AddProduct;