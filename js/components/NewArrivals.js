import { h, Fragment } from "/js/runtime/dom.js";
import Link from "/js/runtime/navigation.js";
import { ArrowRight, ArrowUpRight } from "/js/runtime/icons.js";
const styles = {"container":"HomeEditorial_container","productSection":"HomeEditorial_productSection","collections":"HomeEditorial_collections","sectionHeading":"HomeEditorial_sectionHeading","eyebrow":"HomeEditorial_eyebrow","heading":"HomeEditorial_heading","intro":"HomeEditorial_intro","textLink":"HomeEditorial_textLink","productGrid":"HomeEditorial_productGrid","productCard":"HomeEditorial_productCard","productImage":"HomeEditorial_productImage","productAction":"HomeEditorial_productAction","productBadge":"HomeEditorial_productBadge","productMeta":"HomeEditorial_productMeta","productTitle":"HomeEditorial_productTitle","editCard":"HomeEditorial_editCard","collectionCard":"HomeEditorial_collectionCard","skeleton":"HomeEditorial_skeleton","emptyCollection":"HomeEditorial_emptyCollection","brandStrip":"HomeEditorial_brandStrip","stripMark":"HomeEditorial_stripMark","stripNote":"HomeEditorial_stripNote","lifeSection":"HomeEditorial_lifeSection","lifeGrid":"HomeEditorial_lifeGrid","lifePhoto":"HomeEditorial_lifePhoto","lifeStory":"HomeEditorial_lifeStory","bodyCopy":"HomeEditorial_bodyCopy","timeline":"HomeEditorial_timeline","performance":"HomeEditorial_performance","performanceHeading":"HomeEditorial_performanceHeading","benefitGrid":"HomeEditorial_benefitGrid","benefit":"HomeEditorial_benefit","collectionGrid":"HomeEditorial_collectionGrid","collectionIndex":"HomeEditorial_collectionIndex","everyoneLink":"HomeEditorial_everyoneLink","footer":"HomeEditorial_footer","newsletter":"HomeEditorial_newsletter","subscribeForm":"HomeEditorial_subscribeForm","footerMain":"HomeEditorial_footerMain","footerBrand":"HomeEditorial_footerBrand","footerLinks":"HomeEditorial_footerLinks","footerWordmark":"HomeEditorial_footerWordmark","footerBottom":"HomeEditorial_footerBottom"};
export default function NewArrivals({ products, loading = false, title = "The first move.", subtitle = "Fresh forms. Everyday favourites. Find your next go-to.", eyebrow = "01 / THE LATEST", editorial = false, getPromotion }) {
    return (h("section", { className: styles.productSection, "aria-label": title },
        h("div", { className: styles.container },
            h("div", { className: styles.sectionHeading },
                h("div", null,
                    h("p", { className: styles.eyebrow }, eyebrow),
                    h("h2", { className: styles.heading }, title),
                    h("p", { className: styles.intro }, subtitle)),
                h(Link, { className: styles.textLink, href: "/shop" },
                    "Explore the shop ",
                    h(ArrowUpRight, { size: 17 }))),
            h("div", { className: styles.productGrid },
                loading && Array.from({ length: editorial ? 3 : 4 }, (_, i) => h("div", { key: i, className: styles.skeleton, "aria-label": "Loading products" })),
                !loading && products.map((product) => {
                    const promotion = getPromotion?.(product.id);
                    const compareAtPrice = Number(product.compare_at_price || 0);
                    const productDiscountPercent = Number(product.discount_percent || 0) || (compareAtPrice > product.price ? Math.round(((compareAtPrice - product.price) / compareAtPrice) * 100) : 0);
                    const productDiscountLabel = compareAtPrice > product.price ? `${productDiscountPercent || "Sale"}${productDiscountPercent ? "% off" : ""}` : null;
                    const label = promotion?.discount_type === "percentage" && promotion.discount_value
                        ? `${Math.round(promotion.discount_value)}% off`
                        : promotion?.discount_type === "flat" && promotion.discount_value
                            ? `₹${promotion.discount_value.toLocaleString("en-IN")} off`
                            : promotion?.display_title || promotion?.title || productDiscountLabel;
                    return (h("article", { key: product.id, className: styles.productCard },
                        h(Link, { href: `/product/${product.id}`, className: styles.productImage, "aria-label": `View ${product.name}` },
                            h("img", { src: product.img, alt: product.name, loading: "lazy" }),
                            label && h("span", { className: styles.productBadge }, label),
                            h("span", { className: styles.productAction },
                                "Choose options ",
                                h(ArrowUpRight, { size: 16 }))),
                        h("div", { className: styles.productMeta },
                            h("span", null, product.subcategory || product.category || "Streetwear"),
                            h("span", null, product.colors?.length ? `${product.colors.length} colour${product.colors.length > 1 ? "s" : ""}` : "MurhoPrints essentials")),
                        h("div", { className: styles.productTitle },
                            h("h3", null,
                                h(Link, { href: `/product/${product.id}` }, product.name)),
                            h("span", null,
                                "\u20B9",
                                product.price.toLocaleString("en-IN"),
                                compareAtPrice > product.price && h("del", null,
                                    "\u20B9",
                                    compareAtPrice.toLocaleString("en-IN"))))));
                }),
                !loading && products.length === 0 && h("div", { className: styles.emptyCollection },
                    h("p", null, "The next move is yours."),
                    h("span", null, "Explore our collections and find your everyday essentials."),
                    h(Link, { href: "/shop", className: styles.textLink },
                        "Visit the shop ",
                        h(ArrowRight, { size: 16 }))),
                editorial && h(Link, { href: "/shop?category=women", className: styles.editCard },
                    h("img", { src: "/images/streetwear/street-tee.png", alt: "MurhoPrints streetwear on the city streets", loading: "lazy" }),
                    h("div", null,
                        h("p", { className: styles.eyebrow }, "THE MOVEMENT EDIT"),
                        h("h3", null,
                            "Good form.",
                            h("br", null),
                            "Great feeling."),
                        h("span", null,
                            "Find your fit ",
                            h(ArrowUpRight, { size: 18 }))))))));
}
