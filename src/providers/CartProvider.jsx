import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // =============================
    // LOAD FROM LOCALSTORAGE
    // =============================
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(stored);
    }, []);

    // =============================
    // SAVE TO LOCALSTORAGE
    // =============================
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // =============================
    // ADD TO CART (WITH QUANTITY)
    // =============================
    const addToCart = (product) => {
        setCart((prev) => {
            const exist = prev.find((p) => p._id === product._id);

            if (exist) {
                return prev.map((p) =>
                    p._id === product._id
                        ? { ...p, quantity: (p.quantity || 1) + 1 }
                        : p
                );
            }

            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // =============================
    // REMOVE ITEM
    // =============================
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item._id !== id));
    };

    // =============================
    // CLEAR CART
    // =============================
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;