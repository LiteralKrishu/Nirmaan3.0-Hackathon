import { h, Fragment } from "/js/runtime/dom.js";
import Link from "/js/runtime/navigation.js";
import { Heart, ArrowUpRight } from "/js/runtime/icons.js";
import { useWishlist } from "/js/context/WishlistContext.js";
import { colorName, colorToHex, extractColors } from "/js/lib/catalog.js";
const styles = {"page":"Commerce_page","container":"Commerce_container","breadcrumb":"Commerce_breadcrumb","eyebrow":"Commerce_eyebrow","shopHero":"Commerce_shopHero","description":"Commerce_description","shopHeroImage":"Commerce_shopHeroImage","textLink":"Commerce_textLink","collectionTabs":"Commerce_collectionTabs","subcategorySection":"Commerce_subcategorySection","subcategoryHeading":"Commerce_subcategoryHeading","subcategoryGrid":"Commerce_subcategoryGrid","subcategoryCard":"Commerce_subcategoryCard","subcategoryIndex":"Commerce_subcategoryIndex","subcategoryTabs":"Commerce_subcategoryTabs","toolbar":"Commerce_toolbar","search":"Commerce_search","resultCount":"Commerce_resultCount","filterToggle":"Commerce_filterToggle","filters":"Commerce_filters","filterChoices":"Commerce_filterChoices","checkLabel":"Commerce_checkLabel","clearFilters":"Commerce_clearFilters","typeBar":"Commerce_typeBar","catalogGrid":"Commerce_catalogGrid","card":"Commerce_card","cardVisual":"Commerce_cardVisual","cardImage":"Commerce_cardImage","cardCta":"Commerce_cardCta","badge":"Commerce_badge","saveButton":"Commerce_saveButton","cardCategory":"Commerce_cardCategory","cardPrice":"Commerce_cardPrice","cardColors":"Commerce_cardColors","skeleton":"Commerce_skeleton","detailSkeleton":"Commerce_detailSkeleton","empty":"Commerce_empty","primaryButton":"Commerce_primaryButton","shopEnd":"Commerce_shopEnd","productLayout":"Commerce_productLayout","gallery":"Commerce_gallery","mainImage":"Commerce_mainImage","zoomImage":"Commerce_zoomImage","galleryLabel":"Commerce_galleryLabel","galleryControls":"Commerce_galleryControls","thumbnails":"Commerce_thumbnails","galleryCaption":"Commerce_galleryCaption","productDetails":"Commerce_productDetails","detailEyebrow":"Commerce_detailEyebrow","iconButton":"Commerce_iconButton","priceRow":"Commerce_priceRow","saleBadge":"Commerce_saleBadge","ratingLink":"Commerce_ratingLink","productDescription":"Commerce_productDescription","quickFacts":"Commerce_quickFacts","optionGroup":"Commerce_optionGroup","colorChoices":"Commerce_colorChoices","colorImageHint":"Commerce_colorImageHint","sizeChoices":"Commerce_sizeChoices","sizeGuideLink":"Commerce_sizeGuideLink","measurements":"Commerce_measurements","stockMessage":"Commerce_stockMessage","purchaseRow":"Commerce_purchaseRow","quantity":"Commerce_quantity","wishlistDetail":"Commerce_wishlistDetail","addedMessage":"Commerce_addedMessage","serviceLinks":"Commerce_serviceLinks","accordions":"Commerce_accordions","reviews":"Commerce_reviews","reviewIntro":"Commerce_reviewIntro","reviewScore":"Commerce_reviewScore","reviewContent":"Commerce_reviewContent","noReviews":"Commerce_noReviews","reviewCard":"Commerce_reviewCard","reviewStars":"Commerce_reviewStars","reviewForm":"Commerce_reviewForm","reviewActions":"Commerce_reviewActions","related":"Commerce_related","dialog":"Commerce_dialog","dialogBody":"Commerce_dialogBody","dialogClose":"Commerce_dialogClose","sizeTable":"Commerce_sizeTable","imageDialog":"Commerce_imageDialog","reviewGrid":"Commerce_reviewGrid","cartLayout":"Commerce_cartLayout"};
export default function CatalogCard({ product, promotion }) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const saved = isInWishlist(product.id);
    const colors = extractColors(product);
    const inStock = product.product_variants?.length ? product.product_variants.some(v => v.active !== false && Number(v.stock_count) > 0) : Number(product.stock_count) > 0;
    const compareAtPrice = Number(product.compare_at_price || 0);
    const productDiscountPercent = Number(product.discount_percent || 0) || (compareAtPrice > product.price ? Math.round(((compareAtPrice - product.price) / compareAtPrice) * 100) : 0);
    const productDiscountBadge = compareAtPrice > product.price ? `${productDiscountPercent || "Sale"}${productDiscountPercent ? "% off" : ""}` : null;
    const promotionBadge = promotion?.discount_type === "percentage" && promotion.discount_value
        ? `${Math.round(promotion.discount_value)}% off`
        : promotion?.discount_type === "flat" && promotion.discount_value
            ? `₹${promotion.discount_value.toLocaleString("en-IN")} off`
            : promotion?.display_title || promotion?.title;
    const badge = !inStock ? "Sold out" : promotionBadge || productDiscountBadge;
    return h("article", { className: styles.card },
        h("div", { className: styles.cardVisual },
            h(Link, { href: `/product/${product.id}`, className: styles.cardImage, "aria-label": `View ${product.name}` },
                h("img", { src: product.img, alt: product.name, loading: "lazy", decoding: "async" }),
                h("span", { className: styles.cardCta },
                    "Choose options ",
                    h(ArrowUpRight, { size: 16 }))),
            badge && h("span", { className: styles.badge }, badge),
            h("button", { className: styles.saveButton, "aria-label": `${saved ? "Remove" : "Save"} ${product.name}${saved ? " from wishlist" : " to wishlist"}`, "aria-pressed": saved, onClick: () => saved ? removeFromWishlist(product.id) : addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.img, category: product.category }) },
                h(Heart, { size: 17, fill: saved ? "currentColor" : "none" }))),
        h("p", { className: styles.cardCategory },
            product.category,
            " ",
            h("span", null, product.subcategory?.replaceAll("-", " "))),
        h("h3", null,
            h(Link, { href: `/product/${product.id}` }, product.name)),
        h("div", { className: styles.cardPrice },
            "\u20B9",
            product.price.toLocaleString("en-IN"),
            Number(product.compare_at_price) > product.price && h("del", null,
                "\u20B9",
                Number(product.compare_at_price).toLocaleString("en-IN"))),
        colors.length > 0 && h("div", { className: styles.cardColors, "aria-label": `Available in ${colors.map(colorName).join(", ")}` },
            colors.slice(0, 4).map(color => h("span", { key: color, title: colorName(color), style: { backgroundColor: colorToHex(color) } })),
            h("small", null,
                colors.length,
                " colour",
                colors.length > 1 ? "s" : "")));
}
