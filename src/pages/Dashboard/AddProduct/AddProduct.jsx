import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddProduct = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imgRes = await axiosPublic.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`,
        formData
      );

      const product = {
        name: data.name,
        karat: data.karat,
        vori: Number(data.vori || 0),
        ana: Number(data.ana || 0),
        rati: Number(data.rati || 0),
        point: Number(data.point || 0),
        buyPrice: Number(data.buyPrice || 0),
        image: imgRes.data.data.display_url,
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/products", product);

      if (res.data.success) {
        Swal.fire("Success", "Product added", "success");
        reset();
      }
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Failed to add product", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input {...register("name")} placeholder="Name" className="input" />
      <input {...register("karat")} placeholder="Karat" className="input" />
      <input type="file" {...register("image")} className="file-input" />

      <button className="btn btn-primary w-full">Add Product</button>
    </form>
  );
};

export default AddProduct;