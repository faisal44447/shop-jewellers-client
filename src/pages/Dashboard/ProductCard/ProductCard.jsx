import { useState, useContext } from "react";
import Swal from "sweetalert2";
import { CartContext } from '../../../providers/CartProvider';

const ProductCard = ({ product }) => {
    const [price, setPrice] = useState("");
    const { addToCart } = useContext(CartContext);

    // ✅ FIX
    if (!product) return null;

    const handleAddToCart = () => {

        addToCart({
            ...product,
            sellPrice: Number(price || product.buyPrice)
        });

        // 🔥 SWEET ALERT
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${product.name} added to cart`,
            showConfirmButton: false,
            timer: 1500
        });
    };

    return (
        <div className="card mt-10 bg-base-100 w-80 shadow-xl">

            {/* IMAGE */}
            <figure>
                <img
                    src={product?.image || "https://picsum.photos/300"}
                    alt={product?.name}
                    className="h-48 w-full object-contain rounded"
                />
            </figure>

            {/* BODY */}
            <div className="card-body">

                {/* TITLE */}
                <h2 className="card-title">
                    {product?.name}
                    <div className="badge badge-secondary">BUY</div>
                </h2>





                <div className="flex justify-between">
                    <p>
                        {product.vori}ভরি {product.ana}আনা {product.rati}রতি {product.point}পয়েন্ট
                    </p>
                </div>

                {/* PRICE */}
                <div className="flex justify-between">
                    <p>Buy: ৳{product?.buyPrice}</p>
                    <p className="text-yellow-400">{product.karat} ক্যারেট</p>
                </div>

                {/* INPUT */}
                <input
                    placeholder="Sell Price"
                    onChange={(e) => setPrice(e.target.value)}
                    className="input input-bordered"
                />

                {/* BUTTON */}
                <div className="card-actions justify-end">
                    <button
                        onClick={handleAddToCart}
                        className="btn btn-success w-full"
                    >
                        Sell to Product
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductCard;