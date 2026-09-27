export function normalizeProduct(row) {
    const name = row?.name || row?.title || "Untitled Product";
    const description = row?.description || row?.desc || "";
    const primaryImage = getPrimaryImage(row);
    const category = row?.category || "";
    const subcategory = row?.subcategory || row?.sub_category || "";
    const price = Number(row?.discount_price || row?.price || 0);
    const productReviews = Array.isArray(row?.product_reviews)
        ? row.product_reviews.map((review) => {
            const reviewRecord = review;
            return {
                ...reviewRecord,
                profiles: Array.isArray(reviewRecord.profiles) ? reviewRecord.profiles[0] || null : reviewRecord.profiles || null,
            };
        })
        : [];
    // Preserve the raw encoded size strings (e.g. "S|chest:34,waist:28") before
    // extractSizes strips the metadata. parseProductSizes reads rawSizes, not sizes.
    const rawSizes = Array.isArray(row?.sizes) ? row.sizes : [];
    return {
        ...row,
        id: String(row?.id || ""),
        name,
        title: row?.title || name,
        price,
        image: primaryImage,
        img: primaryImage,
        image_url: primaryImage,
        category,
        subcategory,
        description,
        desc: description,
        colors: extractColors(row),
        sizes: extractSizes(row),
        rawSizes,
        stock_count: Number(row?.stock_count ?? row?.stock ?? 0),
        product_reviews: productReviews,
    };
}
export function normalizeProducts(rows) {
    return (rows || []).map(normalizeProduct);
}
export function getPrimaryImage(product) {
    const images = [...(product?.product_images || [])].sort((a, b) => {
        if (a?.is_primary && !b?.is_primary)
            return -1;
        if (!a?.is_primary && b?.is_primary)
            return 1;
        return Number(a?.sort_order || 0) - Number(b?.sort_order || 0);
    });
    return (images[0]?.public_url ||
        images[0]?.storage_path ||
        product?.image_url ||
        product?.image ||
        product?.img ||
        "/images/streetwear/street-cream-tee.png");
}
export function extractColors(product) {
    const variantColors = (product?.product_variants || [])
        .filter((variant) => variant.active !== false && variant.color)
        .map((variant) => String(variant.color));
    const productColors = (product?.colors || []).map(String);
    const imageColors = (product?.product_images || [])
        .filter((image) => Boolean((image.public_url || image.storage_path) && image.color))
        .map((image) => String(image.color));
    const candidateColors = (variantColors.length ? variantColors : productColors).map((variantColor) => {
        const matchingProductColor = productColors.find((productColor) => colorName(productColor) === colorName(variantColor));
        const matchingImageColor = imageColors.find((imageColor) => colorName(imageColor) === colorName(variantColor));
        return matchingProductColor || matchingImageColor || variantColor;
    });
    const configuredImageColorNames = new Set(imageColors.map(colorName));
    return Array.from(new Map(candidateColors
        .filter((color) => color && configuredImageColorNames.has(colorName(color)))
        .map((color) => [colorName(color), color])).values());
}
export function extractSizes(product, color) {
    const variants = (product?.product_variants || []).filter((variant) => {
        if (variant.active === false)
            return false;
        if (color && colorName(variant.color || "") !== colorName(color))
            return false;
        return Boolean(variant.size);
    });
    const sizes = variants.length
        ? variants.map((variant) => String(variant.size))
        : (product?.sizes || []).map(String);
    const cleanSizes = sizes.map(s => s.split('|')[0]);
    return Array.from(new Set(cleanSizes)).filter((size) => Boolean(size));
}
export function findVariant(product, size, color) {
    return (product?.product_variants || []).find((variant) => {
        if (variant.active === false)
            return false;
        return (!size || variant.size === size) && (!color || colorName(variant.color || "") === colorName(color));
    });
}
export function isVariantInStock(variant) {
    if (!variant)
        return true;
    return Number(variant.stock_count || 0) > 0;
}
export function colorToHex(color) {
    if (!color)
        return "#E5E7EB";
    if (color.includes(":")) {
        const hex = color.split(":")[1].trim();
        if (hex.startsWith("#"))
            return hex;
    }
    const normalized = color.toLowerCase();
    const map = {
        black: "#0B0B0B",
        onyx: "#0B0B0B",
        grey: "#EAEAEA",
        gray: "#EAEAEA",
        ash: "#EAEAEA",
        white: "#FFFFFF",
        rust: "#A6532A",
        slate: "#4A4A4A",
    };
    return map[normalized] || color;
}
export function colorName(color) {
    if (!color)
        return "";
    if (color.includes(":")) {
        return color.split(":")[0].trim().toUpperCase();
    }
    return color.toUpperCase();
}
export function parseProductSizes(sizes) {
    if (!sizes || !Array.isArray(sizes))
        return [];
    return sizes.map(s => {
        if (s.includes('|')) {
            const [size, dimsStr] = s.split('|');
            const dimensions = [];
            dimsStr.split(',').forEach(part => {
                const [k, v] = part.split(':');
                if (k && v) {
                    const val = v.trim();
                    if (val && val !== "—" && val !== "-") {
                        dimensions.push({
                            label: k.trim().toUpperCase(),
                            value: val
                        });
                    }
                }
            });
            return {
                size,
                dimensions
            };
        }
        else {
            return {
                size: s,
                dimensions: []
            };
        }
    });
}
