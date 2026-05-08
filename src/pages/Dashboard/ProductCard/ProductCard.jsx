import { useContext, useState } from "react";
import { CartContext } from "../../../providers/CartProvider";
import Swal from "sweetalert2";

const ProductCard = ({ product }) => {
    const { addToCart, cart } = useContext(CartContext);
    const [price, setPrice] = useState("");

    if (!product) return null;

    const handleAddToCart = () => {

        const finalPrice = Number(price || product.buyPrice);

        // ================= VALIDATION =================
        if (finalPrice <= 0) {
            return Swal.fire("Error", "Invalid price", "error");
        }

        // ================= DUPLICATE CHECK =================
        const alreadyExists = cart?.find(
            (item) => item._id === product._id
        );

        if (alreadyExists) {
            return Swal.fire("Warning", "Already in cart", "warning");
        }

        // ================= ADD =================
        addToCart({
            ...product,
            sellPrice: finalPrice,
        });

        Swal.fire({
            icon: "success",
            title: "Added to cart",
            timer: 1200,
            showConfirmButton: false,
        });
    };

    return (
        <div className="card bg-base-100 shadow-xl p-4 hover:scale-[1.02] transition">

            {/* IMAGE */}
            <div className="w-full h-48 bg-white flex items-center justify-center rounded overflow-hidden">
                <img
                    src={product?.image || "https://via.placeholder.com/300"}
                    alt={product?.name}
                    className="max-h-full max-w-full object-contain"
                />
            </div>

            {/* NAME */}
            <h2 className="font-bold mt-2 text-orange-500">
                {product?.name}
            </h2>

            {/* BUY PRICE */}
            <p className="text-sm text-gray-600">
                Buy: ৳{product?.buyPrice}
            </p>

            {/* SELL PRICE INPUT */}
            <input
                type="number"
                className="input input-bordered w-full my-2 text-black"
                placeholder="Sell price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            {/* BUTTON */}
            <button
                onClick={handleAddToCart}
                className="btn btn-success w-full"
            >
                Add to Cart
            </button>

        </div>
    );
};

export default ProductCard;