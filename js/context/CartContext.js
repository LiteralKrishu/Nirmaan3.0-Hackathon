import { h, Fragment } from "/js/runtime/dom.js";
import { createContext, useContext, useEffect, useState } from "/js/runtime/dom.js";
import toast from "/js/runtime/toast.js";
const CartContext = createContext(undefined);

export const getCartKey = (item) => item.variantId || `${item.id}|${item.size}|${item.color}`;
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const addToCart = (newItem) => {
        let message = `${newItem.name} added to cart`;
        setCartItems((prev) => {
            const nextItem = { ...newItem, quantity: Math.max(1, Number(newItem.quantity || 1)) };
            const existingItemIndex = prev.findIndex((item) => getCartKey(item) === getCartKey(nextItem));
            if (existingItemIndex >= 0) {
                const existing = prev[existingItemIndex];
                const maxQuantity = existing.stockLeft && existing.stockLeft > 0 ? existing.stockLeft : 99;
                const nextQuantity = Math.min(existing.quantity + nextItem.quantity, maxQuantity);
                message = `${newItem.name} quantity updated`;
                return prev.map((item, idx) => idx === existingItemIndex ? { ...item, quantity: nextQuantity } : item);
            }
            return [...prev, nextItem];
        });
        window.setTimeout(() => toast.success(message), 0);
        // Removed setIsCartOpen(true) to allow seamless browsing
    };
    const removeFromCart = (id, size, color) => {
        let message = null;
        setCartItems((prev) => {
            const itemToRemove = prev.find((item) => item.id === id && item.size === size && item.color === color);
            if (itemToRemove) {
                message = `${itemToRemove.name} removed from cart`;
            }
            return prev.filter((item) => !(item.id === id && item.size === size && item.color === color));
        });
        if (message)
            window.setTimeout(() => toast.success(message), 0);
    };
    const updateQuantity = (id, size, color, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id, size, color);
            return;
        }
        setCartItems((prev) => prev.map((item) => {
            if (!(item.id === id && item.size === size && item.color === color))
                return item;
            const maxQuantity = item.stockLeft && item.stockLeft > 0 ? item.stockLeft : 99;
            return { ...item, quantity: Math.min(quantity, maxQuantity) };
        }));
    };
    const toggleCart = () => setIsCartOpen((prev) => !prev);
    const clearCart = () => setCartItems([]);
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return (h(CartContext.Provider, { value: {
            cartItems,
            isCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleCart,
            clearCart,
            cartTotal,
        } }, children));
}
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
