import { useContext, useState } from "react";
import { CartContext } from "../../../providers/CartProvider";
import Swal from "sweetalert2";

const ProductCard = ({ product }) => {
    const { addToCart, cart } = useContext(CartContext);
    const [price, setPrice] = useState("");

    if (!product) return null;

    const handleAddToCart = () => {
        // 🚀 Number কাস্টিং ডাইরেক্টলি করা হয়েছে 
        const finalPrice = price.trim() === "" ? Number(product.buyPrice) : Number(price);

        if (isNaN(finalPrice) || finalPrice <= 0) {
            return Swal.fire("Error", "Please enter a valid price", "error");
        }

        // ডুপ্লিকেট কার্ট আইটেম চেক 
        const alreadyExists = cart?.find((item) => item._id === product._id);
        if (alreadyExists) {
            return Swal.fire("Warning", "Already in cart", "warning");
        }

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
        setPrice(""); // ইনপুট ফিল্ড রিসেট
    };

    return (
        <div className="card bg-base-100 shadow-xl p-4 hover:scale-[1.02] transition duration-200">
            <div className="w-full h-48 bg-white flex items-center justify-center rounded-xl overflow-hidden border border-gray-50">
                <img src={product?.image || "https://via.placeholder.com/300"} alt={product?.name} className="max-h-full max-w-full object-contain" />
            </div>
            <h2 className="font-bold mt-3 text-orange-500 text-lg truncate">
                {product?.name}
            </h2>
            <p className="text-sm text-gray-600 font-medium mt-1">
                Buy Price: ৳{product?.buyPrice}
            </p>
            <div className="mt-3">
                <input
                    type="number"
                    className="input input-bordered w-full text-black bg-gray-50 focus:outline-none focus:border-orange-400"
                    placeholder="Set customized sell price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <button
                onClick={handleAddToCart}
                className="btn btn-success mt-3 w-full text-white bg-emerald-500 hover:bg-emerald-600 border-none"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;