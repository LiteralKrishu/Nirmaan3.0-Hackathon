import { categories } from "/js/data/products.js";
import { h, Fragment } from "/js/runtime/dom.js";
import { useState, useEffect } from "/js/runtime/dom.js";
import Link from "/js/runtime/navigation.js";
import { useRouter } from "/js/runtime/navigation.js";
import { Search, ShoppingCart, Heart, X, ArrowRight, Menu } from "/js/runtime/icons.js";
import { motion, AnimatePresence } from "/js/runtime/motion.js";
import { useCart } from "/js/context/CartContext.js";
import CartDrawer from "/js/components/CartDrawer.js";
export default function Navbar() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    const { cartItems, toggleCart } = useCart();
    const router = useRouter();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const showDropCulture = true;
    const superCategories = categories.filter(c => !c.parent_id);
    const subCategoriesMap = Object.fromEntries(superCategories.map(c => [c.id, categories.filter(child => child.parent_id === c.id)]));
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            setSearchQuery("");
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    return (h(Fragment, null,
        h(AnimatePresence, null, isSearchOpen && (h(Fragment, null,
            h(motion.div, { key: "search-backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, onClick: () => setIsSearchOpen(false), className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]" }),
            h(motion.div, { key: "search-panel", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.25 }, className: "fixed top-0 left-0 right-0 z-[310] bg-white border-b border-[#9A9A9A]/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-b-3xl" },
                h("form", { onSubmit: handleSearch, className: "w-full max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex items-center gap-4" },
                    h(Search, { size: 20, className: "text-[#9A9A9A] shrink-0" }),
                    h("input", { autoFocus: true, type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search for products, categories...", "aria-label": "Search the collection", className: "flex-1 min-w-0 bg-transparent outline-none text-lg font-medium text-[#0B0B0B] placeholder:text-[#9A9A9A]" }),
                    searchQuery && (h("button", { type: "submit", className: "flex items-center gap-2 bg-[#0B0B0B] hover:bg-[#A6532A] text-white px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors" },
                        "SEARCH ",
                        h(ArrowRight, { size: 12 }))),
                    h("button", { type: "button", "aria-label": "Close search", onClick: () => setIsSearchOpen(false), className: "w-9 h-9 flex items-center justify-center border border-[#9A9A9A]/20 hover:border-[#0B0B0B] hover:bg-[#0B0B0B] hover:text-white transition-all" },
                        h(X, { size: 16 }))))))),
        h(motion.nav, { initial: { opacity: 0, y: -16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, className: "w-full px-4 md:px-12 py-3 flex items-center justify-between z-[200] relative bg-white/90 backdrop-blur-md sticky top-0 border-b border-[#9A9A9A]/15" },
            h("div", { className: "flex-[1] flex items-center justify-start lg:gap-8 text-[11px] font-bold tracking-[0.2em]" },
                h("button", { "aria-label": "Open menu", className: "lg:hidden p-2 -ml-2", onClick: () => setIsMobileMenuOpen(true) },
                    h(Menu, { size: 20, className: "text-[#0B0B0B]" })),
                h("div", { className: "hidden lg:flex items-center gap-8" },
                    superCategories.map((parent) => {
                        const children = subCategoriesMap[parent.id] || [];
                        return (h("div", { key: parent.id, className: "relative cursor-pointer flex items-center", onMouseEnter: () => setActiveDropdown(parent.slug), onMouseLeave: () => setActiveDropdown(null) },
                            h(Link, { href: `/shop/${parent.slug}`, onClick: () => setActiveDropdown(null), className: "flex items-center gap-1 hover:text-[#A6532A] transition-colors nav-link-underline whitespace-nowrap uppercase" }, parent.name),
                            h(AnimatePresence, null, activeDropdown === parent.slug && children.length > 0 && (h(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 }, transition: { duration: 0.18 }, className: "absolute top-full left-0 floating-panel py-5 px-7 min-w-[220px] flex flex-col gap-4 mt-2 z-[250]" },
                                h(Link, { href: `/shop/${parent.slug}`, className: "pb-3 border-b border-[#9A9A9A]/20 hover:text-[#A6532A] transition-colors uppercase" },
                                    "Shop all ",
                                    parent.name),
                                children.map((child) => {
                                    const cleanSubSlug = child.slug.startsWith(parent.slug + '-')
                                        ? child.slug.slice(parent.slug.length + 1)
                                        : child.slug;
                                    const href = `/shop/${parent.slug}/${cleanSubSlug}`;
                                    return (h(Link, { key: child.id, href: href, className: "hover:text-[#A6532A] transition-colors uppercase" }, child.name));
                                }))))));
                    }),
                    showDropCulture && (h(Link, { href: "/drop-culture", className: "hover:text-[#A6532A] transition-colors nav-link-underline whitespace-nowrap" }, "DROP CULTURE")))),
            h("div", { className: "flex-[1] flex flex-col items-center justify-center" },
                h(Link, { href: "/", className: "flex flex-col items-center outline-none focus:outline-none border-none" },
                    h("img", { src: "/murhoprints-wordmark.svg", alt: "MurhoPrints Logo", className: "h-5 sm:h-6 md:h-8 w-auto drop-shadow-sm" }))),
            h("div", { className: "flex-[1] flex items-center justify-end lg:gap-8 gap-4 text-[11px] font-bold tracking-[0.2em]" },
                h("div", { className: "hidden lg:flex items-center gap-8 mr-4" },
                    h(Link, { href: "/", className: "hover:text-[#A6532A] transition-colors nav-link-underline whitespace-nowrap" }, "HOME"),
                    h(Link, { href: "/shop", className: "hover:text-[#A6532A] transition-colors nav-link-underline whitespace-nowrap" }, "SHOP"),
                    h(Link, { href: "/about", className: "hover:text-[#A6532A] transition-colors nav-link-underline whitespace-nowrap" }, "ABOUT"),
                    h(Link, { href: "/contact-us", className: "hover:text-[#A6532A] transition-colors nav-link-underline whitespace-nowrap" }, "CONTACT")),
                h("div", { className: "flex items-center gap-3 md:gap-5" },
                    h(motion.button, { whileHover: { scale: 1.18 }, whileTap: { scale: 0.92 }, onClick: () => setIsSearchOpen(true), "aria-label": "Search", className: "cursor-pointer hover:text-[#A6532A] transition-colors" }, h(Search, { size: 18 })),
                    h(Link, {href: "/saved", "aria-label":"Saved pieces", className:"hover:text-[#A6532A] transition-colors"}, h(Heart,{size:18})),
                    h(motion.button, { whileHover: { scale: 1.18 }, whileTap: { scale: 0.92 }, onClick: toggleCart, className: "relative cursor-pointer hover:text-[#A6532A] transition-colors", "aria-label": "Cart" },
                        h(ShoppingCart, { size: 18 }),
                        h(AnimatePresence, null, cartCount > 0 ? (h(motion.div, { key: "cart-badge-count", initial: { scale: 0 }, animate: { scale: 1 }, exit: { scale: 0 }, className: "absolute -top-2 -right-2 w-4 h-4 bg-[#A6532A] text-white text-[9px] font-bold rounded-full flex items-center justify-center" }, cartCount)) : (h(motion.div, { key: "cart-badge-zero", initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute -top-2 -right-2 w-4 h-4 bg-[#0B0B0B] text-white text-[9px] font-bold rounded-full flex items-center justify-center" }, "0"))))))),
        h(AnimatePresence, null, isMobileMenuOpen && (h(motion.div, { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" }, transition: { type: "tween", duration: 0.3 }, className: "fixed inset-0 z-[300] bg-[#f4f1eb] flex flex-col p-6 lg:hidden" },
            h("div", { className: "flex items-center justify-between mb-10" },
                h("img", { src: "/murhoprints-wordmark.svg", alt: "MurhoPrints Logo", className: "h-6 w-auto" }),
                h("button", { onClick: () => setIsMobileMenuOpen(false), "aria-label": "Close menu", className: "p-2 -mr-2" },
                    h(X, { size: 24, className: "text-[#0B0B0B]" }))),
            h("div", { className: "flex flex-col gap-6 text-sm font-bold tracking-[0.2em] uppercase overflow-y-auto pb-20" },
                h(Link, { href: "/", onClick: () => setIsMobileMenuOpen(false) }, "Home"),
                h(Link, { href: "/shop", onClick: () => setIsMobileMenuOpen(false) }, "Shop All"),
                superCategories.map(parent => (h("div", { key: parent.id, className: "flex flex-col gap-4 mt-4 border-t border-[#9A9A9A]/20 pt-4" },
                    h(Link, { href: `/shop/${parent.slug}`, onClick: () => setIsMobileMenuOpen(false), className: "text-[#8D452B]" }, parent.name),
                    (subCategoriesMap[parent.id] || []).map(child => {
                        const cleanSubSlug = child.slug.startsWith(parent.slug + '-')
                            ? child.slug.slice(parent.slug.length + 1)
                            : child.slug;
                        return (h(Link, { key: child.id, href: `/shop/${parent.slug}/${cleanSubSlug}`, onClick: () => setIsMobileMenuOpen(false), className: "pl-4 text-xs" }, child.name));
                    })))),
                h("div", { className: "border-t border-[#9A9A9A]/20 mt-4 pt-6 flex flex-col gap-6" },
                    h(Link, { href: "/about", onClick: () => setIsMobileMenuOpen(false) }, "About Us"),
                    h(Link, { href: "/contact-us", onClick: () => setIsMobileMenuOpen(false) }, "Contact"),
                    showDropCulture && h(Link, { href: "/drop-culture", onClick: () => setIsMobileMenuOpen(false) }, "Drop Culture")))))),
        h(CartDrawer, null)));
}
