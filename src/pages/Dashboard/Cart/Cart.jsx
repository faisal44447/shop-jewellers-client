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

        // 🚀 ফিক্স: ইনপুট চেঞ্জ না করলেও যাতে সঠিক প্রাইস অ্যাসাইন হয়
        const price = Number(
            editPrice[item._id] !== undefined ? editPrice[item._id] : (item.sellPrice || item.buyPrice || 0)
        );

        if (price <= 0 || isNaN(price)) {
            return Swal.fire("Error", "Please enter a valid selling price", "error");
        }

        try {
            // ১. প্রথমে সেলস কালেকশনে ডাটা সেভ করা হচ্ছে
            const payload = {
                productId: item.productId || item._id,
                name: item.name,
                quantity: qty,
                sellPrice: price,
                totalAmount: price * qty,
                customerEmail: item.email || "",
                soldAt: new Date()
            };

            const res = await axiosSecure.post("/sales", payload);

            // আপনার ব্যাকএন্ড রেসপন্স স্ট্রাকচার অনুযায়ী res.data অথবা res.data.success চেক করুন
            if (res.data?.success || res.data?.insertedId) {

                // 🚀 ফিক্স: সেল হওয়ার পর ডাটাবেজের 'carts' কালেকশন থেকে আইটেমটি মুছে ফেলা
                try {
                    await axiosSecure.delete(`/carts/${item._id}`);
                } catch (dbErr) {
                    console.error("Failed to sync cart removal from DB:", dbErr);
                    // ডাটাবেজে কার্ট ডিলিট ফেইল করলেও ইউজার এক্সপেরিয়েন্সের জন্য আমরা ফ্রন্টএন্ড এগিয়ে নিব
                }

                // ২. লোকাল এবং গ্লোবাল স্টেট ক্লিয়ার করা
                removeFromCart(item._id);
                setLocalCart((prev) => prev.filter((p) => p._id !== item._id));

                Swal.fire({
                    icon: "success",
                    title: "Product Sold Successfully!",
                    timer: 1200,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire(
                "Error",
                err?.response?.data?.message || "Sale transaction failed",
                "error"
            );
        }
    };

    // ================= TOTAL ================= 
    const total = localCart.reduce((sum, item) => {
        const price = Number(editPrice[item._id] !== undefined ? editPrice[item._id] : (item.sellPrice || item.buyPrice || 0));
        const qty = Number(item.quantity || 1);
        return sum + price * qty;
    }, 0);

    // ================= EMPTY STATE ================= 
    if (localCart.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500 font-medium">
                🛒 Your cart is currently empty
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">
                🛒 Invoice / Cart (Item: {localCart.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {localCart.map((item) => {
                    const currentPrice = editPrice[item._id] !== undefined ? editPrice[item._id] : (item.sellPrice || item.buyPrice || "");
                    return (
                        <div key={item._id} className="card bg-white border border-gray-200 shadow p-4 text-black rounded-2xl">
                            <div className="w-full h-32 bg-gray-50 flex items-center justify-center rounded overflow-hidden">
                                <img src={item.image || "https://via.placeholder.com/150"} className="max-h-full max-w-full object-contain" alt={item.name} />
                            </div>
                            <h2 className="font-bold mt-2 text-orange-500 text-md truncate">
                                {item.name}
                            </h2>

                            {/* QTY CONTROLLER */}
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-gray-600 text-sm font-medium">Qty:</span>
                                <button onClick={() => updateQty(item._id, "dec")} className="btn btn-xs bg-gray-200 border-none text-black hover:bg-gray-300" > - </button>
                                <span className="font-bold text-sm w-4 text-center">{item.quantity || 1}</span>
                                <button onClick={() => updateQty(item._id, "inc")} className="btn btn-xs bg-gray-200 border-none text-black hover:bg-gray-300" > + </button>
                            </div>

                            {/* CUSTOM SELL PRICE INPUT */}
                            <div className="mt-2">
                                <label className="text-xs text-gray-500 font-semibold">Final Sale Price (৳)</label>
                                <input
                                    type="number"
                                    className="border w-full p-2 rounded text-black bg-gray-50 focus:outline-none focus:border-orange-400 mt-0.5"
                                    value={currentPrice}
                                    placeholder="Set price"
                                    onChange={(e) => setEditPrice({ ...editPrice, [item._id]: Number(e.target.value) })}
                                />
                            </div>

                            {/* ACTION BUTTONS */}
                            <button onClick={() => handleSellItem(item)} className="btn btn-success text-white w-full mt-4 bg-emerald-500 hover:bg-emerald-600 border-none" >
                                Confirm Sell
                            </button>
                            <button
                                onClick={async () => {
                                    // 🚀 ফিক্স: ডিলিট বাটনে ক্লিক করলে ডাটাবেজ থেকেও কার্ট রিমুভ রিকোয়েস্ট যাবে
                                    try {
                                        await axiosSecure.delete(`/carts/${item._id}`);
                                    } catch (e) { console.log(e); }
                                    removeFromCart(item._id);
                                    setLocalCart((prev) => prev.filter((p) => p._id !== item._id));
                                }}
                                className="btn btn-error btn-outline btn-sm w-full mt-2"
                            >
                                Remove
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* TOTAL BILL */}
            <div className="mt-8 p-4 bg-orange-50 max-w-md mx-auto rounded-xl border border-orange-200 text-center">
                <h3 className="text-xl font-bold text-black">
                    Total Payable: <span className="text-green-600">৳ {total.toLocaleString("en-BD")}</span>
                </h3>
            </div>
        </div>
    );
};

export default Cart;