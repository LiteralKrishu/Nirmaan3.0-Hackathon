import { h, Fragment } from "/js/runtime/dom.js";
import { useState } from "/js/runtime/dom.js";
import { motion } from "/js/runtime/motion.js";
import { ArrowRight, Mail, MapPin, MessageSquare, Phone } from "/js/runtime/icons.js";
const inputClass = "w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#0B0B0B] outline-none focus:border-[#0B0B0B] transition-colors placeholder:text-gray-300";
export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        issue: "product-question",
        message: "",
    });
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = (event) => {
      event.preventDefault();
      setStatus("DEMO MESSAGE PREVIEW READY. NO MESSAGE WAS SENT.");
    };
    return (h("div", { className: "min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 md:px-12 lg:px-20" },
        h("div", { className: "max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start" },
            h(motion.div, { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, className: "lg:sticky lg:top-28" },
                h("p", { className: "text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-4" }, "MURHOPRINTS / S U P P O R T"),
                h("h1", { className: "text-5xl md:text-7xl font-black text-[#0B0B0B] tracking-tighter leading-[0.9]", style: { fontFamily: "var(--font-syncopate)" } },
                    "FIELD",
                    h("br", null),
                    "SUPPORT."),
                h("p", { className: "mt-8 max-w-xl text-sm text-gray-500 leading-relaxed" }, "Print ideas, sizing questions, and styling inspiration. Try the contact form preview; your message stays on this page and is not sent."),
                h("div", { className: "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 mt-10" }, [
                    { icon: Mail, label: "SAY HELLO", value: "Contact form preview" },
                    { icon: Phone, label: "OUR FOCUS", value: "Streetwear & custom prints" },
                    { icon: MapPin, label: "BASE", value: "Bengaluru, India" },
                ].map(({ icon: Icon, label, value }) => (h("div", { key: label, className: "bg-white border border-gray-100 rounded-3xl p-5 shadow-sm" },
                    h(Icon, { size: 18, className: "text-[#A6532A] mb-4" }),
                    h("p", { className: "text-[9px] font-black tracking-[0.25em] text-gray-400 uppercase" }, label),
                    h("p", { className: "text-xs font-black text-[#0B0B0B] mt-1" }, value)))))),
            h(motion.form, { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, onSubmit: handleSubmit, className: "bg-white rounded-[40px] p-8 md:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)] border border-gray-100" },
                h("div", { className: "flex items-center gap-3 mb-8" },
                    h("div", { className: "w-12 h-12 rounded-full bg-[#0B0B0B] text-white flex items-center justify-center" },
                        h(MessageSquare, { size: 18 })),
                    h("div", null,
                        h("h2", { className: "text-sm font-black tracking-[0.2em] uppercase text-[#0B0B0B]" }, "Contact Preview"),
                        h("p", { className: "text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 mt-1" }, "Local preview — nothing is sent"))),
                h("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5" },
                    h("input", { className: inputClass, required: true, placeholder: "FULL NAME", value: form.name, onChange: (event) => setForm({ ...form, name: event.target.value }) }),
                    h("input", { className: inputClass, required: true, type: "email", placeholder: "EMAIL", value: form.email, onChange: (event) => setForm({ ...form, email: event.target.value }) }),
                    h("input", { className: inputClass, placeholder: "PHONE", value: form.phone, onChange: (event) => setForm({ ...form, phone: event.target.value }) }),
                    h("select", { className: inputClass, value: form.issue, onChange: (event) => setForm({ ...form, issue: event.target.value }) },
                        h("option", { value: "product-question" }, "PRODUCT QUESTION"),
                        h("option", { value: "sizing" }, "SIZING"),
                        h("option", { value: "print-care" }, "PRINT CARE"),
                        h("option", { value: "partnership" }, "PARTNERSHIP"))),
                h("textarea", { required: true, rows: 7, className: `${inputClass} mt-5 resize-none`, placeholder: "MESSAGE", value: form.message, onChange: (event) => setForm({ ...form, message: event.target.value }) }),
                status && h("p", { className: "mt-5 text-[10px] font-black tracking-[0.2em] uppercase text-[#A6532A]" }, status),
                h("button", { type: "submit", disabled: isSubmitting, className: "mt-8 w-full bg-[#0B0B0B] text-white py-5 rounded-3xl flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-[#A6532A] transition-colors disabled:opacity-50" },
                    isSubmitting ? "TRANSMITTING..." : "PREVIEW MESSAGE",
                    " ",
                    h(ArrowRight, { size: 16 }))))));
}
