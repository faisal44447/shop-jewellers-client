import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [product, setProduct] = useState({
    name: "",
    karat: "",
    vori: "",
    ana: "",
    rati: "",
    point: "",
    buyPrice: "",
    sellPrice: ""
  });

  // ✅ LOAD PRODUCT
  useEffect(() => {
    axiosSecure.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
      })
      .catch(() => {
        Swal.fire("❌ Error", "Failed to load product", "error");
      });
  }, [id, axiosSecure]);

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  // ✅ UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!product.name || !product.karat || !product.buyPrice) {
      Swal.fire("⚠️ সব field fill করো");
      return;
    }

    const updatedData = {
      name: product.name,
      karat: product.karat,
      vori: Number(product.vori || 0),
      ana: Number(product.ana || 0),
      rati: Number(product.rati || 0),
      point: Number(product.point || 0),
      buyPrice: Number(product.buyPrice || 0),
      sellPrice: Number(product.sellPrice || 0),
    };

    try {
      const res = await axiosSecure.patch(`/products/${id}`, updatedData);

      if (res.data.modifiedCount > 0) {
        Swal.fire("✅ Updated!", "Product updated successfully", "success");
        navigate("/dashboard/manage-product");
      } else {
        Swal.fire("⚠️ No changes detected");
      }

    } catch (err) {
      Swal.fire("❌ Error", "Update failed", "error");
    }
  };

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
        />

        <input
          name="karat"
          value={product.karat}
          onChange={handleChange}
          placeholder="Karat"
          className="input input-bordered w-full"
        />

        {/* 🔥 VORI SYSTEM */}
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