import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { CartContext } from "../../../providers/CartProvider";
import { useContext } from "react";

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleRemove = (id) => {
        removeFromCart(id);
        Swal.fire("Removed!", "Item removed", "success");
    };

    // ✅ Sell single item
    const handleSellItem = async (item) => {
        try {
            const res = await axiosSecure.post("/sell", {
                ...item,
                status: "sold",
                date: new Date(),
            });

            if (res.data.success) {
                removeFromCart(item._id);
                Swal.fire("Success", "Sold successfully", "success");
                navigate("/dashboard/sales");
            }
        } catch (err) {
            Swal.fire("Error", "Sell failed", "error");
        }
    };

    const total = cart.reduce((sum, item) => sum + Number(item.sellPrice || 0), 0);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">🛒 Cart</h2>

            {cart.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {cart.map(item => (
                            <div key={item._id} className="card bg-base-100 shadow-xl">

                                <figure className="px-5 pt-5">
                                    <img
                                        src={item.image || "https://picsum.photos/200"}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                </figure>

                                <div className="card-body text-center">
                                    <h2>{item.name}</h2>

                                    <p className="font-bold">
                                        ৳{item.sellPrice || item.buyPrice || 0}
                                    </p>

                                    <p className="text-green-600 font-bold">
                                        {item.status === "sold" ? "SOLD" : "IN CART"}
                                    </p>

                                    <button
                                        onClick={() => handleSellItem(item)} // ✅ pass single item
                                        className="btn btn-success w-full mt-4"
                                        disabled={item.status === "sold"} // optional: disable if sold
                                    >
                                        ✅ Confirm Sell
                                    </button>

                                    <button
                                        onClick={() => handleRemove(item._id)}
                                        className="btn btn-error w-full mt-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 className="mt-6 btn w-full text-xl font-bold text-center">
                        Total: {total} ৳
                    </h3>
                </>
            )}
        </div>
    );
};

export default Cart;