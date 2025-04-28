-- Create Payment table
CREATE TABLE IF NOT EXISTS Payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(50) NOT NULL,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  FOREIGN KEY (order_id) REFERENCES `Order`(order_id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Create Delivery table
CREATE TABLE IF NOT EXISTS Delivery (
  delivery_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  logistician_id INT,
  customer_id INT NOT NULL,
  delivery_date DATE,
  estimated_delivery_date DATE,
  delivery_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  delivery_status ENUM('pending', 'processing', 'in_transit', 'delivered', 'failed') DEFAULT 'pending',
  tracking_number VARCHAR(50),
  delivery_notes TEXT,
  FOREIGN KEY (order_id) REFERENCES `Order`(order_id) ON DELETE CASCADE,
  FOREIGN KEY (logistician_id) REFERENCES User(user_id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Add missing columns to existing tables

-- Add description, image_path, and timestamps to Product table
ALTER TABLE Product
ADD COLUMN description TEXT,
ADD COLUMN image_path VARCHAR(255),
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN featured BOOLEAN DEFAULT FALSE,
ADD COLUMN discount DECIMAL(5, 2) DEFAULT NULL;

-- Add status to Order table if not already present
ALTER TABLE `Order`
ADD COLUMN status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending' 
IF NOT EXISTS;

-- Create ProductImage table for multiple images per product
CREATE TABLE IF NOT EXISTS ProductImage (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

-- Create Review table
CREATE TABLE IF NOT EXISTS Review (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating DECIMAL(3, 1) NOT NULL,
  title VARCHAR(100),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Create Category table
CREATE TABLE IF NOT EXISTS Category (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  image_path VARCHAR(255)
);

-- Update Product table to use category_id instead of category string
ALTER TABLE Product
ADD COLUMN category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES Category(category_id);

-- Create WishlistItem table
CREATE TABLE IF NOT EXISTS WishlistItem (
  wishlist_item_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, product_id)
);