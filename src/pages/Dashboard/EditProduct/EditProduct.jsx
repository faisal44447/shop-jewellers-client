import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({});

    // ✅ LOAD PRODUCT
    useEffect(() => {
        axiosSecure.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    // ✅ UPDATE
    const handleUpdate = (e) => {
        e.preventDefault();

        axios.patch(`http://localhost:5000/products/${id}`, {
            name: product.name,
            karat: product.karat,

            // 🔥 VORI SYSTEM
            vori: Number(product.vori || 0),
            ana: Number(product.ana || 0),
            rati: Number(product.rati || 0),
            point: Number(product.point || 0),

            buyPrice: Number(product.buyPrice || 0)
        })
            .then(() => {
                alert("✅ Updated Successfully");
                navigate("/products");
            })
            .catch(err => console.log(err));
    };

    return (
        <form onSubmit={handleUpdate} className="p-5 space-y-3">
            <h2 className="text-xl font-bold">✏️ Edit Product</h2>

            <input
                name="name"
                value={product.name || ""}
                onChange={handleChange}
                placeholder="Name"
                className="input input-bordered w-full"
            />

            <input
                name="karat"
                value={product.karat || ""}
                onChange={handleChange}
                placeholder="Karat"
                className="input input-bordered w-full"
            />

            {/* 🔥 VORI SYSTEM */}
            <div className="grid grid-cols-4 gap-2">
                <input name="vori" value={product.vori || ""} onChange={handleChange} placeholder="Vori" className="input input-bordered" />
                <input name="ana" value={product.ana || ""} onChange={handleChange} placeholder="Ana" className="input input-bordered" />
                <input name="rati" value={product.rati || ""} onChange={handleChange} placeholder="Rati" className="input input-bordered" />
                <input name="point" value={product.point || ""} onChange={handleChange} placeholder="Point" className="input input-bordered" />
            </div>

            <input
                name="buyPrice"
                value={product.buyPrice || ""}
                onChange={handleChange}
                placeholder="Buy Price"
                className="input input-bordered w-full"
            />

            <button className="btn btn-warning w-full">
                Update Product
            </button>
        </form>
    );
};

export default EditProduct;