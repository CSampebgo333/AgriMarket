-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  country VARCHAR(50),
  user_type ENUM('Customer', 'Seller', 'Admin', 'Logistician') NOT NULL,
  profile_image VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  joined_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Create sellers table
CREATE TABLE IF NOT EXISTS sellers (
  seller_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  business_name VARCHAR(100) NOT NULL,
  business_license VARCHAR(100),
  description TEXT,
  address VARCHAR(255),
  location VARCHAR(100),
  country VARCHAR(50),
  city VARCHAR(50),
  banner_image VARCHAR(255),
  preferred_payment_method VARCHAR(50),
  notification_email BOOLEAN DEFAULT TRUE,
  notification_sms BOOLEAN DEFAULT FALSE,
  auto_approve_orders BOOLEAN DEFAULT FALSE,
  currency VARCHAR(10) DEFAULT 'XOF',
  timezone VARCHAR(50) DEFAULT 'Africa/Ouagadougou',
  shipping_policy TEXT,
  return_policy TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  address VARCHAR(255),
  location VARCHAR(100),
  preferred_payment_method VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create administrators table
CREATE TABLE IF NOT EXISTS administrators (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  admin_level INT DEFAULT 1,
  permissions JSON,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create logisticians table
CREATE TABLE IF NOT EXISTS logisticians (
  logistician_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  availability_status BOOLEAN DEFAULT TRUE,
  location VARCHAR(100),
  transport_type VARCHAR(50),
  capacity VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id INT,
  image_path VARCHAR(255),
  FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  expiry_date DATE,
  manufacture_date DATE,
  weight DECIMAL(10, 2),
  weight_unit VARCHAR(10),
  country_of_origin VARCHAR(50),
  featured BOOLEAN DEFAULT FALSE,
  discount DECIMAL(5, 2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  seller_id INT NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  delivery_date DATETIME,
  FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE RESTRICT,
  FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(100),
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  UNIQUE (user_id, product_id)
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Vegetables', 'Fresh vegetables from local farms'),
('Fruits', 'Fresh fruits from local farms'),
('Grains', 'Various grains and cereals'),
('Dairy & Eggs', 'Dairy products and eggs'),
('Meat & Poultry', 'Fresh meat and poultry products'),
('Fish & Seafood', 'Fresh fish and seafood'),
('Herbs & Spices', 'Herbs and spices for cooking'),
('Nuts & Seeds', 'Various nuts and seeds');

-- Insert a default admin user (password: admin123)
INSERT INTO users (user_name, email, password, user_type, is_verified)
VALUES ('Admin', 'admin@example.com', '$2a$10$JyYk6irz0ZQzO/NjA.1s2.QnJu5AxZoGwJr5wLMGz1UVH5YlGQhLe', 'Admin', TRUE);

-- Insert admin record
INSERT INTO administrators (user_id, admin_level, permissions)
VALUES (LAST_INSERT_ID(), 2, '{"all": true}');