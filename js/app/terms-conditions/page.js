import { h, Fragment } from "/js/runtime/dom.js";
export default function TermsConditionsPage() {
    return (h("div", { className: "min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 md:px-12" },
        h("div", { className: "max-w-4xl mx-auto" },
            h("p", { className: "text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-4" }, "MURHOPRINTS / T E R M S"),
            h("h1", { className: "text-4xl md:text-6xl font-black text-[#0B0B0B] tracking-tighter mb-8", style: { fontFamily: "var(--font-syncopate)" } }, "TERMS & CONDITIONS"),
            h("div", { className: "bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 md:p-10 space-y-6 text-sm text-gray-600 leading-relaxed" },
                h("p", null, "MurhoPrints is a hackathon frontend demonstration of a streetwear collection. The product images are generated concept visuals."),
                h("p", null, "Prices, sizes, fabrics, and availability describe the hardcoded demo collection. They are illustrative and are not an offer to sell physical goods."),
                h("p", null, "Adding a piece to the bag or saving a concept does not reserve stock or place an order. No payment or delivery service is available."),
                h("p", null, "Contact messages and product reviews are local previews for this visit only. They are not sent to a support team or published.")))));
}
