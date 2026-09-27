import { products } from "/js/data/products.js";
import { h, Fragment } from "/js/runtime/dom.js";
import { ArrowRight } from "/js/runtime/icons.js";
import Link from "/js/runtime/navigation.js";
import { useEffect, useState } from "/js/runtime/dom.js";
import { normalizeProduct, normalizeProducts } from "/js/lib/catalog.js";
import { usePromotions } from "/js/hooks/usePromotions.js";
import NewArrivals from "/js/components/NewArrivals.js";
import MaterialSystem from "/js/components/MaterialSystem.js";
import LifeInMotion from "/js/components/LifeInMotion.js";
import { BrandStrip, PerformanceDetails, ExploreCollections } from "/js/components/HomeEditorial.js";
export default function Home() {
    const isLoading = false;
    const homeSections = [];
    const homeProducts = products;
    const { getPromotion, promotedProductIds } = usePromotions();
    const storefrontSections = homeSections.filter((section) => section.products.length > 0);
    const onSaleProducts = homeProducts.filter((product) => promotedProductIds.includes(product.id));
    return (h("div", { className: "flex-1 w-full flex flex-col items-center overflow-x-hidden relative bg-[#f4f1eb]" },
        h("section", { className: "relative w-full bg-[#F3EFE9] overflow-x-hidden pt-0 lg:pt-8 pb-0 lg:pb-12 flex flex-col justify-between lg:min-h-screen" },
            h("div", { className: "absolute top-[2%] bottom-[4%] left-[12%] right-[12%] z-0 hidden lg:block" },
                h("div", { className: "w-full h-full [clip-path:polygon(0_0,100%_0,100%_100%,42%_100%,42%_50%,0_50%)]" },
                    h("img", { src: "/heropage/mainbackground.png", alt: "Architecture Backdrop", className: "w-full h-full object-cover", decoding: "async" }))),
            h("div", { className: "relative w-full h-[47vh] min-h-[320px] max-h-[420px] z-0 block lg:hidden overflow-hidden rounded-b-[40px]" },
                h("img", { src: "/heropage/mainbackground.png", alt: "Architecture Backdrop", className: "absolute inset-0 w-full h-full object-cover object-[center_30%] -z-10", decoding: "async" }),
                h("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none h-full items-end" },
                    h("img", { src: "/images/streetwear/hero-streetwear.png", alt: "MurhoPrints Streetwear", fetchPriority: "high", decoding: "async", className: "h-full w-auto object-contain object-bottom pointer-events-none scale-[1.12] origin-bottom" }))),
            h("div", { className: "absolute top-[16%] lg:top-[18%] left-[4%] lg:left-[6%] z-10 hidden lg:block" },
                h("div", { className: "w-[170px] lg:w-[190px] aspect-[3/4] overflow-hidden shadow-xl rounded-sm" },
                    h("img", { src: "/images/streetwear/street-tee.png", alt: "Graphic Tee Collection", className: "w-full h-full object-cover", fetchPriority: "low", decoding: "async" }))),
            h("div", { className: "absolute top-[16%] lg:top-[18%] right-[4%] lg:right-[6%] z-10 hidden lg:block" },
                h("div", { className: "w-[170px] lg:w-[190px] aspect-[3/4] overflow-hidden shadow-xl rounded-sm" },
                    h("img", { src: "/images/streetwear/street-hoodie.png", alt: "Hoodie Collection", className: "w-full h-full object-cover", fetchPriority: "low", decoding: "async" }))),
            h("div", { className: "relative z-20 flex flex-col items-center text-center px-6 pt-6 pb-12 lg:absolute lg:bottom-[12%] lg:left-[4%] xl:left-[8%] lg:p-0 lg:items-start lg:text-left w-full lg:w-auto pointer-events-auto" },
                h("div", { className: "flex flex-col items-center lg:items-start gap-3 lg:gap-4 w-full text-center lg:text-left max-w-lg" },
                    h("h1", { className: "text-[10vw] sm:text-5xl md:text-5xl lg:text-[54px] xl:text-[66px] font-medium tracking-tighter text-[#8D452B] leading-[1] drop-shadow-md", style: { fontFamily: "var(--font-syncopate)" } },
                        "RESIST",
                        h("br", { className: "lg:hidden" }),
                        " NOTHING."),
                    h("p", { className: "text-[9px] sm:text-xs font-semibold tracking-widest text-[#7C828C] leading-relaxed mx-auto lg:mx-0 max-w-[260px] lg:max-w-none" },
                        "PREMIUM STREETWEAR.",
                        h("br", { className: "lg:hidden" }),
                        " DESIGNED TO MOVE WITH YOU."),
                    h(Link, { href: "/shop", className: "mt-2 lg:mt-4 group relative inline-flex items-center justify-between gap-6 px-6 py-3 bg-[#8D452B] text-white text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[#6D341E] transition-colors mx-auto lg:mx-0 shadow-lg w-auto" },
                        h("span", null, "SHOP NEW ARRIVALS"),
                        h(ArrowRight, { size: 14, className: "group-hover:translate-x-1 transition-transform" })))),
            h("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-[1400px] hidden lg:flex justify-center pointer-events-none" },
                h("img", { src: "/images/streetwear/hero-streetwear.png", alt: "MurhoPrints Streetwear", fetchPriority: "high", decoding: "async", className: "h-[92vh] w-auto object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)] pointer-events-none scale-[1.1] origin-bottom" }))),
        h(BrandStrip, null),
        h(NewArrivals, { products: homeProducts.slice(0, 3), loading: isLoading, editorial: true, getPromotion: getPromotion }),
        h(MaterialSystem, null),
        h(LifeInMotion, null),
        h(PerformanceDetails, null),
        h(ExploreCollections, null),
        h("div", { id: "collection", className: "w-full scroll-mt-24" },
            storefrontSections.map((section) => h(NewArrivals, { key: section.id, products: section.products, title: section.title, subtitle: section.subtitle || "Considered pieces for your everyday rotation.", eyebrow: "THE MURHOPRINTS SELECTION", getPromotion: getPromotion })),
            storefrontSections.length === 0 && homeProducts.length > 3 && h(NewArrivals, { products: homeProducts.slice(3, 7), title: "In your rotation.", subtitle: "Easy to wear. Hard to leave behind.", eyebrow: "THE EVERYDAY EDIT", getPromotion: getPromotion }),
            onSaleProducts.length > 0 && h(NewArrivals, { products: onSaleProducts, title: "A little more possibility.", subtitle: "Selected pieces. Special prices. Same MurhoPrints feeling.", eyebrow: "CURRENT OFFERS", getPromotion: getPromotion }))));
}
