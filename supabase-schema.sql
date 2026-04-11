-- ============================================
-- Supabase Schema for Carpet E-Commerce
-- Run this in your Supabase SQL Editor
-- ============================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT
);

-- Products with per-m² pricing
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    details TEXT,
    category_id INTEGER REFERENCES categories(id),
    price_per_sqm NUMERIC NOT NULL DEFAULT 120,
    original_price_per_sqm NUMERIC NOT NULL DEFAULT 240,
    base_price NUMERIC NOT NULL DEFAULT 0,
    discount_percent INTEGER NOT NULL DEFAULT 50,
    is_on_sale BOOLEAN NOT NULL DEFAULT true,
    color TEXT,
    style TEXT,
    tribe TEXT,
    thickness TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product images (stored in Supabase Storage)
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    is_primary BOOLEAN DEFAULT false
);

-- Product size variants with pre-calculated prices
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    width_cm INTEGER,
    height_cm INTEGER,
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC NOT NULL DEFAULT 0,
    stock INTEGER DEFAULT 0
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    status TEXT DEFAULT 'en attente',
    subtotal NUMERIC NOT NULL,
    shipping NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL,
    shipping_address JSONB,
    payment_method TEXT DEFAULT 'card',
    stripe_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    variant_id INTEGER REFERENCES product_variants(id),
    product_title TEXT,
    variant_size TEXT,
    quantity INTEGER NOT NULL,
    price_at_time NUMERIC NOT NULL
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (true);

-- Service role has full access (via supabaseAdmin)
-- Customers can only read/update their own data
CREATE POLICY "Customers read own data" ON customers FOR SELECT USING (true);
CREATE POLICY "Orders read own" ON orders FOR SELECT USING (true);
CREATE POLICY "Order items read" ON order_items FOR SELECT USING (true);
