import { h, Fragment } from "/js/runtime/dom.js";
import { useCallback, useEffect, useMemo, useState } from "/js/runtime/dom.js";
import Link from "/js/runtime/navigation.js";
import { useRouter, useSearchParams } from "/js/runtime/navigation.js";
import { ArrowRight, ArrowUpRight, RotateCcw, Search, SlidersHorizontal, X } from "/js/runtime/icons.js";
import { colorName, colorToHex, extractColors, extractSizes, normalizeProducts, } from "/js/lib/catalog.js";
import { usePromotions } from "/js/hooks/usePromotions.js";
import CatalogCard from "./CatalogCard.js";
const styles = {"page":"Commerce_page","container":"Commerce_container","breadcrumb":"Commerce_breadcrumb","eyebrow":"Commerce_eyebrow","shopHero":"Commerce_shopHero","description":"Commerce_description","shopHeroImage":"Commerce_shopHeroImage","textLink":"Commerce_textLink","collectionTabs":"Commerce_collectionTabs","subcategorySection":"Commerce_subcategorySection","subcategoryHeading":"Commerce_subcategoryHeading","subcategoryGrid":"Commerce_subcategoryGrid","subcategoryCard":"Commerce_subcategoryCard","subcategoryIndex":"Commerce_subcategoryIndex","subcategoryTabs":"Commerce_subcategoryTabs","toolbar":"Commerce_toolbar","search":"Commerce_search","resultCount":"Commerce_resultCount","filterToggle":"Commerce_filterToggle","filters":"Commerce_filters","filterChoices":"Commerce_filterChoices","checkLabel":"Commerce_checkLabel","clearFilters":"Commerce_clearFilters","typeBar":"Commerce_typeBar","catalogGrid":"Commerce_catalogGrid","card":"Commerce_card","cardVisual":"Commerce_cardVisual","cardImage":"Commerce_cardImage","cardCta":"Commerce_cardCta","badge":"Commerce_badge","saveButton":"Commerce_saveButton","cardCategory":"Commerce_cardCategory","cardPrice":"Commerce_cardPrice","cardColors":"Commerce_cardColors","skeleton":"Commerce_skeleton","detailSkeleton":"Commerce_detailSkeleton","empty":"Commerce_empty","primaryButton":"Commerce_primaryButton","shopEnd":"Commerce_shopEnd","productLayout":"Commerce_productLayout","gallery":"Commerce_gallery","mainImage":"Commerce_mainImage","zoomImage":"Commerce_zoomImage","galleryLabel":"Commerce_galleryLabel","galleryControls":"Commerce_galleryControls","thumbnails":"Commerce_thumbnails","galleryCaption":"Commerce_galleryCaption","productDetails":"Commerce_productDetails","detailEyebrow":"Commerce_detailEyebrow","iconButton":"Commerce_iconButton","priceRow":"Commerce_priceRow","saleBadge":"Commerce_saleBadge","ratingLink":"Commerce_ratingLink","productDescription":"Commerce_productDescription","quickFacts":"Commerce_quickFacts","optionGroup":"Commerce_optionGroup","colorChoices":"Commerce_colorChoices","colorImageHint":"Commerce_colorImageHint","sizeChoices":"Commerce_sizeChoices","sizeGuideLink":"Commerce_sizeGuideLink","measurements":"Commerce_measurements","stockMessage":"Commerce_stockMessage","purchaseRow":"Commerce_purchaseRow","quantity":"Commerce_quantity","wishlistDetail":"Commerce_wishlistDetail","addedMessage":"Commerce_addedMessage","serviceLinks":"Commerce_serviceLinks","accordions":"Commerce_accordions","reviews":"Commerce_reviews","reviewIntro":"Commerce_reviewIntro","reviewScore":"Commerce_reviewScore","reviewContent":"Commerce_reviewContent","noReviews":"Commerce_noReviews","reviewCard":"Commerce_reviewCard","reviewStars":"Commerce_reviewStars","reviewForm":"Commerce_reviewForm","reviewActions":"Commerce_reviewActions","related":"Commerce_related","dialog":"Commerce_dialog","dialogBody":"Commerce_dialogBody","dialogClose":"Commerce_dialogClose","sizeTable":"Commerce_sizeTable","imageDialog":"Commerce_imageDialog","reviewGrid":"Commerce_reviewGrid","cartLayout":"Commerce_cartLayout"};
const cleanDescription = (description) => description?.replace(/\s*\[shared:[^\]]*\]/g, "").trim() || "";
const childSlug = (parentSlug, slug) => slug.startsWith(`${parentSlug}-`) ? slug.slice(parentSlug.length + 1) : slug;
const categoryLink = (parent, child) => child ? `/shop/${parent.slug}/${childSlug(parent.slug, child.slug)}` : `/shop/${parent.slug}`;
function linkedCategories(product) {
    return (product.product_categories || []).flatMap((link) => {
        if (!link.category)
            return [];
        return Array.isArray(link.category) ? link.category : [link.category];
    });
}
export default function ShopCatalog({ category, subcategory, initialProducts = null, initialCategories = null }) {
    const params = useSearchParams();
    const router = useRouter();
    const collection = category || params.get("category") || "";
    const [products, setProducts] = useState(initialProducts || []);
    const [categories, setCategories] = useState(initialCategories || []);
    const [loading, setLoading] = useState(!initialProducts || !initialCategories);
    const [error, setError] = useState(false);
    const [retry, setRetry] = useState(0);
    const [query, setQuery] = useState("");
    const [type, setType] = useState("All pieces");
    const [sort, setSort] = useState("manual");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sizes, setSizes] = useState(() => params.get("sizes")?.split(",").filter(Boolean) || []);
    const [colors, setColors] = useState(() => params.get("colors")?.split(",").filter(Boolean) || []);
    const [priceRange, setPriceRange] = useState("");
    const [onlyInStock, setOnlyInStock] = useState(false);
    const { getPromotion } = usePromotions();
    const rootCategories = useMemo(() => categories.filter((item) => !item.parent_id), [categories]);
    const currentRoot = useMemo(() => rootCategories.find((item) => item.slug.toLowerCase() === collection.toLowerCase()) || null, [collection, rootCategories]);
    const subcategories = useMemo(() => (currentRoot ? categories.filter((item) => item.parent_id === currentRoot.id) : []), [categories, currentRoot]);
    const currentSubcategory = useMemo(() => {
        if (!subcategory || !currentRoot)
            return null;
        const requestedSlug = subcategory.toLowerCase();
        return subcategories.find((item) => {
            const fullSlug = item.slug.toLowerCase();
            return fullSlug === requestedSlug || childSlug(currentRoot.slug, item.slug).toLowerCase() === requestedSlug;
        }) || null;
    }, [currentRoot, subcategories, subcategory]);
    const productMatchesRoot = useCallback((product) => {
        if (!collection)
            return true;
        if (!currentRoot)
            return false;
        return linkedCategories(product).some((item) => item.id === currentRoot.id || item.parent_id === currentRoot.id);
    }, [collection, currentRoot]);
    const productMatchesSubcategory = useCallback((product, target = currentSubcategory) => {
        if (!subcategory && !target)
            return true;
        if (!target)
            return false;
        return linkedCategories(product).some((item) => item.id === target.id);
    }, [currentSubcategory, subcategory]);
    const scopedProducts = useMemo(() => products.filter((product) => productMatchesRoot(product) && productMatchesSubcategory(product)), [products, productMatchesRoot, productMatchesSubcategory]);
    const typeOptions = ["All pieces", ...new Set(scopedProducts.map((product) => product.subcategory).filter(Boolean))];
    const sizeOptions = [...new Set(scopedProducts.flatMap((product) => extractSizes(product)))].sort((a, b) => {
        const order = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
        const first = order.indexOf(a);
        const second = order.indexOf(b);
        return (first < 0 ? 99 : first) - (second < 0 ? 99 : second) || a.localeCompare(b);
    });
    const colorOptions = [...new Set(scopedProducts.flatMap((product) => extractColors(product)))];
    const activeCount = sizes.length + colors.length + Number(Boolean(priceRange)) + Number(onlyInStock);
    const filtered = useMemo(() => {
        const result = scopedProducts.filter((product) => {
            const matchesQuery = `${product.name} ${product.category} ${product.subcategory}`.toLowerCase().includes(query.trim().toLowerCase());
            const matchesSize = !sizes.length || extractSizes(product).some((size) => sizes.includes(size));
            const matchesColor = !colors.length || extractColors(product).some((color) => colors.includes(color) || colors.includes(colorToHex(color)) || colors.includes(colorName(color)));
            const matchesPrice = !priceRange
                || (priceRange === "under" && product.price < 2000)
                || (priceRange === "mid" && product.price >= 2000 && product.price < 3000)
                || (priceRange === "over" && product.price >= 3000);
            const hasStock = product.product_variants?.length
                ? product.product_variants.some((variant) => variant.active !== false && Number(variant.stock_count) > 0)
                : Number(product.stock_count) > 0;
            return matchesQuery
                && (type === "All pieces" || product.subcategory === type)
                && matchesSize
                && matchesColor
                && matchesPrice
                && (!onlyInStock || hasStock);
        });
        if (sort === "manual")
            result.sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
        if (sort === "newest")
            result.sort((a, b) => (Date.parse(b.created_at || "") || 0) - (Date.parse(a.created_at || "") || 0));
        if (sort === "low")
            result.sort((a, b) => a.price - b.price);
        if (sort === "high")
            result.sort((a, b) => b.price - a.price);
        if (sort === "name")
            result.sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }, [scopedProducts, query, type, sizes, colors, priceRange, onlyInStock, sort]);
    const clear = () => {
        setQuery("");
        setType("All pieces");
        setSizes([]);
        setColors([]);
        setPriceRange("");
        setOnlyInStock(false);
    };
    const metadata = currentSubcategory || currentRoot;
    const title = currentSubcategory
        ? currentSubcategory.name
        : currentRoot
            ? `The ${currentRoot.name} edit.`
            : "Find your everyday.";
    const description = cleanDescription(metadata?.description)
        || "Considered fits. Effortless movement. Pieces that feel like you, wherever the day goes.";
    const categoryProductCount = (target) => products.filter((product) => {
        const linkedMatch = linkedCategories(product).some((item) => item.id === target.id);
        return productMatchesRoot(product) && linkedMatch;
    }).length;
    return (h("div", { className: styles.page },
        h("div", { className: styles.container },
            h("nav", { className: styles.breadcrumb, "aria-label": "Breadcrumb" },
                h(Link, { href: "/" }, "Home"),
                h("span", null, "/"),
                collection ? h(Link, { href: "/shop" }, "Shop") : h("span", null, "Shop"),
                collection && h(Fragment, null,
                    h("span", null, "/"),
                    subcategory ? h(Link, { href: currentRoot ? categoryLink(currentRoot) : `/shop?category=${collection}` }, currentRoot?.name || collection) : h("span", null, currentRoot?.name || collection)),
                subcategory && h(Fragment, null,
                    h("span", null, "/"),
                    h("span", null, currentSubcategory?.name || subcategory.replaceAll("-", " ")))),
            h("header", { className: styles.shopHero },
                h("div", null,
                    h("p", { className: styles.eyebrow }, "MURHOPRINTS / THE MOVEMENT WARDROBE"),
                    h("h1", null, title),
                    h("p", { className: styles.description }, description),
                    h(Link, { href: "/about", className: styles.textLink },
                        "Made with intention ",
                        h(ArrowUpRight, { size: 16 }))),
                h("div", { className: styles.shopHeroImage },
                    h("img", { src: metadata?.image_url || "/images/streetwear/street-tee.png", alt: metadata?.name || "MurhoPrints streetwear on city steps", fetchPriority: "high", decoding: "async" }),
                    h("span", null, "LESS RESISTANCE. MORE YOU."))),
            !subcategory && rootCategories.length > 0 && (h("nav", { className: styles.collectionTabs, "aria-label": "Shop collections" },
                h(Link, { href: "/shop", "aria-current": !collection ? "page" : undefined, onClick: clear }, "Shop all"),
                rootCategories.map((item) => (h(Link, { key: item.id, href: categoryLink(item), "aria-current": currentRoot?.id === item.id ? "page" : undefined, onClick: clear }, item.name))))),
            currentRoot && !subcategory && subcategories.length > 0 && (h("section", { className: styles.subcategorySection, "aria-labelledby": "subcategory-heading" },
                h("div", { className: styles.subcategoryHeading },
                    h("div", null,
                        h("p", { className: styles.eyebrow },
                            "EXPLORE ",
                            currentRoot.name),
                        h("h2", { id: "subcategory-heading" }, "Shop by category")),
                    h("span", null,
                        subcategories.length,
                        " collection",
                        subcategories.length === 1 ? "" : "s")),
                h("div", { className: styles.subcategoryGrid }, subcategories.map((item, index) => {
                    const itemCount = categoryProductCount(item);
                    return (h(Link, { key: item.id, href: categoryLink(currentRoot, item), className: styles.subcategoryCard },
                        h("img", { src: item.image_url || currentRoot.image_url || "/images/streetwear/street-tee.png", alt: "", loading: "lazy", decoding: "async" }),
                        h("span", { className: styles.subcategoryIndex }, String(index + 1).padStart(2, "0")),
                        h("div", null,
                            h("p", null,
                                itemCount,
                                " piece",
                                itemCount === 1 ? "" : "s"),
                            h("h3", null, item.name),
                            cleanDescription(item.description) && h("span", null, cleanDescription(item.description)),
                            h("strong", null,
                                "Explore ",
                                h(ArrowRight, { size: 15 })))));
                })))),
            currentRoot && subcategory && subcategories.length > 0 && (h("nav", { className: styles.subcategoryTabs, "aria-label": `${currentRoot.name} categories` },
                h(Link, { href: categoryLink(currentRoot) },
                    "All ",
                    currentRoot.name),
                subcategories.map((item) => (h(Link, { key: item.id, href: categoryLink(currentRoot, item), "aria-current": currentSubcategory?.id === item.id ? "page" : undefined }, item.name))))),
            h("div", { className: styles.toolbar },
                h("div", { className: styles.search },
                    h(Search, { size: 17 }),
                    h("input", { "aria-label": "Search products", placeholder: "Find your next favourite", value: query, onChange: (event) => setQuery(event.target.value) }),
                    query && h("button", { "aria-label": "Clear search", onClick: () => setQuery("") },
                        h(X, { size: 15 }))),
                h("span", { className: styles.resultCount, role: "status" }, loading ? "Loading pieces…" : `${filtered.length} piece${filtered.length === 1 ? "" : "s"}`),
                h("button", { className: styles.filterToggle, "aria-expanded": filtersOpen, "aria-controls": "catalog-filters", onClick: () => setFiltersOpen(!filtersOpen) },
                    h(SlidersHorizontal, { size: 16 }),
                    " Filters ",
                    activeCount > 0 && h("span", null, activeCount)),
                h("select", { "aria-label": "Sort products", value: sort, onChange: (event) => setSort(event.target.value) },
                    h("option", { value: "manual" }, "Featured order"),
                    h("option", { value: "newest" }, "Newest first"),
                    h("option", { value: "low" }, "Price: low to high"),
                    h("option", { value: "high" }, "Price: high to low"),
                    h("option", { value: "name" }, "Name: A to Z"))),
            filtersOpen && (h("div", { className: styles.filters, id: "catalog-filters" },
                h("fieldset", null,
                    h("legend", null, "Size"),
                    h("div", { className: styles.filterChoices }, sizeOptions.map((size) => h("button", { key: size, "aria-pressed": sizes.includes(size), onClick: () => setSizes((old) => old.includes(size) ? old.filter((item) => item !== size) : [...old, size]) }, size)))),
                h("fieldset", null,
                    h("legend", null, "Colour"),
                    h("div", { className: styles.filterChoices }, colorOptions.map((color) => h("button", { key: color, "aria-pressed": colors.includes(color) || colors.includes(colorToHex(color)) || colors.includes(colorName(color)), onClick: () => setColors((old) => old.some((item) => [color, colorToHex(color), colorName(color)].includes(item)) ? old.filter((item) => ![color, colorToHex(color), colorName(color)].includes(item)) : [...old, color]) },
                        h("i", { style: { background: colorToHex(color) } }),
                        colorName(color))))),
                h("fieldset", null,
                    h("legend", null, "Price & availability"),
                    h("select", { "aria-label": "Price range", value: priceRange, onChange: (event) => setPriceRange(event.target.value) },
                        h("option", { value: "" }, "All prices"),
                        h("option", { value: "under" }, "Under \u20B92,000"),
                        h("option", { value: "mid" }, "\u20B92,000\u2013\u20B92,999"),
                        h("option", { value: "over" }, "\u20B93,000 and above")),
                    h("label", { className: styles.checkLabel },
                        h("input", { type: "checkbox", checked: onlyInStock, onChange: (event) => setOnlyInStock(event.target.checked) }),
                        " In stock only")),
                h("button", { className: styles.clearFilters, onClick: clear },
                    h(RotateCcw, { size: 14 }),
                    " Reset filters"))),
            h("div", { className: styles.typeBar },
                typeOptions.map((option) => h("button", { key: option, "aria-pressed": type === option, onClick: () => setType(option) }, option.replaceAll("-", " "))),
                activeCount > 0 && h("button", { onClick: clear },
                    "Clear filters (",
                    activeCount,
                    ") ",
                    h(X, { size: 12 }))),
            loading ? (h("div", { className: styles.catalogGrid, "aria-label": "Loading products" }, Array.from({ length: 8 }, (_, index) => h("div", { key: index, className: styles.skeleton })))) : error ? (h("div", { className: styles.empty },
                h("h2", null, "A little pause."),
                h("p", null, "We couldn\u2019t load the collection. Please try again."),
                h("button", { className: styles.primaryButton, onClick: () => setRetry(retry + 1) }, "Try again"))) : filtered.length === 0 ? (h("div", { className: styles.empty },
                h(Search, { size: 30 }),
                h("h2", null, "Let\u2019s find your fit."),
                h("p", null, "No pieces match these filters. Try a different search or start fresh."),
                h("button", { className: styles.primaryButton, onClick: clear }, "Clear filters"),
                collection && h("button", { className: styles.textLink, onClick: () => { clear(); router.push("/shop"); } },
                    "Browse all collections ",
                    h(ArrowUpRight, { size: 16 })))) : (h("div", { className: styles.catalogGrid }, filtered.map((product) => h(CatalogCard, { key: product.id, product: product, promotion: getPromotion(product.id) })))),
            h("div", { className: styles.shopEnd },
                h("span", null, "YOUR PACE. YOUR EVERYDAY."),
                h("p", null,
                    "A little less resistance.",
                    h("br", null),
                    h("em", null, "A lot more possibility.")),
                h(Link, { href: "/", className: styles.textLink },
                    "Discover the world of MurhoPrints ",
                    h(ArrowUpRight, { size: 17 }))))));
}
