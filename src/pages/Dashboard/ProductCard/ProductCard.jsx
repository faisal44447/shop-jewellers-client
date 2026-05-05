import { useContext, useState } from "react";
import { CartContext } from "../../../providers/CartProvider";
import Swal from "sweetalert2";

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const [price, setPrice] = useState("");

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart({
            ...product,
            sellPrice: Number(price || product.buyPrice),
        });

        Swal.fire({
            icon: "success",
            title: "Added to cart",
            timer: 1200,
            showConfirmButton: false,
        });
    };

    return (
        <div className="card bg-base-100 shadow-xl p-4">

            {/* 🔥 SAFE IMAGE FIX */}
            <img
                src={product?.image || "https://via.placeholder.com/300"}
                alt={product?.name}
                className="w-full h-40 object-cover rounded"
            />

            <h2 className="font-bold mt-2">
                {product?.name}
            </h2>

            <p>Buy: ৳{product?.buyPrice}</p>

            <input
                className="input input-bordered w-full my-2"
                placeholder="Sell price"
                onChange={(e) => setPrice(e.target.value)}
            />

            <button onClick={handleAddToCart} className="btn btn-success w-full">
                Add to Cart
            </button>

        </div>
    );
};

export default ProductCard;