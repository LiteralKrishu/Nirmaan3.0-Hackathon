import { h, Fragment } from "/js/runtime/dom.js";
export default function PrivacyPolicyPage() {
    return (h("div", { className: "min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 md:px-12" },
        h("div", { className: "max-w-4xl mx-auto" },
            h("p", { className: "text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-4" }, "MURHOPRINTS / P R I V A C Y"),
            h("h1", { className: "text-4xl md:text-6xl font-black text-[#0B0B0B] tracking-tighter mb-8", style: { fontFamily: "var(--font-syncopate)" } }, "PRIVACY POLICY"),
            h("div", { className: "bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 md:p-10 space-y-6 text-sm text-gray-600 leading-relaxed" },
                h("p", null, "MurhoPrints is a self-contained streetwear demonstration. Product information, imagery, and fonts are served with the site."),
                h("p", null, "The bag, saved pieces, saved drop concepts, and review previews exist only in memory for your current visit. Reloading the page clears these interactions."),
                h("p", null, "The contact form previews a completed message locally. It does not send your name, email address, or message. Review previews are also not submitted."),
                h("p", null, "This demo does not use analytics, tracking cookies, or browser storage. It does not accept payments or create customer accounts.")))));
}
