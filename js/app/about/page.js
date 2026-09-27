import { h, Fragment } from "/js/runtime/dom.js";
import Link from "/js/runtime/navigation.js";
import { motion } from "/js/runtime/motion.js";
import { Wind, Target, Activity, Shield, ArrowRight } from "/js/runtime/icons.js";
export default function AboutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };
    const techFeatures = [
        {
            icon: Wind,
            title: "HEAVYWEIGHT COTTON",
            description: "Substantial cotton jersey and brushed fleece give our demo collection its soft feel and easy drape."
        },
        {
            icon: Target,
            title: "OVERSIZED FIT",
            description: "Boxy proportions, dropped shoulders, and relaxed legs create an effortless silhouette with room to layer."
        },
        {
            icon: Activity,
            title: "ORIGINAL GRAPHICS",
            description: "Abstract lines, orbital artwork, and quiet signatures bring personality to familiar everyday pieces."
        },
        {
            icon: Shield,
            title: "PRINT CARE",
            description: "Wash inside out in cold water, air dry, and avoid ironing over artwork to care for your printed pieces."
        }
    ];
    return (h("div", { className: "w-full" },
        h("section", { className: "relative w-full py-28 md:py-36 bg-[#0B0B0B] text-white overflow-hidden" },
            h("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(166,83,42,0.15),transparent_50%)]" }),
            h("div", { className: "w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center" },
                h(motion.p, { initial: { opacity: 0, letterSpacing: "0.2em" }, animate: { opacity: 1, letterSpacing: "0.4em" }, transition: { duration: 1 }, className: "text-[10px] font-black text-[#A6532A] tracking-[0.4em] uppercase mb-4" }, "MURHOPRINTS / S T R E E T W E A R"),
                h(motion.h1, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "text-4xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none max-w-4xl", style: { fontFamily: "var(--font-syncopate)" } },
                    "MADE FOR ",
                    h("br", null),
                    h("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-[#A6532A] to-white" }, "EVERYDAY EXPRESSION")),
                h(motion.p, { initial: { opacity: 0 }, animate: { opacity: 0.8 }, transition: { duration: 1, delay: 0.2 }, className: "text-gray-400 text-sm md:text-lg max-w-xl font-medium leading-relaxed" }, "Original prints. Oversized silhouettes. Everyday pieces with a point of view."))),
        h("section", { className: "py-24 max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" },
            h(motion.div, { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "space-y-6" },
                h("h2", { className: "text-2xl md:text-3xl font-black uppercase tracking-tight text-[#0B0B0B]", style: { fontFamily: "var(--font-syncopate)" } }, "THE FOUNDATIONAL ETHOS"),
                h("div", { className: "w-16 h-1 bg-[#A6532A]" }),
                h("p", { className: "text-gray-500 text-base leading-relaxed" }, "MurhoPrints starts with the everyday uniform and makes it personal. We pair expressive graphics with relaxed shapes, grounded colours, and the kind of cotton you want to live in."),
                h("p", { className: "text-gray-500 text-base leading-relaxed" }, "From the placement of a print to the drop of a shoulder, each detail gives you room to style things your way. Tees, hoodies, and cargos made to mix, layer, and repeat."),
                h("div", { className: "pt-4" },
                    h(Link, { href: "/shop", className: "inline-flex items-center gap-3 bg-[#0B0B0B] hover:bg-[#A6532A] text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-colors shadow-lg" },
                        "EXPLORE COLLECTION ",
                        h(ArrowRight, { size: 14 })))),
            h(motion.div, { initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-gray-100" },
                h("img", { src: "/images/streetwear/street-tee.png", alt: "Streetwear editorial", className: "w-full h-full object-cover" }))),
        h("section", { className: "py-20 bg-[#FAFAFA] border-y border-gray-100" },
            h("div", { className: "max-w-[1400px] mx-auto px-6 md:px-12" },
                h("div", { className: "text-center mb-16 space-y-4" },
                    h("p", { className: "text-[10px] font-black text-[#A6532A] tracking-[0.3em] uppercase" }, "THE PRINT STUDIO"),
                    h("h3", { className: "text-2xl md:text-4xl font-black uppercase text-[#0B0B0B]", style: { fontFamily: "var(--font-syncopate)" } }, "DETAILS THAT MATTER")),
                h(motion.div, { variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true }, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" }, techFeatures.map((tech, i) => (h(motion.div, { key: i, variants: itemVariants, className: "bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between" },
                    h("div", null,
                        h("div", { className: "w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0B0B0B]/40 group-hover:bg-[#0B0B0B] group-hover:text-white transition-all duration-300 mb-6" },
                            h(tech.icon, { size: 20 })),
                        h("h4", { className: "text-xs font-black tracking-widest text-[#0B0B0B] uppercase mb-3" }, tech.title),
                        h("p", { className: "text-gray-400 text-xs leading-relaxed" }, tech.description))))))))));
}
