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
        setLocalCart(cart);
    }, [cart]);

    // ================= QTY =================
    const updateQty = (id, type) => {
        const updated = localCart.map((item) => {
            if (item._id === id) {
                const qty = item.quantity || 1;
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
            editPrice[item._id] ?? item.sellPrice ?? item.buyPrice
        );

        if (!price || price <= 0) {
            return Swal.fire("Error", "Invalid price", "error");
        }

        try {
            const payload = {
                productId: item.productId || item._id,
                quantity: qty,
                sellPrice: price,
            };

            const res = await axiosSecure.post("/sales", payload);

            if (res.data.success) {
                removeFromCart(item._id);
                Swal.fire("Success", "Sold successfully", "success");
            }
        } catch (err) {
            console.log(err.response?.data);

            Swal.fire(
                "Error",
                err.response?.data?.message || "Sale failed",
                "error"
            );
        }
    };

    // ================= TOTAL =================
    const total = localCart.reduce(
        (sum, item) =>
            sum +
            Number(item.sellPrice || item.buyPrice || 0) *
            (item.quantity || 1),
        0
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
                🛒 Cart ({localCart.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {localCart.map((item) => (
                    <div key={item._id} className="card shadow p-4">
                        <img src={item.image} className="h-32 object-cover" />

                        <h2 className="font-bold mt-2">{item.name}</h2>

                        {/* QTY */}
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => updateQty(item._id, "dec")}>-</button>
                            <span>{item.quantity || 1}</span>
                            <button onClick={() => updateQty(item._id, "inc")}>+</button>
                        </div>

                        {/* PRICE */}
                        <input
                            type="number"
                            className="border w-full mt-2"
                            defaultValue={item.sellPrice || item.buyPrice}
                            onChange={(e) =>
                                setEditPrice({
                                    ...editPrice,
                                    [item._id]: e.target.value,
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
                            onClick={() => removeFromCart(item._id)}
                            className="btn btn-error w-full mt-2"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <h3 className="text-center mt-6 text-xl">
                Total: ৳{total}
            </h3>
        </div>
    );
};

export default Cart;