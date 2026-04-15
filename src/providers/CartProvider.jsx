import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([]);

    // ✅ Load from localStorage (first time)
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    // ✅ Save to localStorage (every change)
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // ✅ ADD TO CART
    const addToCart = (product) => {
        const newItem = {
            ...product,
            status: "cart"   // 🔥 IMPORTANT
        };
        setCart(prev => [...prev, newItem]);
    };

    // ✅ REMOVE
    const removeFromCart = (id) => {
        const updatedCart = cart.filter(item => item._id !== id);
        setCart(updatedCart);
    };

    // ✅ CLEAR CART (তোমার আগের code থেকে add করলাম)
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart   // 🔥 add করা হয়েছে
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;