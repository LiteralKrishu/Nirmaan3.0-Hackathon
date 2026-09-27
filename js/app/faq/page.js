import { h, Fragment } from "/js/runtime/dom.js";
import { useState } from "/js/runtime/dom.js";
import { motion, AnimatePresence } from "/js/runtime/motion.js";
import { ChevronDown, MessageSquare } from "/js/runtime/icons.js";
import Link from "/js/runtime/navigation.js";

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const faqs = [
    {
        "category": "sizing",
        "question": "How do I find my size?",
        "answer": "Use the measurements in the size guide on each product page. Tees and hoodies have an oversized fit; cargos have a relaxed wide leg. All six demo pieces offer S, M, L, and XL."
    },
    {
        "category": "demo",
        "question": "Can I buy these pieces?",
        "answer": "This is a streetwear lookbook demo. You can explore products, build a bag, and save favourites. No orders or payments are taken."
    },
    {
        "category": "care",
        "question": "How should I care for printed pieces?",
        "answer": "Wash cold and inside out with similar colours. Air dry, and avoid ironing directly over a graphic."
    },
    {
        "category": "fabric",
        "question": "What fabrics are in the collection?",
        "answer": "The demo range pairs heavyweight cotton jersey tees with brushed fleece hoodies and cotton twill cargos. Each product page lists its fabric and fit."
    },
    {
        "category": "demo",
        "question": "Will my bag and saved pieces stay here?",
        "answer": "They stay available while you move between pages during this visit. Reloading the page starts a fresh session. Contact messages and review previews are not sent anywhere."
    }
];
    const categories = [{"id": "all", "label": "ALL TOPICS"}, {"id": "sizing", "label": "FIT & SIZING"}, {"id": "fabric", "label": "FABRIC & PRINT"}, {"id": "care", "label": "CARE"}, {"id": "demo", "label": "THE DEMO"}];
    const filteredFaqs = faqs.filter((faq) => activeTab === "all" || faq.category === activeTab);
    return (h("div", { className: "flex-1 w-full min-h-screen bg-[#FAFAFA] pb-24" },
        h("div", { className: "w-full bg-[#0B0B0B] text-white pt-24 pb-20 px-6 md:px-12 flex flex-col items-center text-center relative overflow-hidden" },
            h("div", { className: "absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#A6532A]/10 rounded-full blur-[120px] pointer-events-none" }),
            h("div", { className: "w-full max-w-[1400px] mx-auto relative z-10 flex flex-col items-center" },
                h("p", { className: "text-[9px] font-bold tracking-[0.35em] text-[#A6532A] uppercase mb-4" }, "SUPPORT CENTER"),
                h("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 uppercase", style: { fontFamily: "var(--font-syncopate)" } }, "FAQ & HELP"),
                h("p", { className: "text-gray-400 max-w-xl text-xs md:text-sm leading-relaxed font-medium" }, "Find answers about relaxed fits, original prints, garment care, and exploring the collection."))),
        h("div", { className: "w-full max-w-[900px] mx-auto px-6 mt-16" },
            h("div", { className: "flex flex-wrap justify-center gap-3 border-b border-gray-200/80 pb-6 mb-12" }, categories.map((tab) => (h("button", { key: tab.id, onClick: () => {
                    setActiveTab(tab.id);
                    setOpenIndex(null);
                }, className: `px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] transition-all border ${activeTab === tab.id
                    ? "bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-md"
                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-[#0B0B0B]"}` }, tab.label)))),
            h("div", { className: "flex flex-col gap-4" },
                h(AnimatePresence, { mode: "popLayout" }, filteredFaqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (h(motion.div, { key: faq.question, layout: true, initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, scale: 0.98 }, transition: { duration: 0.25 }, className: "bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden" },
                        h("button", { onClick: () => setOpenIndex(isOpen ? null : index), className: "w-full px-6 py-6 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors" },
                            h("span", { className: "text-xs md:text-sm font-bold text-[#0B0B0B] tracking-wide pr-4" }, faq.question),
                            h(motion.div, { animate: { rotate: isOpen ? 180 : 0 }, transition: { duration: 0.2 }, className: "text-[#9A9A9A] shrink-0" },
                                h(ChevronDown, { size: 18 }))),
                        h(AnimatePresence, { initial: false }, isOpen && (h(motion.div, { initial: { height: 0 }, animate: { height: "auto" }, exit: { height: 0 }, transition: { duration: 0.25, ease: "easeInOut" }, className: "overflow-hidden" },
                            h("div", { className: "px-6 pb-6 pt-2 text-xs md:text-sm text-gray-500 leading-relaxed font-medium border-t border-gray-100/50" }, faq.answer))))));
                }))),
            h("div", { className: "mt-20 bg-white border border-gray-100 shadow-xl rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center" },
                h("div", { className: "w-12 h-12 rounded-2xl bg-[#A6532A]/10 text-[#A6532A] flex items-center justify-center mb-6" },
                    h(MessageSquare, { size: 20 })),
                h("h3", { className: "text-lg font-black text-[#0B0B0B] tracking-tight uppercase mb-3" }, "Still have questions?"),
                h("p", { className: "text-xs text-gray-400 font-medium max-w-sm mb-8 leading-relaxed" }, "Our support desk is available Monday through Friday to address any personalized inquiries regarding drops or orders."),
                h(Link, { href: "/contact-us", className: "inline-flex items-center justify-center px-8 py-4 bg-[#0B0B0B] text-white rounded-full text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#A6532A] transition-colors shadow-lg" }, "CONTACT SUPPORT")))));
}
