import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({
    name: "",
    karat: "",
    vori: 0,
    ana: 0,
    rati: 0,
    point: 0,
    buyPrice: 0,
    sellPrice: 0,
  });

  // ================= LOAD PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosSecure.get(`/products/${id}`);
        const data = res.data || {};

        setProduct({
          name: data.name || "",
          karat: data.karat || "",
          vori: data.vori || 0,
          ana: data.ana || 0,
          rati: data.rati || 0,
          point: data.point || 0,
          buyPrice: data.buyPrice || 0,
          sellPrice: data.sellPrice || 0,
        });
      } catch (error) {
        Swal.fire("Error", "Failed to load product", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, axiosSecure]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "name" || name === "karat"
          ? value
          : Number(value),
    }));
  };

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!product.name || !product.karat) {
      return Swal.fire("Warning", "Name and Karat required", "warning");
    }

    try {
      const res = await axiosSecure.patch(`/products/${id}`, product);

      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Product updated successfully", "success");
        navigate("/dashboard/manage-product");
      } else {
        Swal.fire("Info", "No changes detected", "info");
      }
    } catch (error) {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <p className="text-center mt-10 text-lg">
        Loading product...
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-5 text-center">
        ✏️ Edit Product
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="input input-bordered w-full"
          required
        />

        <input
          name="karat"
          value={product.karat}
          onChange={handleChange}
          placeholder="Karat"
          className="input input-bordered w-full"
          required
        />

        {/* WEIGHT */}
        <div className="grid grid-cols-4 gap-2">
          <input name="vori" value={product.vori} onChange={handleChange} placeholder="Vori" className="input input-bordered" />
          <input name="ana" value={product.ana} onChange={handleChange} placeholder="Ana" className="input input-bordered" />
          <input name="rati" value={product.rati} onChange={handleChange} placeholder="Rati" className="input input-bordered" />
          <input name="point" value={product.point} onChange={handleChange} placeholder="Point" className="input input-bordered" />
        </div>

        <input
          name="buyPrice"
          value={product.buyPrice}
          onChange={handleChange}
          placeholder="Buy Price"
          type="number"
          className="input input-bordered w-full"
        />

        <input
          name="sellPrice"
          value={product.sellPrice}
          onChange={handleChange}
          placeholder="Sell Price"
          type="number"
          className="input input-bordered w-full"
        />

        <button className="btn btn-warning w-full">
          Update Product
        </button>

      </form>
    </div>
  );
};

export default EditProduct;