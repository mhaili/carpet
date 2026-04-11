import { supabaseAdmin } from './supabaseAdmin';

// ============================================
// CATEGORIES
// ============================================

export async function getCategories() {
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('name');
    if (error) throw new Error(error.message);
    return data || [];
}

export async function getParentCategories() {
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name');
    if (error) throw new Error(error.message);
    return data || [];
}

export async function getSubCategories(parentId) {
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('parent_id', parentId)
        .order('name');
    if (error) throw new Error(error.message);
    return data || [];
}

export async function getCategoryBySlug(slug) {
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error) return null;
    return data;
}

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(categorySlug = null) {
    // If filtering by a parent category, get all its sub-category slugs
    let categorySlugs = [];
    if (categorySlug) {
        const cat = await getCategoryBySlug(categorySlug);
        if (cat) {
            // Check if this is a parent category (has children)
            const { data: children } = await supabaseAdmin
                .from('categories')
                .select('slug')
                .eq('parent_id', cat.id);
            if (children && children.length > 0) {
                categorySlugs = children.map(c => c.slug);
            } else {
                categorySlugs = [categorySlug];
            }
        }
    }

    let query = supabaseAdmin
        .from('products')
        .select(`
            *,
            categories!inner(name, slug, parent_id),
            product_images(url, is_primary),
            product_variants(id, size, width_cm, height_cm, price, original_price, stock)
        `)
        .order('created_at', { ascending: false });

    if (categorySlugs.length > 0) {
        query = query.in('categories.slug', categorySlugs);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return (data || []).map(p => ({
        ...p,
        category_name: p.categories?.name,
        category_slug: p.categories?.slug,
        image_url: p.product_images?.find(i => i.is_primary)?.url || p.product_images?.[0]?.url || null,
        images: p.product_images || [],
        variants: p.product_variants || [],
    }));
}

export async function getProductBySlug(slug) {
    const { data, error } = await supabaseAdmin
        .from('products')
        .select(`
            *,
            categories(name, slug),
            product_images(id, url, alt, is_primary),
            product_variants(id, size, width_cm, height_cm, price, original_price, stock)
        `)
        .eq('slug', slug)
        .single();

    if (error || !data) return null;

    return {
        ...data,
        category_name: data.categories?.name,
        category_slug: data.categories?.slug,
        images: data.product_images || [],
        variants: (data.product_variants || []).sort((a, b) => a.price - b.price),
    };
}

export async function getProductById(id) {
    const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return null;
    return data;
}

export async function getFeaturedProducts(limit = 6) {
    const { data, error } = await supabaseAdmin
        .from('products')
        .select(`
            *,
            categories(name, slug),
            product_images(url, is_primary)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw new Error(error.message);

    return (data || []).map(p => ({
        ...p,
        category_name: p.categories?.name,
        category_slug: p.categories?.slug,
        image_url: p.product_images?.find(i => i.is_primary)?.url || p.product_images?.[0]?.url || null,
    }));
}

export async function createProduct({ title, slug, description, details, category_id, price_per_sqm, original_price_per_sqm, base_price, imageUrls, variants }) {
    const { data: product, error } = await supabaseAdmin
        .from('products')
        .insert({
            title,
            slug,
            description: description || null,
            details: details || null,
            category_id,
            price_per_sqm: price_per_sqm || 120,
            original_price_per_sqm: original_price_per_sqm || 240,
            base_price: base_price || 0,
            discount_percent: 50,
            is_on_sale: true,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    if (imageUrls && imageUrls.length > 0) {
        const imageRows = imageUrls.map((url, i) => ({
            product_id: product.id,
            url,
            alt: i === 0 ? title : `${title} vue ${i + 1}`,
            is_primary: i === 0,
        }));
        await supabaseAdmin.from('product_images').insert(imageRows);
    }

    if (variants && Array.isArray(variants)) {
        const variantRows = variants
            .filter(v => v.size && v.size.trim())
            .map(v => ({
                product_id: product.id,
                size: v.size.trim(),
                width_cm: v.width_cm || null,
                height_cm: v.height_cm || null,
                price: parseFloat(v.price) || 0,
                original_price: parseFloat(v.original_price) || 0,
                stock: parseInt(v.stock) || 0,
            }));

        if (variantRows.length > 0) {
            await supabaseAdmin.from('product_variants').insert(variantRows);
        }
    }

    return product;
}

export async function deleteProduct(id) {
    // Cascade delete handles images and variants
    const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id);
    if (error) throw new Error(error.message);
}

// ============================================
// PRODUCT VARIANTS
// ============================================

export async function getVariantById(id) {
    const { data, error } = await supabaseAdmin
        .from('product_variants')
        .select(`*, products(base_price, price_per_sqm)`)
        .eq('id', id)
        .single();
    if (error || !data) return null;
    return data;
}

// ============================================
// CUSTOMERS
// ============================================

export async function getCustomerByEmail(email) {
    const { data, error } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();
    if (error) return null;
    return data;
}

export async function getCustomerById(id) {
    const { data, error } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
    if (error) return null;
    return data;
}

export async function createCustomer({ email, password_hash, first_name, last_name, role = 'customer' }) {
    const { data, error } = await supabaseAdmin
        .from('customers')
        .insert({ email, password_hash, first_name, last_name, role })
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data;
}

// ============================================
// ORDERS
// ============================================

export async function createOrder({ orderNumber, customerId, subtotal, shipping, total, shippingAddress, paymentMethod, stripePaymentId, items }) {
    const { data: order, error } = await supabaseAdmin
        .from('orders')
        .insert({
            order_number: orderNumber,
            customer_id: customerId || null,
            status: 'confirmée',
            subtotal,
            shipping,
            total,
            shipping_address: shippingAddress,
            payment_method: paymentMethod || 'card',
            stripe_payment_id: stripePaymentId || null,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    if (items && items.length > 0) {
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id || null,
            variant_id: item.variant_id || null,
            product_title: item.product_title || '',
            variant_size: item.variant_size || '',
            quantity: item.quantity,
            price_at_time: item.price_at_time,
        }));

        await supabaseAdmin.from('order_items').insert(orderItems);
    }

    // Update stock for non-custom variants
    for (const item of items) {
        if (item.variant_id) {
            await supabaseAdmin.rpc('decrement_stock', {
                vid: item.variant_id,
                qty: item.quantity,
            });
        }
    }

    return order;
}

export async function getOrdersByCustomer(customerId) {
    const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
}

export async function getAllOrders() {
    const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`*, customers(first_name, last_name, email)`)
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(o => ({
        ...o,
        first_name: o.customers?.first_name,
        last_name: o.customers?.last_name,
        email: o.customers?.email,
    }));
}

export async function updateOrderStatus(orderId, status) {
    const { error } = await supabaseAdmin
        .from('orders')
        .update({ status })
        .eq('id', orderId);
    if (error) throw new Error(error.message);
}

// ============================================
// PRICING HELPERS
// ============================================

/**
 * Calculate price for a custom size rug
 * @param {number} pricePerSqm - Sale price per m² (e.g., 120)
 * @param {number} widthCm - Width in cm
 * @param {number} heightCm - Height in cm
 * @returns {{ salePrice: number, originalPrice: number }}
 */
export function calculateCustomPrice(pricePerSqm, originalPricePerSqm, widthCm, heightCm) {
    const areaSqm = (widthCm * heightCm) / 10000;
    const salePrice = Math.round(areaSqm * pricePerSqm);
    const originalPrice = Math.round(areaSqm * originalPricePerSqm);
    return { salePrice, originalPrice, areaSqm };
}

// Default export for backward compatibility during migration
const db = {
    getCategories,
    getCategoryBySlug,
    getProducts,
    getProductBySlug,
    getProductById,
    getFeaturedProducts,
    createProduct,
    deleteProduct,
    getVariantById,
    getCustomerByEmail,
    getCustomerById,
    createCustomer,
    createOrder,
    getOrdersByCustomer,
    getAllOrders,
    updateOrderStatus,
    calculateCustomPrice,
};

export default db;
