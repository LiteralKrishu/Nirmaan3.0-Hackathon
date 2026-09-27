import { h, Fragment } from "/js/runtime/dom.js";
import { useEffect, useRef, useState } from "/js/runtime/dom.js";
import { AnimatePresence, motion } from "/js/runtime/motion.js";
const INTRO_DURATION_MS = 950;
export default function Preloader() {
    const [visible, setVisible] = useState(true);
    const numberRef = useRef(null);
    useEffect(() => {
        let frame = 0;
        let exitTimer;
        const start = performance.now();
        const update = (now) => {
            const progress = Math.min((now - start) / INTRO_DURATION_MS, 1);
            if (numberRef.current)
                numberRef.current.textContent = String(Math.floor(progress * 100));
            if (progress < 1) {
                frame = requestAnimationFrame(update);
            }
            else {
                exitTimer = setTimeout(() => setVisible(false), 120);
            }
        };
        frame = requestAnimationFrame(update);
        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(exitTimer);
        };
    }, []);
    return (h(AnimatePresence, null, visible && (h(motion.div, { id: "loader-wrapper", "aria-hidden": "true", initial: false, exit: { opacity: 0, transition: { duration: 0.25 } }, className: "fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center" },
        h("div", { className: "flex flex-col items-center" },
            h("div", { className: "mb-6 w-64 md:w-80 h-auto relative flex justify-center items-center" },
                h("svg", { viewBox: "0 0 370 220", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "w-full h-full drop-shadow-md" },
                    h(motion.path, { d: "M55 180V45L120 125L185 45V180M225 180V45H285C345 45 345 130 285 130H225", fill: "transparent", stroke: "#0B0B0B", strokeWidth: "3", initial: { pathLength: 0, fill: "rgba(11, 11, 11, 0)" }, animate: { pathLength: 1, fill: "#0B0B0B" }, transition: { pathLength: { duration: 0.95, ease: "easeInOut" }, fill: { delay: 0.72, duration: 0.2 } } }))),
            h("div", { className: "flex items-baseline justify-center" },
                h("span", { ref: numberRef, className: "font-sans font-light text-6xl text-[#0B0B0B] tracking-tight" }, "0"),
                h("span", { className: "font-sans font-light text-2xl text-[#9A9A9A] ml-1" }, "%")),
            h("div", { className: "w-48 h-[2px] bg-[#9A9A9A]/10 mt-8 relative overflow-hidden" },
                h(motion.div, { initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition: { duration: 0.95, ease: "linear" }, className: "absolute inset-0 bg-[#A6532A] origin-left" })))))));
}
