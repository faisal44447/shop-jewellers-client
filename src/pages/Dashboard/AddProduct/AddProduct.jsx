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

    const onSubmit = async (data) => {
        try {
            // ✅ combine date + time
            const fullDateTime = new Date(`${data.date}T${data.time}`);

            // 🔥 Image Upload using FormData
            const formData = new FormData();
            formData.append("image", data.image[0]);

            const res = await axiosPublic.post(image_hosting_api, formData);

            if (res.data.success) {
                // Prepare product data
                const productData = {
                    name: data.name,
                    karat: data.karat,
                    vori: Number(data.vori || 0),
                    ana: Number(data.ana || 0),
                    rati: Number(data.rati || 0),
                    point: Number(data.point || 0),
                    buyPrice: Number(data.buyPrice || 0),
                    image: res.data.data.display_url,
                    createdAt: fullDateTime // ✅ use frontend date + time
                };

                // Send to backend
                const productRes = await axiosSecure.post("/products", productData);

                if (productRes.data.success) {
                    reset();
                    Swal.fire({
                        icon: "success",
                        title: "✅ Product Added!",
                        text: `${data.name} successfully added`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } else {
                throw new Error("Image upload failed");
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "❌ Error",
                text: "Failed to add product"
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl mt-10 font-bold text-center my-6">➕ Add Product</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Name */}
                <input
                    {...register("name", { required: true })}
                    placeholder="Product Name"
                    className="input input-bordered w-full"
                />

                {/* Karat */}
                <input
                    {...register("karat", { required: true })}
                    placeholder="Karat (e.g. 22k)"
                    className="input input-bordered w-full"
                />

                {/* VORI, ANA, RATI, POINT */}
                <div className="grid grid-cols-4 gap-2">
                    <input {...register("vori")} placeholder="Vori" className="input input-bordered" />
                    <input {...register("ana")} placeholder="Ana" className="input input-bordered" />
                    <input {...register("rati")} placeholder="Rati" className="input input-bordered" />
                    <input {...register("point")} placeholder="Point" className="input input-bordered" />
                </div>

                {/* Buy Price */}
                <input
                    type="number"
                    {...register("buyPrice", { required: true })}
                    placeholder="Buy Price"
                    className="input input-bordered w-full"
                />

                {/* Date + Time */}
                <div className="flex justify-between">
                    <input
                        type="date"
                        {...register("date", { required: true })}
                        className="input input-bordered w-full"
                    />
                    <input
                        type="time"
                        {...register("time", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Image */}
                <input
                    type="file"
                    {...register("image", { required: true })}
                    className="file-input file-input-bordered w-full"
                />

                <button className="btn btn-primary w-full">
                    Add Product <FaPlus className="ml-2" />
                </button>

            </form>
        </div>
    );
};

export default AddProduct;