import { products } from "/js/data/products.js";
import { h, Fragment } from "/js/runtime/dom.js";
import { useState, useEffect, use } from "/js/runtime/dom.js";
import { motion, AnimatePresence } from "/js/runtime/motion.js";
import { Search, ArrowRight, Loader2 } from "/js/runtime/icons.js";
import Link from "/js/runtime/navigation.js";
import { useCart } from "/js/context/CartContext.js";
import { useWishlist } from "/js/context/WishlistContext.js";
import { Heart } from "/js/runtime/icons.js";
import toast from "/js/runtime/toast.js";
import { normalizeProducts, findVariant } from "/js/lib/catalog.js";
export default function SearchPage({ searchParams }) {
    const { q } = use(searchParams);
    const [query, setQuery] = useState(q ?? "");
    const allProducts = products;
    const isFetching = false;
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const preferredSize = "M";
    useEffect(() => {
        if (q)
            setQuery(q);
    }, [q]);
    const results = allProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory.replace("-", " ").toLowerCase().includes(query.toLowerCase()));
    return (h("div", { className: "flex-1 w-full min-h-screen" },
        h(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut" }, className: "w-full bg-[#0B0B0B] text-white pt-24 pb-20 px-6 md:px-12 relative overflow-hidden" },
            h("div", { className: "absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#A6532A]/10 rounded-full blur-[120px] pointer-events-none" }),
            h("div", { className: "w-full max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center" },
                h("p", { className: "text-[9px] font-bold tracking-[0.35em] text-[#A6532A] uppercase mb-4" }, "Search Results"),
                h("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter text-white mb-10 uppercase", style: { fontFamily: "var(--font-syncopate)" } }, query ? `"${query}"` : "FIND YOUR FIT"),
                h("form", { onSubmit: (e) => e.preventDefault(), className: "flex items-center gap-3 w-full max-w-2xl" },
                    h("div", { className: "flex-1 flex items-center gap-4 bg-white/5 border border-white/10 rounded-[32px] px-6 py-4 focus-within:border-white/30 focus-within:bg-white/10 transition-all shadow-2xl backdrop-blur-md" },
                        h(Search, { size: 20, className: "text-[#9A9A9A] shrink-0" }),
                        h("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search products, collections, categories...", className: "flex-1 min-w-0 bg-transparent outline-none text-sm font-medium text-white placeholder:text-[#9A9A9A]" }))))),
        h("div", { className: "w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12" }, isFetching ? (h("div", { className: "flex justify-center py-20" },
            h(Loader2, { size: 32, className: "text-[#A6532A] animate-spin" }))) : query === "" ? (h("div", { className: "text-center py-20" },
            h("p", { className: "text-xs font-bold tracking-[0.3em] text-[#9A9A9A] uppercase" }, "Type something to search"))) : results.length === 0 ? (h(motion.div, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, className: "text-center py-20 flex flex-col items-center gap-4" },
            h("p", { className: "text-sm font-bold tracking-widest text-[#0B0B0B] uppercase" },
                "No results for \u201C",
                query,
                "\u201D"),
            h("p", { className: "text-xs text-[#9A9A9A]" }, "Try a different keyword or browse our collections."),
            h(Link, { href: "/shop", className: "mt-2 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#A6532A] border-b border-[#A6532A] pb-0.5 hover:text-[#0B0B0B] hover:border-[#0B0B0B] transition-colors" },
                "BROWSE COLLECTION ",
                h(ArrowRight, { size: 12 })))) : (h(Fragment, null,
            h("p", { className: "text-xs font-bold tracking-widest text-[#9A9A9A] uppercase mb-8" },
                results.length,
                " result",
                results.length !== 1 ? "s" : "",
                " for \u201C",
                query,
                "\u201D"),
            h("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6" },
                h(AnimatePresence, { mode: "popLayout" }, results.map((product, idx) => (h(motion.div, { key: product.id, layout: true, initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, whileHover: { y: -6 }, transition: { duration: 0.3, delay: idx * 0.05 }, className: "group flex flex-col card-lift" },
                    h(Link, { href: `/product/${product.id}` },
                        h("div", { className: "relative aspect-[3/4] overflow-hidden bg-[#9A9A9A]/5 mb-4 rounded-2xl" },
                            h("img", { src: product.image, alt: product.name, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }),
                            h("button", { "aria-label": isInWishlist(product.id) ? `Unsave ${product.name}` : `Save ${product.name}`, onClick: (e) => {
                                    e.preventDefault();
                                    isInWishlist(product.id)
                                        ? removeFromWishlist(product.id)
                                        : addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
                                }, className: "absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10" },
                                h(Heart, { size: 14, className: isInWishlist(product.id) ? "fill-[#A6532A] text-[#A6532A]" : "text-[#0B0B0B]" }))),
                        h("p", { className: "text-[11px] font-bold tracking-wider text-[#0B0B0B] group-hover:text-[#A6532A] transition-colors leading-tight mb-1 nav-link-underline" }, product.name),
                        h("p", { className: "text-xs font-bold text-[#9A9A9A]" },
                            "\u20B9",
                            product.price.toLocaleString())),
                    h(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 }, onClick: () => {
                            const sizeToUse = preferredSize || "M";
                            const variant = findVariant(product, sizeToUse, product.colors?.[0]) || product.product_variants?.find((v) => v.active !== false);
                            addToCart({
                                id: product.id,
                                name: product.name,
                                price: Number(variant?.price_override || product.price),
                                image: product.image,
                                quantity: 1,
                                size: variant?.size || product.sizes?.[0] || sizeToUse,
                                color: variant?.color || product.colors?.[0] || "BLACK",
                                variantId: variant?.id,
                                stockLeft: Number(variant?.stock_count ?? product.stock_count ?? 0),
                            });
                        }, className: "mt-3 w-full border border-[#9A9A9A]/30 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#0B0B0B] hover:text-white hover:border-[#0B0B0B] transition-all duration-200 rounded-full" },
                        "Quick Add ",
                        preferredSize ? `(${preferredSize})` : "")))))))))));
}
