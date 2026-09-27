import { h, Fragment } from "/js/runtime/dom.js";
import { useEffect } from "/js/runtime/dom.js";
import { motion, AnimatePresence } from "/js/runtime/motion.js";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "/js/runtime/icons.js";
import { useCart } from "/js/context/CartContext.js";
import { colorName } from "/js/lib/catalog.js";
import { useRouter } from "/js/runtime/navigation.js";
export default function CartDrawer() {
    const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const router = useRouter();
    // Lock body scroll when cart is open
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        if (isCartOpen) {
            root.style.overflow = "hidden";
            body.style.overflow = "hidden";
            root.style.overscrollBehavior = "none";
            body.style.overscrollBehavior = "none";
        }
        else {
            root.style.overflow = "";
            body.style.overflow = "";
            root.style.overscrollBehavior = "";
            body.style.overscrollBehavior = "";
        }
        return () => {
            root.style.overflow = "";
            body.style.overflow = "";
            root.style.overscrollBehavior = "";
            body.style.overscrollBehavior = "";
        };
    }, [isCartOpen]);
    const handleExplore = () => {
        toggleCart();
        router.push("/shop");
    };
    return (h(AnimatePresence, null, isCartOpen && (h(Fragment, null,
        h(motion.div, { key: "backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, onClick: toggleCart, className: "fixed inset-0 bg-black/40 z-[300]" }),
        h(motion.div, { key: "drawer", initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 28, stiffness: 300 }, className: "fixed top-0 right-0 h-full w-full max-w-[380px] z-[310] flex flex-col bg-white shadow-2xl border-l border-[#E8E8E8] overscroll-behavior-contain" },
            h("div", { className: "flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8] bg-white" },
                h("div", null,
                    h("h2", { className: "text-xs font-bold tracking-[0.25em] uppercase text-[#0B0B0B]", style: { fontFamily: "var(--font-syncopate)" } }, "Your Cart"),
                    h("p", { className: "text-[9px] tracking-widest text-[#9A9A9A] mt-0.5" },
                        cartItems.length,
                        " ",
                        cartItems.length === 1 ? "item" : "items")),
                h("button", { onClick: toggleCart, "aria-label": "Close cart", title: "Close cart", className: "w-8 h-8 flex items-center justify-center border border-[#E8E8E8] hover:border-[#0B0B0B] hover:bg-[#0B0B0B] hover:text-white transition-all duration-200 text-[#0B0B0B]" },
                    h(X, { size: 14 }))),
            h("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-white" }, cartItems.length === 0 ? (h("div", { className: "flex-1 flex flex-col items-center justify-center gap-4 py-12 text-center" },
                h("div", { className: "w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center" },
                    h(ShoppingBag, { size: 20, className: "text-[#9A9A9A]" })),
                h("div", null,
                    h("p", { className: "text-[10px] font-bold tracking-[0.2em] text-[#0B0B0B] uppercase" }, "Cart is empty"),
                    h("p", { className: "text-[9px] text-[#9A9A9A] mt-1" }, "Add some products to begin")),
                h("button", { onClick: toggleCart, className: "mt-2 text-[9px] font-bold tracking-[0.2em] uppercase border-b border-[#A6532A] text-[#A6532A] pb-0.5 hover:text-[#0B0B0B] hover:border-[#0B0B0B] transition-colors" }, "Continue Shopping"))) : (cartItems.map((item) => (h(motion.div, { key: `${item.id}-${item.size}-${item.color}`, layout: true, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, x: 20 }, className: "bg-white border border-[#F0F0F0] rounded-xl p-3 flex gap-4 shadow-sm hover:shadow-md transition-shadow" },
                h("div", { className: "w-20 h-24 bg-[#F8F8F8] rounded-lg overflow-hidden flex-shrink-0 border border-[#F0F0F0]" },
                    h("img", { src: item.image, alt: item.name, className: "w-full h-full object-cover" })),
                h("div", { className: "flex-1 flex flex-col min-w-0" },
                    h("div", { className: "flex justify-between items-start mb-1.5" },
                        h("p", { className: "text-[10px] font-black tracking-tight uppercase text-[#0B0B0B] leading-tight truncate pr-4" }, item.name),
                        h("button", { onClick: () => removeFromCart(item.id, item.size, item.color), "aria-label": `Remove ${item.name} from cart`, title: "Remove item", className: "text-[#9A9A9A] hover:text-red-500 transition-colors p-1" },
                            h(X, { size: 12 }))),
                    h("div", { className: "flex flex-wrap gap-x-3 gap-y-0.5 mb-3" },
                        h("div", { className: "flex items-center gap-1" },
                            h("span", { className: "text-[8px] font-bold text-gray-400 uppercase tracking-widest" }, "Size:"),
                            h("span", { className: "text-[9px] font-black text-[#0B0B0B]" }, item.size)),
                        h("div", { className: "flex items-center gap-1" },
                            h("span", { className: "text-[8px] font-bold text-gray-400 uppercase tracking-widest" }, "Color:"),
                            h("span", { className: "text-[9px] font-black text-[#0B0B0B]" }, colorName(item.color || "")))),
                    h("div", { className: "mt-auto flex items-center justify-between" },
                        h("div", { className: "flex items-center bg-[#F8F8F8] rounded-md border border-[#E8E8E8] h-8 px-0.5" },
                            h("button", { onClick: () => updateQuantity(item.id, item.size, item.color, item.quantity - 1), "aria-label": `Decrease quantity of ${item.name}`, title: "Decrease quantity", className: "w-6 h-6 flex items-center justify-center text-[#0B0B0B] hover:bg-white rounded transition-all shadow-sm active:scale-95 disabled:opacity-30" },
                                h(Minus, { size: 8 })),
                            h("span", { className: "w-6 text-center text-[11px] font-black text-[#0B0B0B]" }, item.quantity),
                            h("button", { onClick: () => updateQuantity(item.id, item.size, item.color, item.quantity + 1), disabled: item.stockLeft !== undefined && item.quantity >= item.stockLeft, "aria-label": `Increase quantity of ${item.name}`, title: "Increase quantity", className: "w-6 h-6 flex items-center justify-center text-[#0B0B0B] hover:bg-white rounded transition-all shadow-sm active:scale-95" },
                                h(Plus, { size: 8 }))),
                        h("p", { className: "text-[13px] font-black text-[#0B0B0B] tracking-tight" },
                            "\u20B9",
                            (item.price * item.quantity).toLocaleString())))))))),
            cartItems.length > 0 && (h("div", { className: "px-6 py-4 border-t border-[#E8E8E8] flex flex-col gap-3 bg-white" },
                h("div", { className: "flex justify-between items-center" },
                    h("span", { className: "text-[11px] font-bold tracking-[0.2em] text-[#9A9A9A] uppercase" }, "Subtotal"),
                    h("span", { className: "text-xl font-black tracking-tight text-[#0B0B0B]" },
                        "\u20B9",
                        cartTotal.toLocaleString())),
                h("p", { className: "text-[9px] text-[#9A9A9A] tracking-wider -mt-1 leading-4" }, "Your collection bag is a demo. No orders or payments are taken."),
                h("button", { onClick: handleExplore, className: "w-full bg-[#0B0B0B] text-white py-4 flex items-center justify-center gap-3 hover:bg-[#A6532A] transition-colors duration-300 group shadow-sm" },
                    h("span", { className: "text-[11px] font-bold tracking-[0.2em] uppercase text-white" }, "Explore more pieces"),
                    h(ArrowRight, { size: 14, className: "group-hover:translate-x-1 transition-transform text-white" })),
                h("button", { onClick: toggleCart, className: "w-full border border-[#DDDDDD] py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[#9A9A9A] hover:text-[#0B0B0B] hover:border-[#0B0B0B] transition-colors" }, "Continue Shopping"))))))));
}
