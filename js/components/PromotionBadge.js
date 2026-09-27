import { h, Fragment } from "/js/runtime/dom.js";
export default function PromotionBadge({ promotion, compact = false }) {
    const { discount_type, discount_value, display_title, title } = promotion;
    if (discount_type === "percentage" && discount_value) {
        return (h("div", { className: `
          absolute top-3 left-3 z-20
          bg-red-600 text-white font-black tracking-wide rounded-xl shadow-lg
          flex items-center justify-center
          ${compact ? "px-2.5 py-1 text-[11px]" : "px-4 py-2 text-sm"}
        ` },
            Math.round(discount_value),
            "% OFF"));
    }
    if (discount_type === "flat" && discount_value) {
        return (h("div", { className: `
          absolute top-3 left-3 z-20
          bg-red-600 text-white font-black tracking-wide rounded-xl shadow-lg
          flex items-center justify-center
          ${compact ? "px-2.5 py-1 text-[10px]" : "px-4 py-2 text-[13px]"}
        ` },
            "\u20B9",
            discount_value.toLocaleString(),
            " OFF"));
    }
    // label_only — show display_title or title
    const label = display_title || title;
    if (label) {
        return (h("div", { className: `
          absolute top-3 left-3 z-20
          bg-[#A6532A] text-white font-black tracking-widest uppercase rounded-xl shadow-lg
          flex items-center justify-center
          ${compact ? "px-2.5 py-1 text-[9px]" : "px-4 py-2 text-[11px]"}
        ` }, label));
    }
    return null;
}
