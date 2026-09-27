import { h, Fragment } from "/js/runtime/dom.js";
import Link from "/js/runtime/navigation.js";
import { ArrowUpRight, MoveUpRight, Wind, Scan, Layers } from "/js/runtime/icons.js";
const styles = {"container":"HomeEditorial_container","productSection":"HomeEditorial_productSection","collections":"HomeEditorial_collections","sectionHeading":"HomeEditorial_sectionHeading","eyebrow":"HomeEditorial_eyebrow","heading":"HomeEditorial_heading","intro":"HomeEditorial_intro","textLink":"HomeEditorial_textLink","productGrid":"HomeEditorial_productGrid","productCard":"HomeEditorial_productCard","productImage":"HomeEditorial_productImage","productAction":"HomeEditorial_productAction","productBadge":"HomeEditorial_productBadge","productMeta":"HomeEditorial_productMeta","productTitle":"HomeEditorial_productTitle","editCard":"HomeEditorial_editCard","collectionCard":"HomeEditorial_collectionCard","skeleton":"HomeEditorial_skeleton","emptyCollection":"HomeEditorial_emptyCollection","brandStrip":"HomeEditorial_brandStrip","stripMark":"HomeEditorial_stripMark","stripNote":"HomeEditorial_stripNote","lifeSection":"HomeEditorial_lifeSection","lifeGrid":"HomeEditorial_lifeGrid","lifePhoto":"HomeEditorial_lifePhoto","lifeStory":"HomeEditorial_lifeStory","bodyCopy":"HomeEditorial_bodyCopy","timeline":"HomeEditorial_timeline","performance":"HomeEditorial_performance","performanceHeading":"HomeEditorial_performanceHeading","benefitGrid":"HomeEditorial_benefitGrid","benefit":"HomeEditorial_benefit","collectionGrid":"HomeEditorial_collectionGrid","collectionIndex":"HomeEditorial_collectionIndex","everyoneLink":"HomeEditorial_everyoneLink","footer":"HomeEditorial_footer","newsletter":"HomeEditorial_newsletter","subscribeForm":"HomeEditorial_subscribeForm","footerMain":"HomeEditorial_footerMain","footerBrand":"HomeEditorial_footerBrand","footerLinks":"HomeEditorial_footerLinks","footerWordmark":"HomeEditorial_footerWordmark","footerBottom":"HomeEditorial_footerBottom"};
export function BrandStrip() {
    return h("div", { className: styles.brandStrip },
        h("span", null, "LESS RESISTANCE."),
        h("span", { className: styles.stripMark }, "\u2197"),
        h("span", null, "MORE POSSIBILITY."),
        h("span", { className: styles.stripNote }, "STREETWEAR FOR LIFE IN MOTION"));
}
export function PerformanceDetails() {
    return h("section", { className: styles.performance },
        h("div", { className: styles.container },
            h("div", { className: styles.performanceHeading },
                h("p", { className: styles.eyebrow }, "04 / THE MURHOPRINTS APPROACH"),
                h("h2", null,
                    "Less to think about.",
                    h("br", null),
                    h("span", null, "More room to move.")),
                h(Link, { href: "/about", className: styles.textLink },
                    "Behind the design ",
                    h(ArrowUpRight, { size: 17 }))),
            h("div", { className: styles.benefitGrid }, [
                { icon: Wind, title: "Breathe easy.", text: "Heavy cotton and easy layers, from the first coffee to the last train." },
                { icon: MoveUpRight, title: "Move freely.", text: "Considered shapes that give your everyday movement room to happen." },
                { icon: Scan, title: "Find your form.", text: "Clean lines. Purposeful fits. The kind of pieces you keep reaching for." },
                { icon: Layers, title: "Wear. Repeat.", text: "Versatile essentials that belong in your routine, whatever it looks like." },
            ].map((item, index) => h("div", { className: styles.benefit, key: item.title },
                h("div", null,
                    h(item.icon, { size: 24, strokeWidth: 1.3 }),
                    h("span", null,
                        "0",
                        index + 1)),
                h("h3", null, item.title),
                h("p", null, item.text))))));
}
export function ExploreCollections() {
    return h("section", { className: styles.collections },
        h("div", { className: styles.container },
            h("div", { className: styles.sectionHeading },
                h("div", null,
                    h("p", { className: styles.eyebrow }, "05 / FIND YOUR ELEMENT"),
                    h("h2", { className: styles.heading }, "Your kind of movement.")),
                h("p", { className: styles.intro },
                    "Different days. Same instinct.",
                    h("br", null),
                    "Make room for what moves you.")),
            h("div", { className: styles.collectionGrid, style: { gridTemplateColumns: '1fr' } },
                h(Link, { href: "/shop", className: styles.collectionCard },
                    h("img", { src: "/images/streetwear/street-tee.png", alt: "Oversized graphic tee styled on city steps", loading: "lazy" }),
                    h("span", { className: styles.collectionIndex }, "THE COLLECTION / 01"),
                    h("div", null,
                        h("h3", null, "Own your pace."),
                        h("span", null,
                            "Shop all ",
                            h(ArrowUpRight, { size: 23 })))))));
}
