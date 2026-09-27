import { products } from "/js/data/products.js";
import { h, Fragment } from "/js/runtime/dom.js";
import { useState, useEffect, useRef } from "/js/runtime/dom.js";
import { ArrowUpRight, Heart, Share2, Star, ChevronLeft, ChevronRight, Plus, Minus, X, Ruler, Check, ShoppingBag, Truck, MessageCircle, Maximize2 } from "/js/runtime/icons.js";
import { useCart } from "/js/context/CartContext.js";
import { useWishlist } from "/js/context/WishlistContext.js";
import Link from "/js/runtime/navigation.js";
import { useRouter } from "/js/runtime/navigation.js";
import toast from "/js/runtime/toast.js";
import { colorToHex, colorName, extractColors, extractSizes, findVariant, normalizeProduct, normalizeProducts, parseProductSizes } from "/js/lib/catalog.js";
import CatalogCard from "/js/components/CatalogCard.js";
import { usePromotions } from "/js/hooks/usePromotions.js";
const styles = {"page":"Commerce_page","container":"Commerce_container","breadcrumb":"Commerce_breadcrumb","eyebrow":"Commerce_eyebrow","shopHero":"Commerce_shopHero","description":"Commerce_description","shopHeroImage":"Commerce_shopHeroImage","textLink":"Commerce_textLink","collectionTabs":"Commerce_collectionTabs","subcategorySection":"Commerce_subcategorySection","subcategoryHeading":"Commerce_subcategoryHeading","subcategoryGrid":"Commerce_subcategoryGrid","subcategoryCard":"Commerce_subcategoryCard","subcategoryIndex":"Commerce_subcategoryIndex","subcategoryTabs":"Commerce_subcategoryTabs","toolbar":"Commerce_toolbar","search":"Commerce_search","resultCount":"Commerce_resultCount","filterToggle":"Commerce_filterToggle","filters":"Commerce_filters","filterChoices":"Commerce_filterChoices","checkLabel":"Commerce_checkLabel","clearFilters":"Commerce_clearFilters","typeBar":"Commerce_typeBar","catalogGrid":"Commerce_catalogGrid","card":"Commerce_card","cardVisual":"Commerce_cardVisual","cardImage":"Commerce_cardImage","cardCta":"Commerce_cardCta","badge":"Commerce_badge","saveButton":"Commerce_saveButton","cardCategory":"Commerce_cardCategory","cardPrice":"Commerce_cardPrice","cardColors":"Commerce_cardColors","skeleton":"Commerce_skeleton","detailSkeleton":"Commerce_detailSkeleton","empty":"Commerce_empty","primaryButton":"Commerce_primaryButton","shopEnd":"Commerce_shopEnd","productLayout":"Commerce_productLayout","gallery":"Commerce_gallery","mainImage":"Commerce_mainImage","zoomImage":"Commerce_zoomImage","galleryLabel":"Commerce_galleryLabel","galleryControls":"Commerce_galleryControls","thumbnails":"Commerce_thumbnails","galleryCaption":"Commerce_galleryCaption","productDetails":"Commerce_productDetails","detailEyebrow":"Commerce_detailEyebrow","iconButton":"Commerce_iconButton","priceRow":"Commerce_priceRow","saleBadge":"Commerce_saleBadge","ratingLink":"Commerce_ratingLink","productDescription":"Commerce_productDescription","quickFacts":"Commerce_quickFacts","optionGroup":"Commerce_optionGroup","colorChoices":"Commerce_colorChoices","colorImageHint":"Commerce_colorImageHint","sizeChoices":"Commerce_sizeChoices","sizeGuideLink":"Commerce_sizeGuideLink","measurements":"Commerce_measurements","stockMessage":"Commerce_stockMessage","purchaseRow":"Commerce_purchaseRow","quantity":"Commerce_quantity","wishlistDetail":"Commerce_wishlistDetail","addedMessage":"Commerce_addedMessage","serviceLinks":"Commerce_serviceLinks","accordions":"Commerce_accordions","reviews":"Commerce_reviews","reviewIntro":"Commerce_reviewIntro","reviewScore":"Commerce_reviewScore","reviewContent":"Commerce_reviewContent","noReviews":"Commerce_noReviews","reviewCard":"Commerce_reviewCard","reviewStars":"Commerce_reviewStars","reviewForm":"Commerce_reviewForm","reviewActions":"Commerce_reviewActions","related":"Commerce_related","dialog":"Commerce_dialog","dialogBody":"Commerce_dialogBody","dialogClose":"Commerce_dialogClose","sizeTable":"Commerce_sizeTable","imageDialog":"Commerce_imageDialog","reviewGrid":"Commerce_reviewGrid","cartLayout":"Commerce_cartLayout"};
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const sizeOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const colorKey = (value) => colorName(String(value || "")).trim().toUpperCase();
const initialColor = (product) => {
    if (!product)
        return "";
    const colors = extractColors(product);
    return colors.find(color => product.product_variants?.some(v => v.active !== false && Number(v.stock_count) > 0 && colorKey(v.color) === colorKey(color))) || colors[0] || "";
};
export default function ProductDetailClient({ productId, initialProduct }) {
    const { addToCart, cartItems, toggleCart } = useCart();
    const router = useRouter();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { getPromotion } = usePromotions();
    const [product, setProduct] = useState(initialProduct);
    const related = products.filter(p => p.id !== productId).slice(0, 4);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState(() => initialColor(initialProduct));
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [reviewerName, setReviewerName] = useState("");
    const [reviewerEmail, setReviewerEmail] = useState("");
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const sizeDialog = useRef(null);
    const imageDialog = useRef(null);
    const availableColors = product ? extractColors(product) : [];
    const hasVariantColors = Boolean(product?.product_variants?.some(v => v.active !== false && Boolean(v.color)));
    const colorConfigurationMissing = hasVariantColors && availableColors.length === 0;
    const availableSizes = (product && !colorConfigurationMissing ? extractSizes(product, selectedColor) : []).sort((a, b) => (sizeOrder.indexOf(a) < 0 ? 99 : sizeOrder.indexOf(a)) - (sizeOrder.indexOf(b) < 0 ? 99 : sizeOrder.indexOf(b)) || a.localeCompare(b));
    const sortedProductImages = product ? [...(product.product_images || [])].sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)) || Number(a.sort_order || 0) - Number(b.sort_order || 0)) : [];
    const selectedColorKey = colorKey(selectedColor);
    const imageColorKey = (image) => colorKey(image.color);
    const selectedColorImages = selectedColorKey ? sortedProductImages.filter(img => imageColorKey(img) === selectedColorKey) : [];
    const sharedImages = sortedProductImages.filter(img => !img.is_primary && !imageColorKey(img));
    const fallbackPrimaryImage = sortedProductImages.find(img => img.is_primary);
    const visibleImageRecords = selectedColorKey
        ? selectedColorImages.length
            ? [...selectedColorImages, ...sharedImages]
            : [...(fallbackPrimaryImage ? [fallbackPrimaryImage] : []), ...sharedImages]
        : sortedProductImages;
    const images = product ? Array.from(new Set(visibleImageRecords.map(i => i.public_url || i.storage_path).filter((url) => Boolean(url)))) : [];
    if (!images.length && product?.img)
        images.push(product.img);
    const selectedProductImage = images[activeImageIndex] || product?.img || "";
    const sizeDimensions = parseProductSizes(product?.rawSizes);
    const currentDimension = sizeDimensions.find(d => d.size === selectedSize);
    const selectedVariant = product && !colorConfigurationMissing ? findVariant(product, selectedSize, selectedColor) : undefined;
    const hasVariants = Boolean(product?.product_variants?.length);
    const needsSize = availableSizes.length > 0 && !selectedSize;
    const hasSelection = !colorConfigurationMissing && !needsSize && (!availableColors.length || Boolean(selectedColor));
    const stockLeft = colorConfigurationMissing ? 0 : hasVariants ? Number(selectedVariant?.stock_count || 0) : Number(product?.stock_count || 0);
    const inCart = cartItems.filter(item => item.id === product?.id && (selectedVariant?.id ? item.variantId === selectedVariant.id : item.size === selectedSize && item.color === selectedColor)).reduce((total, item) => total + item.quantity, 0);
    const remainingStock = Math.max(0, stockLeft - inCart);
    const canAddToCart = hasSelection && (!hasVariants || Boolean(selectedVariant)) && remainingStock > 0;
    const price = Number(selectedVariant?.price_override ?? product?.price ?? 0);
    const priceLabel = `₹${price.toLocaleString("en-IN")}`;
    const compareAtPrice = Number(product?.compare_at_price || 0);
    const productDiscountPercent = compareAtPrice > price ? Number(product?.discount_percent || 0) || Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
    const productDetailCopy = product?.product_details || product?.description || product?.desc || "Explore the available sizes and colours to find your fit.";
    const materialDetailCopy = product?.material_details || "";
    const fitDetailCopy = product?.fit_details || product?.size_guide_html || "Check the product size guide before choosing your fit.";
    const careDetailCopy = product?.care_instructions || "Follow the care label on your garment for washing and drying instructions specific to this piece.";
    const reviews = product?.product_reviews || [];
    const rating = reviews.length ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length : 0;
    const stockForSize = (size) => { if (!product)
        return 0; return hasVariants ? Number(findVariant(product, size, selectedColor)?.stock_count || 0) : Number(product.stock_count || 0); };
    const changeImage = (direction) => setActiveImageIndex(index => (index + direction + images.length) % images.length);
    const selectColor = (color) => { setSelectedColor(color); setSelectedSize(""); setQuantity(1); setAddedToCart(false); setActiveImageIndex(0); };
    const handleAddToCart = () => {
        if (!product || !canAddToCart)
            return;
        addToCart({ id: product.id, name: product.name, price, image: selectedProductImage || product.img, quantity: Math.min(quantity, remainingStock), size: selectedSize, color: selectedColor, variantId: selectedVariant?.id, sku: selectedVariant?.sku || undefined, stockLeft });
        setAddedToCart(true);
        setQuantity(1);
    };
    const handleBuildFit = () => {
        if (!product || !canAddToCart)
            return;
        handleAddToCart();
        toggleCart();
    };
    const toggleWishlist = () => {
        if (!product)
            return;
        if (isInWishlist(product.id))
            removeFromWishlist(product.id);
        else
            addToWishlist({ id: product.id, name: product.name, price: product.price, image: selectedProductImage || product.img, category: product.category });
    };
    const shareProduct = async () => {
        if (!product)
            return;
        try {
            if (navigator.share)
                await navigator.share({ title: product.name, url: window.location.href });
            else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Product link copied");
            }
        }
        catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError"))
                toast.error("Unable to share. You can copy the link from your browser.");
        }
    };
    const handleSubmitReview = async (event) => {
        event.preventDefault();
        if (!product)
            return;
        const formData = new FormData(event.currentTarget);
        const submittedReview = String(formData.get("review") || reviewText).trim();
        const submittedTitle = String(formData.get("title") || reviewTitle).trim();
        const submittedName = String(formData.get("reviewerName") || reviewerName).trim();
        const submittedEmail = String(formData.get("reviewerEmail") || reviewerEmail).trim();
        const submittedRating = Number(formData.get("rating") || reviewRating);
        if (!submittedReview) {
            toast.error("Write a short review first.");
            return;
        }
        setProduct(previous => ({ ...previous, product_reviews: [...(previous.product_reviews || []), {id: String(Date.now()), rating: submittedRating, title: submittedTitle, review: submittedReview, profiles: { full_name: submittedName || 'Guest' }, created_at: new Date().toISOString()}] }));
        toast.success("Review preview added for this visit. Nothing was submitted.");
        setIsReviewFormOpen(false); setReviewTitle(""); setReviewText("");
    };
    if (isLoading)
        return h("div", { className: styles.page },
            h("div", { className: styles.container },
                h("p", { className: styles.breadcrumb, role: "status" }, "Finding your next favourite\u2026"),
                h("div", { className: styles.productLayout },
                    h("div", { className: styles.skeleton }),
                    h("div", { className: styles.detailSkeleton }))));
    if (!product)
        return h("div", { className: styles.page },
            h("div", { className: styles.empty },
                h("p", { className: styles.eyebrow }, "MURHOPRINTS / THE COLLECTION"),
                h("h1", null, "This piece is unavailable."),
                h("p", null, "Choose one of the six pieces in our demo collection."),
                h(Link, { href: "/shop", className: styles.textLink },
                    "Explore the collection ",
                    h(ArrowUpRight, { size: 16 }))));
    const saved = isInWishlist(product.id);
    const buttonLabel = colorConfigurationMissing ? "Currently unavailable" : needsSize ? "Select your size" : !canAddToCart ? (inCart > 0 && stockLeft > 0 ? "All available pieces are in your bag" : "Out of stock") : (addedToCart && inCart > 0) ? "Add another" : "Add to bag";
    return h("div", { className: styles.page },
        h("div", { className: styles.container },
            h("nav", { className: styles.breadcrumb, "aria-label": "Breadcrumb" },
                h(Link, { href: "/" }, "Home"),
                h("span", null, "/"),
                h(Link, { href: "/shop" }, "Shop"),
                h("span", null, "/"),
                h(Link, { href: product.category === "unisex" ? "/shop" : `/shop?category=${product.category}` }, product.category),
                h("span", null, "/"),
                h("span", null, product.name)),
            h("div", { className: styles.productLayout },
                h("section", { className: styles.gallery, "aria-label": "Product images" },
                    h("div", { className: styles.mainImage },
                        h("button", { className: styles.zoomImage, onClick: () => imageDialog.current?.showModal(), "aria-label": "Enlarge product image" },
                            h("img", { src: images[activeImageIndex], alt: `${product.name}, view ${activeImageIndex + 1}`, fetchPriority: "high", decoding: "async" }),
                            h("span", null,
                                h(Maximize2, { size: 17 }),
                                " A closer look")),
                        h("span", { className: styles.galleryLabel }, selectedColorImages.length ? `${colorName(selectedColor)} VIEW` : "MURHOPRINTS / EVERYDAY ESSENTIALS"),
                        images.length > 1 && h("div", { className: styles.galleryControls },
                            h("button", { onClick: () => changeImage(-1), "aria-label": "Previous image" },
                                h(ChevronLeft, { size: 18 })),
                            h("span", { "aria-live": "polite" },
                                activeImageIndex + 1,
                                " / ",
                                images.length),
                            h("button", { onClick: () => changeImage(1), "aria-label": "Next image" },
                                h(ChevronRight, { size: 18 })))),
                    images.length > 1 && h("div", { className: styles.thumbnails }, images.map((image, index) => h("button", { key: image, onClick: () => setActiveImageIndex(index), "aria-label": `View image ${index + 1}`, "aria-pressed": activeImageIndex === index },
                        h("img", { src: image, alt: "", loading: "lazy", decoding: "async" })))),
                    h("div", { className: styles.galleryCaption },
                        h("span", null, "DESIGNED TO MOVE WITH YOU."),
                        h("span", null,
                            "Resist nothing. ",
                            h(ArrowUpRight, { size: 15 })))),
                h("section", { className: styles.productDetails, "aria-label": "Product details" },
                    h("div", { className: styles.detailEyebrow },
                        h("p", { className: styles.eyebrow },
                            product.category,
                            " / ",
                            product.subcategory.replaceAll("-", " ") || "Essentials"),
                        h("button", { className: styles.iconButton, onClick: shareProduct, "aria-label": "Share product" },
                            h(Share2, { size: 17 }))),
                    h("h1", null, product.name),
                    h("div", { className: styles.priceRow },
                        h("span", null, priceLabel),
                        compareAtPrice > price && h("del", null,
                            "\u20B9",
                            compareAtPrice.toLocaleString("en-IN")),
                        productDiscountPercent > 0 && h("strong", { className: styles.saleBadge },
                            Math.round(productDiscountPercent),
                            "% off")),
                    h("a", { className: styles.ratingLink, href: "#customer-reviews" },
                        h(Star, { size: 13, fill: reviews.length ? "currentColor" : "none" }),
                        reviews.length ? `${rating.toFixed(1)} · ${reviews.length} review${reviews.length === 1 ? "" : "s"}` : "Be the first to share your experience"),
                    h("p", { className: styles.productDescription }, product.desc || product.description || "A considered addition to your everyday rotation."),
                    h("div", { className: styles.quickFacts },
                        h("span", null,
                            "Original print concepts"),
                        h("span", null,
                            product.brand || "MurhoPrints",
                            " studio"),
                        h("span", null, stockLeft > 0 ? "Demo collection" : "Preview only")),
                    availableColors.length > 0 && h("fieldset", { className: styles.optionGroup },
                        h("legend", null,
                            "Colour ",
                            h("span", null, colorName(selectedColor))),
                        h("div", { className: styles.colorChoices }, availableColors.map(color => { const variants = product.product_variants?.filter(v => v.active !== false && colorKey(v.color) === colorKey(color)) || []; const soldOut = hasVariants && !variants.some(v => Number(v.stock_count) > 0); return h("button", { key: color, disabled: soldOut, "aria-label": `${colorName(color)}${soldOut ? ", sold out" : ""}`, "aria-pressed": colorKey(selectedColor) === colorKey(color), title: colorName(color), onClick: () => selectColor(color) },
                            h("span", { style: { backgroundColor: colorToHex(color) } }),
                            colorKey(selectedColor) === colorKey(color) && h(Check, { size: 13 })); })),
                        h("p", { className: styles.colorImageHint }, selectedColorImages.length ? `Showing ${colorName(selectedColor)} images first.` : "Showing the complete image set for this colour.")),
                    availableSizes.length > 0 && h("fieldset", { className: styles.optionGroup },
                        h("legend", null,
                            "Size ",
                            h("span", null, selectedSize || "Choose your fit")),
                        h("button", { className: styles.sizeGuideLink, onClick: () => sizeDialog.current?.showModal() },
                            h(Ruler, { size: 14 }),
                            " Size guide"),
                        h("div", { className: styles.sizeChoices }, availableSizes.map(size => h("button", { key: size, disabled: stockForSize(size) <= 0, "aria-pressed": selectedSize === size, "aria-label": `Size ${size}${stockForSize(size) <= 0 ? ", sold out" : ""}`, onClick: () => { setSelectedSize(size); setQuantity(1); setAddedToCart(false); } }, size))),
                        currentDimension && currentDimension.dimensions.length > 0 && h("p", { className: styles.measurements }, currentDimension.dimensions.map(d => `${d.label}: ${d.value}`).join(" · "))),
                    h("p", { className: styles.stockMessage, role: "status" }, colorConfigurationMissing ? "Color options are currently unavailable." : needsSize ? "Select a size to check availability." : stockLeft > 0 ? remainingStock === 0 ? "You have all available stock in your bag." : stockLeft <= 5 ? `Only ${stockLeft} left in this size and colour.` : "In stock. Ready for your next move." : "This combination is currently unavailable."),
                    h("div", { className: styles.purchaseRow, style: { flexWrap: "wrap" } },
                        h("div", { className: styles.quantity },
                            h("button", { "aria-label": "Decrease quantity", disabled: quantity <= 1, onClick: () => setQuantity(quantity - 1) },
                                h(Minus, { size: 14 })),
                            h("span", { "aria-live": "polite" }, quantity),
                            h("button", { "aria-label": "Increase quantity", disabled: !canAddToCart || quantity >= remainingStock, onClick: () => setQuantity(quantity + 1) },
                                h(Plus, { size: 14 }))),
                        h("button", { className: styles.primaryButton, disabled: !canAddToCart, onClick: handleAddToCart, style: { flex: 1, minWidth: "120px" } },
                            h(ShoppingBag, { size: 17 }),
                            buttonLabel),
                        h("button", { className: styles.primaryButton, disabled: !canAddToCart, onClick: handleBuildFit, style: { flex: 1, minWidth: "120px" } },
                            "View bag ",
                            h(ArrowUpRight, { size: 17 })),
                        h("button", { className: styles.wishlistDetail, onClick: toggleWishlist, "aria-label": saved ? "Remove from wishlist" : "Save to wishlist", "aria-pressed": saved },
                            h(Heart, { size: 19, fill: saved ? "currentColor" : "none" }))),
                    addedToCart && inCart > 0 && h("div", { className: styles.addedMessage, role: "status" },
                        h("span", null,
                            h(Check, { size: 15 }),
                            " Added to your bag"),
                        h("button", { onClick: toggleCart },
                            "View bag ",
                            h(ArrowUpRight, { size: 15 }))),
                    h("div", { className: styles.serviceLinks },
                        h(Link, { href: "/shipping-returns" },
                            h(Truck, { size: 19 }),
                            h("span", null,
                                "Delivery & returns",
                                h("small", null, "Everything you need to know")),
                            h(ArrowUpRight, { size: 14 })),
                        h(Link, { href: "/contact-us" },
                            h(MessageCircle, { size: 19 }),
                            h("span", null,
                                "Need a hand with fit?",
                                h("small", null, "Explore the contact preview")),
                            h(ArrowUpRight, { size: 14 }))),
                    h("div", { className: styles.accordions },
                        h("details", { open: true },
                            h("summary", null,
                                "The details ",
                                h(Plus, { size: 15 })),
                            h("p", null, productDetailCopy),
                            h("dl", null,
                                h("div", null,
                                    h("dt", null, "Collection"),
                                    h("dd", null, product.category)),
                                product.subcategory && h("div", null,
                                    h("dt", null, "Type"),
                                    h("dd", null, product.subcategory.replaceAll("-", " "))),
                                materialDetailCopy && h("div", null,
                                    h("dt", null, "Material"),
                                    h("dd", null, materialDetailCopy)),
                                hasSelection && selectedVariant?.sku && h("div", null,
                                    h("dt", null, "SKU"),
                                    h("dd", null, selectedVariant.sku)))),
                        h("details", null,
                            h("summary", null,
                                "Fit & sizing ",
                                h(Plus, { size: 15 })),
                            h("p", null,
                                fitDetailCopy,
                                " ",
                                h(Link, { href: "/contact-us" }, "Need fit help?"))),
                        h("details", null,
                            h("summary", null,
                                "Looking after your piece ",
                                h(Plus, { size: 15 })),
                            h("p", null, careDetailCopy))))),
            h("section", { className: styles.reviews, id: "customer-reviews" },
                h("div", { className: styles.reviewIntro },
                    h("p", { className: styles.eyebrow }, "FROM THE MOVEMENT"),
                    h("h2", null,
                        "Worn. Loved.",
                        h("br", null),
                        h("em", null, "Talked about.")),
                    reviews.length > 0 ? h("div", { className: styles.reviewScore },
                        rating.toFixed(1),
                        h("span", null,
                            "out of 5",
                            h("br", null),
                            reviews.length,
                            " customer review",
                            reviews.length === 1 ? "" : "s")) : h("p", null,
                        "Every experience starts a conversation.",
                        h("br", null),
                        "Be the first to share yours."),
                    h("button", { className: styles.textLink, "aria-expanded": isReviewFormOpen, "aria-controls": "review-form", onClick: () => setIsReviewFormOpen(!isReviewFormOpen) },
                        isReviewFormOpen ? "Close review form" : "Write a review",
                        h(ArrowUpRight, { size: 16 }))),
                h("div", { className: styles.reviewContent },
                    isReviewFormOpen && h("form", { id: "review-form", className: styles.reviewForm, onSubmit: handleSubmitReview },
                        h("h3", null, "Your experience matters."),
                        h("p", null, "Try a review preview. It stays on this page and is not submitted."),
                        h("div", null,
                            h("label", null,
                                "Your name",
                                h("input", { name: "reviewerName", autoComplete: "name", value: reviewerName, onChange: e => setReviewerName(e.target.value) })),
                            h("label", null,
                                "Email address",
                                h("input", { name: "reviewerEmail", type: "email", autoComplete: "email", value: reviewerEmail, onChange: e => setReviewerEmail(e.target.value) }))),
                        h("div", null,
                            h("label", null,
                                "Review title",
                                h("input", { name: "title", value: reviewTitle, onChange: e => setReviewTitle(e.target.value) })),
                            h("label", null,
                                "Rating",
                                h("select", { name: "rating", value: reviewRating, onChange: e => setReviewRating(Number(e.target.value)) }, [5, 4, 3, 2, 1].map(r => h("option", { value: r, key: r },
                                    r,
                                    " star",
                                    r === 1 ? "" : "s"))))),
                        h("label", null,
                            "Your review",
                            h("textarea", { name: "review", rows: 4, required: true, value: reviewText, onChange: e => setReviewText(e.target.value) })),
                        h("div", { className: styles.reviewActions },
                            h("button", { type: "button", className: styles.textLink, onClick: () => setIsReviewFormOpen(false) }, "Cancel"),
                            h("button", { className: styles.primaryButton, disabled: isSubmittingReview }, isSubmittingReview ? "Previewing…" : "Preview review"))),
                    reviews.length === 0 ? h("div", { className: styles.noReviews },
                        h(MessageCircle, { size: 28, strokeWidth: 1 }),
                        h("h3", null, "The conversation starts with you."),
                        h("p", null, "Tell us about the fit, the feel, and where you wear it.")) : reviews.map(review => h("article", { className: styles.reviewCard, key: review.id },
                        h("div", null,
                            h("strong", null, review.profiles?.full_name || "MurhoPrints customer"),
                            h("span", null, review.created_at ? new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "")),
                        h("p", { "aria-label": `${review.rating} out of 5 stars`, className: styles.reviewStars }, Array.from({ length: 5 }, (_, i) => h(Star, { key: i, size: 13, fill: i < review.rating ? "currentColor" : "none" }))),
                        review.title && h("h3", null, review.title),
                        h("p", null, review.review))))),
            related.length > 0 && h("section", { className: styles.related },
                h("div", null,
                    h("div", null,
                        h("p", { className: styles.eyebrow }, "GOOD COMPANY"),
                        h("h2", null, "Also in your element.")),
                    h(Link, { href: product.category === "unisex" ? "/shop" : `/shop?category=${product.category}`, className: styles.textLink },
                        "Explore the edit ",
                        h(ArrowUpRight, { size: 17 }))),
                h("div", { className: styles.catalogGrid }, related.map(p => h(CatalogCard, { key: p.id, product: p, promotion: getPromotion(p.id) }))))),
        h("dialog", { ref: sizeDialog, className: styles.dialog, onClick: e => { if (e.target === e.currentTarget)
                sizeDialog.current?.close(); }, "aria-labelledby": "size-guide-title" },
            h("div", { className: styles.dialogBody },
                h("button", { className: styles.dialogClose, "aria-label": "Close size guide", onClick: () => sizeDialog.current?.close() },
                    h(X, { size: 20 })),
                h("p", { className: styles.eyebrow }, "A LITTLE GUIDANCE"),
                h("h2", { id: "size-guide-title" }, "Find your fit."),
                h("p", null, product.name),
                sizeDimensions.some(s => s.dimensions.length > 0) ? h("div", { className: styles.sizeTable },
                    h("table", null,
                        h("caption", null, "Measurements as provided for this product"),
                        h("thead", null,
                            h("tr", null,
                                h("th", null, "Size"),
                                h("th", null, "Measurements"))),
                        h("tbody", null, sizeDimensions.map(s => h("tr", { key: s.size },
                            h("th", null, s.size),
                            h("td", null, s.dimensions.length ? s.dimensions.map(d => `${d.label}: ${d.value}`).join(" / ") : "Not provided")))))) : h("p", null, "Measurements haven\u2019t been added for this piece yet. Our team can help you choose the right size."),
                h(Link, { href: "/contact-us", className: styles.textLink, onClick: () => sizeDialog.current?.close() },
                    "Ask us about sizing ",
                    h(ArrowUpRight, { size: 16 })))),
        h("dialog", { ref: imageDialog, className: `${styles.dialog} ${styles.imageDialog}`, "aria-label": "Enlarged product image", onClick: e => { if (e.target === e.currentTarget)
                imageDialog.current?.close(); }, onKeyDown: e => { if (images.length > 1 && ["ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
                changeImage(e.key === "ArrowLeft" ? -1 : 1);
            } } },
            h("button", { className: styles.dialogClose, "aria-label": "Close enlarged image", onClick: () => imageDialog.current?.close() },
                h(X, { size: 22 })),
            h("img", { src: images[activeImageIndex], alt: `${product.name}, enlarged view ${activeImageIndex + 1}` }),
            images.length > 1 && h("div", { className: styles.galleryControls },
                h("button", { "aria-label": "Previous enlarged image", onClick: () => changeImage(-1) },
                    h(ChevronLeft, { size: 20 })),
                h("span", null,
                    activeImageIndex + 1,
                    " / ",
                    images.length),
                h("button", { "aria-label": "Next enlarged image", onClick: () => changeImage(1) },
                    h(ChevronRight, { size: 20 })))));
}
