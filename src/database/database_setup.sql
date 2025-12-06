-- 1. TAO CO SO DU LIEU (DATABASE)
CREATE DATABASE IF NOT EXISTS swimming_club_shop 
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. CHON CO SO DU LIEU DE LAM VIEC
USE swimming_club_shop;

-- 3. TAO CAC BANG (CHUA CO KHOA NGOAI)

-- Bang `users` (Nguoi dung)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- Bang `products` (San pham)
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    price_vnd DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    image_url TEXT
);

-- Bang `athletes` (Tuyen thu)
CREATE TABLE athletes (
    athlete_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    description TEXT,
    achievements TEXT,
    image_url TEXT
);

-- Bang `orders` (Don hang)
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    shipping_name VARCHAR(255) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL
);

-- Bang `order_details` (Chi tiet don hang)
CREATE TABLE order_details (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Bang `payments` (Thanh toan)
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method ENUM('momo', 'bank_transfer', 'cash') NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payment_status ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending'
);

-- Bang `reviews` (Danh gia)
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    review_date DATE DEFAULT (CURRENT_DATE) NOT NULL
);

-- Bang `cart_items` (Gio hang - BANG NAY BI THIEU TRUOC DAY)
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    -- Them khoa UNIQUE de su dung "ON DUPLICATE KEY UPDATE" trong code Node.js
    UNIQUE KEY uk_user_product (user_id, product_id)
);


-- 4. THEM KHOA NGOAI (FOREIGN KEYS)
-- (Them sau cung de dam bao cac bang da ton tai)

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE order_details
    ADD CONSTRAINT fk_orderdetails_orders FOREIGN KEY (order_id) REFERENCES orders(order_id),
    ADD CONSTRAINT fk_orderdetails_products FOREIGN KEY (product_id) REFERENCES products(product_id);

ALTER TABLE payments
    ADD CONSTRAINT fk_payments_orders FOREIGN KEY (order_id) REFERENCES orders(order_id);

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    ADD CONSTRAINT fk_reviews_products FOREIGN KEY (product_id) REFERENCES products(product_id);

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cartitems_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    ADD CONSTRAINT fk_cartitems_products FOREIGN KEY (product_id) REFERENCES products(product_id);

-- Thong bao hoan thanh
SELECT 'DA TAO CSDL VA CAC BANG THANH CONG!' AS status;