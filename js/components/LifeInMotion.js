import { h, Fragment } from "/js/runtime/dom.js";
import Link from "/js/runtime/navigation.js";
import { ArrowUpRight } from "/js/runtime/icons.js";
const styles = {"container":"HomeEditorial_container","productSection":"HomeEditorial_productSection","collections":"HomeEditorial_collections","sectionHeading":"HomeEditorial_sectionHeading","eyebrow":"HomeEditorial_eyebrow","heading":"HomeEditorial_heading","intro":"HomeEditorial_intro","textLink":"HomeEditorial_textLink","productGrid":"HomeEditorial_productGrid","productCard":"HomeEditorial_productCard","productImage":"HomeEditorial_productImage","productAction":"HomeEditorial_productAction","productBadge":"HomeEditorial_productBadge","productMeta":"HomeEditorial_productMeta","productTitle":"HomeEditorial_productTitle","editCard":"HomeEditorial_editCard","collectionCard":"HomeEditorial_collectionCard","skeleton":"HomeEditorial_skeleton","emptyCollection":"HomeEditorial_emptyCollection","brandStrip":"HomeEditorial_brandStrip","stripMark":"HomeEditorial_stripMark","stripNote":"HomeEditorial_stripNote","lifeSection":"HomeEditorial_lifeSection","lifeGrid":"HomeEditorial_lifeGrid","lifePhoto":"HomeEditorial_lifePhoto","lifeStory":"HomeEditorial_lifeStory","bodyCopy":"HomeEditorial_bodyCopy","timeline":"HomeEditorial_timeline","performance":"HomeEditorial_performance","performanceHeading":"HomeEditorial_performanceHeading","benefitGrid":"HomeEditorial_benefitGrid","benefit":"HomeEditorial_benefit","collectionGrid":"HomeEditorial_collectionGrid","collectionIndex":"HomeEditorial_collectionIndex","everyoneLink":"HomeEditorial_everyoneLink","footer":"HomeEditorial_footer","newsletter":"HomeEditorial_newsletter","subscribeForm":"HomeEditorial_subscribeForm","footerMain":"HomeEditorial_footerMain","footerBrand":"HomeEditorial_footerBrand","footerLinks":"HomeEditorial_footerLinks","footerWordmark":"HomeEditorial_footerWordmark","footerBottom":"HomeEditorial_footerBottom"};
export default function LifeInMotion() {
    return (h("section", { className: styles.lifeSection },
        h("div", { className: styles.container },
            h("div", { className: styles.lifeGrid },
                h("div", { className: styles.lifePhoto },
                    h("img", { src: "/images/streetwear/street-hoodie.png", alt: "Model in MurhoPrints streetwear, ready for a day of movement", loading: "lazy" }),
                    h("span", null, "IN YOUR ELEMENT. AT YOUR PACE.")),
                h("div", { className: styles.lifeStory },
                    h("p", { className: styles.eyebrow }, "03 / LIFE IN MOTION"),
                    h("h2", { className: styles.heading },
                        "One set.",
                        h("br", null),
                        h("em", null, "No schedule.")),
                    h("p", { className: styles.intro },
                        "For the plans you make.",
                        h("br", null),
                        "And the ones you don\u2019t."),
                    h("p", { className: styles.bodyCopy }, "The morning commute. A coffee on the way. Taking the long route home. Meet the pieces that feel right through all of it."),
                    h("div", { className: styles.timeline }, [["08:00", "Find your rhythm", "Explore"], ["12:30", "Take it outside", "Move"], ["18:00", "Make it your own", "Unwind"]].map(([time, label, action]) => h("div", { key: time },
                        h("span", null, time),
                        h("p", null, label),
                        h("small", null, action)))),
                    h(Link, { href: "/shop", className: styles.textLink },
                        "Dress for your day ",
                        h(ArrowUpRight, { size: 18 })))))));
}
