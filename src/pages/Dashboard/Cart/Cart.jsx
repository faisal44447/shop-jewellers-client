import { useContext, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { CartContext } from "../../../providers/CartProvider";

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);
    const axiosSecure = useAxiosSecure();

    const [editPrice, setEditPrice] = useState({});

    // ➕ SELL ITEM
    const handleSellItem = async (item) => {
        try {
            const payload = {
                productId: item._id,   // ✅ IMPORTANT FIX
                quantity: Number(item.quantity || 1),
                sellPrice: Number(
                    editPrice[item._id] || item.sellPrice || item.buyPrice
                ),
            };

            console.log("SELL PAYLOAD:", payload);

            const res = await axiosSecure.post("/sell", payload);

            if (res.data.success) {
                removeFromCart(item._id);
                Swal.fire("Success", "Sold successfully", "success");
            }
        } catch (err) {
            console.log("SELL ERROR:", err.response?.data);
            Swal.fire(
                "Error",
                err.response?.data?.message || "Sell failed",
                "error"
            );
        }
    };

    // ➕ INCREASE QTY
    const increaseQty = (id) => {
        const updated = cart.map(item =>
            item._id === id
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        window.location.reload();
    };

    // ➖ DECREASE QTY
    const decreaseQty = (id) => {
        const updated = cart.map(item =>
            item._id === id
                ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
                : item
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        window.location.reload();
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">🛒 Cart</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {cart.map(item => (
                    <div key={item._id} className="card bg-base-100 shadow-xl p-4">

                        <img src={item.image} className="h-32 object-cover rounded" />

                        <h2 className="font-bold">{item.name}</h2>

                        {/* 🔥 QUANTITY CONTROL */}
                        <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => decreaseQty(item._id)} className="btn btn-xs">-</button>
                            <span>{item.quantity || 1}</span>
                            <button onClick={() => increaseQty(item._id)} className="btn btn-xs">+</button>
                        </div>

                        {/* 💰 PRICE EDIT */}
                        <input
                            type="number"
                            placeholder="Sell Price"
                            className="input input-bordered w-full mt-2"
                            defaultValue={item.sellPrice || item.buyPrice}
                            onChange={(e) =>
                                setEditPrice({
                                    ...editPrice,
                                    [item._id]: e.target.value,
                                })
                            }
                        />

                        <button
                            onClick={() => handleSellItem(item)}
                            className="btn btn-success w-full mt-2"
                        >
                            Sell
                        </button>

                        <button
                            onClick={() => removeFromCart(item._id)}
                            className="btn btn-error w-full mt-2"
                        >
                            Remove
                        </button>

                    </div>
                ))}

            </div>
        </div>
    );
};

export default Cart;