import { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { CartContext } from "../../../providers/CartProvider";

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);
    const axiosSecure = useAxiosSecure();

    const [localCart, setLocalCart] = useState([]);
    const [editPrice, setEditPrice] = useState({});

    useEffect(() => {
        setLocalCart(cart || []);
    }, [cart]);

    // ================= QTY =================
    const updateQty = (id, type) => {
        const updated = localCart.map((item) => {
            if (item._id === id) {
                const qty = Number(item.quantity || 1);

                return {
                    ...item,
                    quantity: type === "inc" ? qty + 1 : Math.max(1, qty - 1),
                };
            }
            return item;
        });

        setLocalCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    // ================= SELL =================
    const handleSellItem = async (item) => {
        const qty = Number(item.quantity || 1);

        const price = Number(
            editPrice[item._id] || item.sellPrice || item.buyPrice || 0
        );

        if (price <= 0) {
            return Swal.fire("Error", "Invalid price", "error");
        }

        try {
            const payload = {
                productId: item.productId || item._id,
                quantity: qty,
                sellPrice: price,
            };

            const res = await axiosSecure.post("/sales", payload);

            if (res.data?.success) {
                removeFromCart(item._id);

                Swal.fire({
                    icon: "success",
                    title: "Sold successfully",
                    timer: 1200,
                    showConfirmButton: false,
                });

                // update local UI instantly
                setLocalCart((prev) =>
                    prev.filter((p) => p._id !== item._id)
                );
            }
        } catch (err) {
            Swal.fire(
                "Error",
                err?.response?.data?.message || "Sale failed",
                "error"
            );
        }
    };

    // ================= TOTAL =================
    const total = localCart.reduce((sum, item) => {
        const price = Number(item.sellPrice || item.buyPrice || 0);
        const qty = Number(item.quantity || 1);
        return sum + price * qty;
    }, 0);

    // ================= EMPTY STATE =================
    if (localCart.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500">
                🛒 Cart is empty
            </div>
        );
    }

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6 text-center">
                🛒 Cart ({localCart.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {localCart.map((item) => (
                    <div key={item._id} className="card shadow p-4 text-black">

                        <img
                            src={item.image}
                            className="h-32 w-full object-cover rounded"
                            alt={item.name}
                        />

                        <h2 className="font-bold mt-2 text-orange-500">
                            {item.name}
                        </h2>

                        {/* QTY */}
                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={() => updateQty(item._id, "dec")}
                                className="btn btn-xs"
                            >
                                -
                            </button>

                            <span>{item.quantity || 1}</span>

                            <button
                                onClick={() => updateQty(item._id, "inc")}
                                className="btn btn-xs"
                            >
                                +
                            </button>
                        </div>

                        {/* PRICE */}
                        <input
                            type="number"
                            className="border w-full mt-2 p-2 rounded text-black"
                            defaultValue={
                                item.sellPrice || item.buyPrice
                            }
                            onChange={(e) =>
                                setEditPrice({
                                    ...editPrice,
                                    [item._id]: Number(e.target.value),
                                })
                            }
                        />

                        {/* SELL */}
                        <button
                            onClick={() => handleSellItem(item)}
                            className="btn btn-success w-full mt-4"
                        >
                            Sell
                        </button>

                        {/* REMOVE */}
                        <button
                            onClick={() => {
                                removeFromCart(item._id);
                                setLocalCart((prev) =>
                                    prev.filter((p) => p._id !== item._id)
                                );
                            }}
                            className="btn btn-error w-full mt-2"
                        >
                            Remove
                        </button>

                    </div>
                ))}

            </div>

            {/* TOTAL */}
            <h3 className="text-center mt-6 text-xl font-bold">
                Total: ৳ {total}
            </h3>

        </div>
    );
};

export default Cart;