import { h, Fragment } from "/js/runtime/dom.js";
import { useState } from "/js/runtime/dom.js";
import { motion } from "/js/runtime/motion.js";
import { Clock, Lock, ArrowRight, Zap } from "/js/runtime/icons.js";
const upcomingDrops = [
    {
        "id": "drop-02",
        "title": "INK AFTER DARK",
        "date": "CONCEPT COLLECTION",
        "status": "PREVIEW",
        "description": "Abstract cream lines on washed black cotton. An oversized everyday tee with a graphic point of view.",
        "image": "/images/streetwear/street-tee.png",
        "discount": "GRAPHIC TEES"
    },
    {
        "id": "drop-03",
        "title": "CONCRETE DAYS",
        "date": "CONCEPT COLLECTION",
        "status": "PREVIEW",
        "description": "Washed olive fleece, a roomy hood, and loose charcoal layers. The city uniform, reworked.",
        "image": "/images/streetwear/street-hoodie.png",
        "discount": "HEAVYWEIGHT HOODIES"
    },
    {
        "id": "drop-04",
        "title": "SIDE STREET",
        "date": "CONCEPT COLLECTION",
        "status": "PREVIEW",
        "description": "Wide-leg stone cargos with generous pockets and a relaxed fit. Made for the long route home.",
        "image": "/images/streetwear/street-cargo.png",
        "discount": "RELAXED CARGOS"
    },
    {
        "id": "drop-05",
        "title": "ORBIT STUDIO",
        "date": "CONCEPT COLLECTION",
        "status": "PREVIEW",
        "description": "Rust orbital graphics on off-white cotton. A clean canvas with a bold centre of gravity.",
        "image": "/images/streetwear/street-cream-tee.png",
        "discount": "ORIGINAL PRINTS"
    },
    {
        "id": "drop-06",
        "title": "RUST ROTATION",
        "date": "CONCEPT COLLECTION",
        "status": "PREVIEW",
        "description": "Terracotta tones and oversized shapes for a warmer take on your everyday rotation.",
        "image": "/images/streetwear/hero-streetwear.png",
        "discount": "SIGNATURE COLOUR"
    }
];
export default function DropCulturePage() {
    const [notifiedDrops, setNotifiedDrops] = useState([]);
    const handleNotify = (id) => {
        if (notifiedDrops.includes(id))
            return;
        setNotifiedDrops([...notifiedDrops, id]);
    };
    return (h("div", { className: "flex-1 w-full flex flex-col items-center bg-white min-h-screen pb-24" },
        h(motion.div, { initial: { opacity: 0, y: -12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: "easeOut" }, className: "w-full bg-[#111] text-white pt-12 pb-14 px-6 md:px-12 flex flex-col items-center text-center" },
            h("h1", { className: "text-4xl md:text-7xl font-black tracking-tighter uppercase mb-6", style: { fontFamily: "var(--font-syncopate)" } }, "DROP CULTURE"),
            h("p", { className: "text-gray-400 max-w-2xl text-xs md:text-sm leading-relaxed font-medium" }, "A preview of our streetwear direction. Explore graphic tees, heavyweight layers, and relaxed cargos. Save a concept during your visit.")),
        h("div", { className: "w-full bg-[#C45A36] overflow-hidden py-6 z-20 relative shadow-lg" },
            h("div", { className: "flex whitespace-nowrap text-white font-black text-[11px] tracking-[0.4em] uppercase", style: { animation: "slideLeft 25s linear infinite" } }, Array(10).fill("ORIGINAL PRINTS • RELAXED FITS • YOUR EVERYDAY ROTATION • ").map((text, i) => (h("span", { key: i, className: "mx-12" }, text))))),
        h("div", { className: "w-full max-w-[1200px] px-6 mt-16 flex flex-col gap-24" }, upcomingDrops.map((drop, index) => (h(motion.div, { key: drop.id, initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7, delay: 0.1, ease: "easeOut" }, className: "flex flex-col md:flex-row gap-8 md:gap-16 items-center group" },
            h(motion.div, { whileHover: { scale: 1.02, y: -6 }, transition: { type: "spring", stiffness: 280, damping: 22 }, className: `w-full md:w-1/2 relative aspect-[4/5] bg-gray-100 overflow-hidden rounded-[40px] shadow-2xl ${index % 2 !== 0 ? 'md:order-2' : ''}` },
                h("img", { src: drop.image, alt: drop.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" }),
                h("div", { className: "absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" }),
                h("div", { className: "absolute top-8 left-8 bg-white/90 backdrop-blur-md px-5 py-2.5 flex items-center gap-2 rounded-full shadow-lg" },
                    drop.status === 'LOCKED' ? h(Lock, { size: 14, className: "text-[#0B0B0B]" }) : h(Clock, { size: 14, className: "text-[#0B0B0B]" }),
                    h("span", { className: `text-[10px] font-black tracking-[0.2em] text-[#0B0B0B] uppercase` }, drop.status))),
            h("div", { className: `w-full md:w-1/2 flex flex-col items-start ${index % 2 !== 0 ? 'md:order-1' : ''}` },
                h("div", { className: "flex items-center gap-3 mb-6 bg-gray-50 border border-gray-100 px-5 py-2.5 self-start rounded-full" },
                    h(Zap, { size: 14, className: "text-[#0B0B0B]" }),
                    h("span", { className: "text-[10px] font-black tracking-[0.2em] text-[#0B0B0B]" }, drop.discount)),
                h("h2", { className: "text-4xl md:text-6xl font-black tracking-tighter text-[#0B0B0B] leading-none mb-4 uppercase", style: { fontFamily: "var(--font-syncopate)" } }, drop.title),
                h("div", { className: "text-xs font-bold tracking-[0.3em] text-gray-400 mb-8 pb-4 border-b border-gray-100 w-full" },
                    "THE EDIT: ",
                    drop.date),
                h("p", { className: "text-gray-500 font-medium leading-relaxed mb-10 text-lg" }, drop.description),
                h("div", { className: "flex gap-4 mb-10" }, [
                    { val: "01", label: "CONCEPT" },
                    { val: "04", label: "SIZES" },
                    { val: "MP", label: "STUDIO" }
                ].map((t, i) => (h(motion.div, { key: i, whileHover: { scale: 1.08, y: -3 }, className: "flex flex-col items-center border border-gray-100 bg-gray-50/50 p-5 min-w-[90px] rounded-3xl cursor-default" },
                    h("span", { className: "text-3xl font-black tracking-tighter text-[#0B0B0B]" }, t.val),
                    h("span", { className: "text-[9px] font-black tracking-[0.2em] text-gray-400 mt-1 uppercase" }, t.label))))),
                h(motion.button, { whileHover: { scale: 1.04, y: -2 }, whileTap: { scale: 0.97 }, onClick: () => handleNotify(drop.id), disabled: notifiedDrops.includes(drop.id), className: `w-full md:w-auto px-10 py-5 flex items-center justify-center gap-3 transition-all duration-500 rounded-full shadow-xl group/btn ${notifiedDrops.includes(drop.id)
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-[#0B0B0B] text-white hover:bg-[#A6532A]'}` },
                    h("span", { className: "text-[11px] font-black tracking-[0.25em] uppercase" }, notifiedDrops.includes(drop.id) ? 'SAVED FOR THIS VISIT' : 'SAVE THIS CONCEPT'),
                    notifiedDrops.includes(drop.id) ? h(Zap, { size: 16, fill: "white" }) : h(ArrowRight, { size: 16, className: "group-hover/btn:translate-x-1 transition-transform" }))))))),
        h("style", { jsx: true, global: true }, `
        @keyframes slideLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `)));
}
