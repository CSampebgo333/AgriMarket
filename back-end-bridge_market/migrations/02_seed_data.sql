-- Seed data for AgriMarket database
-- Use the database
USE agrimarket;
-- Insert Categories
INSERT INTO categories (name, description, image_path) VALUES
('Grains', 'Various grain products including rice, millet, and fonio', '/images/categories/grains.jpg'),
('Vegetables', 'Fresh vegetables from local farms', '/images/categories/vegetables.jpg'),
('Fruits', 'Seasonal fruits from West Africa', '/images/categories/fruits.jpg'),
('Tubers', 'Root vegetables like cassava and sweet potatoes', '/images/categories/tubers.jpg'),
('Herbs', 'Medicinal and culinary herbs', '/images/categories/herbs.jpg');

-- Insert Users (with hashed password 'password123' for all users)
INSERT INTO users (user_name, email, password, phone_number, country, user_type, profile_image, is_verified) VALUES
-- Sellers
('Burkina Organic Farms', 'burkina.farms@gmail.com', '$2a$10$xVrIrvMQfz.mT.nh.Q9X8.Ym3LBXOv.Y3VfY2X2X2X2X2X2X2X2X2', '+22670123456', 'Burkina Faso', 'Seller', '/images/users/burkina_farms.jpg', TRUE),
('Mali Grain Cooperative', 'mali.grain@gmail.com', '$2a$10$xVrIrvMQfz.mT.nh.Q9X8.Ym3LBXOv.Y3VfY2X2X2X2X2X2X2X2X2', '+22375123456', 'Mali', 'Seller', '/images/users/mali_grain.jpg', TRUE),
('Niger Root Farms', 'niger.roots@gmail.com', '$2a$10$xVrIrvMQfz.mT.nh.Q9X8.Ym3LBXOv.Y3VfY2X2X2X2X2X2X2X2X2', '+22780123456', 'Niger', 'Seller', '/images/users/niger_roots.jpg', TRUE),
-- Customers
('Michel Bamogo', 'michel.bamogo@gmail.com', '$2a$10$xVrIrvMQfz.mT.nh.Q9X8.Ym3LBXOv.Y3VfY2X2X2X2X2X2X2X2X2', '+22670987654', 'Burkina Faso', 'Customer', '/images/users/michel_bamogo.jpg', TRUE),
('Amadou Diallo', 'amadou.diallo@gmail.com', '$2a$10$xVrIrvMQfz.mT.nh.Q9X8.Ym3LBXOv.Y3VfY2X2X2X2X2X2X2X2X2', '+22375987654', 'Mali', 'Customer', '/images/users/amadou_diallo.jpg', TRUE),
('Fatima Ouedraogo', 'fatima.ouedraogo@gmail.com', '$2a$10$xVrIrvMQfz.mT.nh.Q9X8.Ym3LBXOv.Y3VfY2X2X2X2X2X2X2X2X2', '+22670456789', 'Burkina Faso', 'Customer', '/images/users/fatima_ouderaogo.jpg', TRUE),
-- Admin
('Clément Sampebgo', 'clement.sampebgo@agrimarket.com', '$2a$10$xVrIrvMQfz.mT.nh.Q9X8.Ym3LBXOv.Y3VfY2X2X2X2X2X2X2X2X2', '+22670111222', 'Burkina Faso', 'Admin', '/images/users/clement_sampebgo.jpg', TRUE),
-- Logistician
('Ibrahim Maiga', 'ibrahim.maiga@gmail.com', '$2a$10$xVrIrvMQfz.mT.nh.Q9X8.Ym3LBXOv.Y3VfY2X2X2X2X2X2X2X2X2', '+22375456789', 'Mali', 'Logistician', '/images/users/ibrahim_maiga.jpg', TRUE);

-- Insert Sellers
INSERT INTO sellers (user_id, business_name, business_license, address, rating, preferred_payment_method, description, verified) VALUES
(1, 'Burkina Organic Farms', 'BF-12345', 'Route de Bobo, Ouagadougou, Burkina Faso', 4.8, 'Mobile Money', 'Organic farm specializing in traditional grains and vegetables', TRUE),
(2, 'Mali Grain Cooperative', 'ML-67890', 'Avenue de l\'Indépendance, Bamako, Mali', 4.5, 'Bank Transfer', 'Cooperative of small-scale grain farmers from central Mali', TRUE),
(3, 'Niger Root Farms', 'NE-54321', 'Rue du Commerce, Niamey, Niger', 4.2, 'Cash on Delivery', 'Family-owned farm specializing in root vegetables and tubers', TRUE);

-- Insert Customers
INSERT INTO customers (user_id, address, location, preferred_payment_method) VALUES
(4, '123 Rue de la Paix, Ouagadougou', 'Ouagadougou', 'Mobile Money'),
(5, '45 Avenue du Mali, Bamako', 'Bamako', 'Cash on Delivery'),
(6, '67 Boulevard des Nations, Ouagadougou', 'Ouagadougou', 'Bank Transfer');

-- Insert Administrators
INSERT INTO administrators (user_id, admin_level, permissions) VALUES
(7, 'national', '["manage_users", "manage_products", "manage_orders", "manage_payments", "manage_deliveries"]');

-- Insert Logisticians
INSERT INTO logisticians (user_id, availability_status, location, rating, transport_type, capacity) VALUES
(8, TRUE, 'Bamako', 4.7, 'Motorcycle', 'Up to 50kg');

-- Insert Products
INSERT INTO products (seller_id, name, description, category_id, price, expiry_date, manufacture_date, weight, weight_unit, country_of_origin, stock_quantity, featured, discount) VALUES
(1, 'Fonio Grain', 'Organic fonio grain, a nutritious ancient grain native to West Africa. High in protein and fiber.', 1, 2500, DATE_ADD(CURRENT_DATE, INTERVAL 6 MONTH), CURRENT_DATE, 1.0, 'kg', 'Burkina Faso', 100, TRUE, NULL),
(2, 'Millet', 'Locally grown millet, perfect for traditional dishes. Sustainably farmed.', 1, 1800, DATE_ADD(CURRENT_DATE, INTERVAL 8 MONTH), DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), 1.0, 'kg', 'Mali', 150, FALSE, NULL),
(3, 'Cassava', 'Fresh cassava roots, perfect for cooking traditional dishes.', 4, 1200, DATE_ADD(CURRENT_DATE, INTERVAL 2 WEEK), DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), 2.0, 'kg', 'Niger', 80, FALSE, NULL),
(1, 'Okra', 'Fresh organic okra, harvested daily from our farms.', 2, 900, DATE_ADD(CURRENT_DATE, INTERVAL 1 WEEK), CURRENT_DATE, 0.5, 'kg', 'Burkina Faso', 60, FALSE, NULL),
(2, 'Sweet Potatoes', 'Nutritious sweet potatoes, rich in vitamins and minerals.', 4, 1500, DATE_ADD(CURRENT_DATE, INTERVAL 3 WEEK), DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), 2.0, 'kg', 'Mali', 100, FALSE, NULL),
(3, 'Sorghum', 'High-quality sorghum grain, ideal for flour and traditional beverages.', 1, 2200, DATE_ADD(CURRENT_DATE, INTERVAL 10 MONTH), DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH), 1.0, 'kg', 'Niger', 120, FALSE, NULL),
(1, 'Hibiscus', 'Dried hibiscus flowers for making bissap juice, rich in antioxidants.', 5, 3000, DATE_ADD(CURRENT_DATE, INTERVAL 12 MONTH), DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH), 0.5, 'kg', 'Burkina Faso', 50, TRUE, 10.00),
(2, 'Plantains', 'Ripe plantains, perfect for grilling or frying.', 3, 1700, DATE_ADD(CURRENT_DATE, INTERVAL 1 WEEK), CURRENT_DATE, 1.0, 'kg', 'Mali', 70, FALSE, NULL);

-- Insert Product Images
INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(1, '/images/fonio.jpg', TRUE),
(1, '/images/fonio_2.jpg', FALSE),
(2, '/images/millet.jpg', TRUE),
(3, '/images/cassava.jpg', TRUE),
(4, '/images/okra.jpg', TRUE),
(5, '/images/sweet_potatoes.jpg', TRUE),
(6, '/images/sorghum.jpg', TRUE),
(7, '/images/hibiscus.jpg', TRUE),
(8, '/images/plantain.jpg', TRUE);

-- Insert Reviews
INSERT INTO reviews (product_id, user_id, rating, title, content) VALUES
(1, 5, 5.0, 'Excellent quality grain', 'The fonio grain I received was of excellent quality. Very clean and well-packaged. It cooks quickly and has a delicious nutty flavor. Will definitely order again!'),
(1, 6, 4.0, 'Good product, fast delivery', 'The quality of the grain is good, and the delivery was faster than expected. I would have given 5 stars, but the packaging could be improved to better preserve freshness during storage.'),
(1, 4, 5.0, 'Traditional quality', 'This reminds me of the fonio my grandmother used to prepare. Authentic taste and excellent nutritional value. I appreciate that it\'s organically grown using traditional methods.'),
(2, 5, 4.5, 'Great millet', 'Very good quality millet, clean and well packaged.'),
(3, 6, 4.0, 'Fresh cassava', 'The cassava arrived fresh and was perfect for my recipe.'),
(4, 4, 4.7, 'Delicious okra', 'Very fresh and tender okra, perfect for my stew.');

-- Insert Orders
INSERT INTO orders (customer_id, order_date, total_amount, status) VALUES
(4, DATE_SUB(CURRENT_DATE, INTERVAL 15 DAY), 12500, 'delivered'),
(5, DATE_SUB(CURRENT_DATE, INTERVAL 28 DAY), 9000, 'delivered'),
(6, DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY), 15700, 'processing');

-- Insert Order Details
INSERT INTO order_details (order_id, product_id, quantity, price) VALUES
(1, 1, 3, 2500),
(1, 2, 2, 1800),
(2, 3, 5, 1200),
(2, 4, 2, 900),
(3, 5, 4, 1500),
(3, 7, 2, 3000),
(3, 8, 3, 1700);

-- Insert Payments
INSERT INTO payments (order_id, customer_id, amount, method, status, transaction_reference) VALUES
(1, 4, 12500, 'Mobile Money', 'completed', 'MM-12345-ABCDE'),
(2, 5, 9000, 'Cash on Delivery', 'completed', 'COD-67890-FGHIJ'),
(3, 6, 15700, 'Bank Transfer', 'pending', 'BT-54321-KLMNO');

-- Insert Deliveries
INSERT INTO deliveries (order_id, logistician_id, customer_id, delivery_date, estimated_delivery_date, delivery_cost, delivery_status, tracking_number) VALUES
(1, 8, 4, DATE_SUB(CURRENT_DATE, INTERVAL 13 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 12 DAY), 1000, 'delivered', 'TRK-12345'),
(2, 8, 5, DATE_SUB(CURRENT_DATE, INTERVAL 26 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 25 DAY), 1200, 'delivered', 'TRK-67890'),
(3, 8, 6, NULL, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), 1500, 'processing', 'TRK-54321');

-- Insert Wishlist Items
INSERT INTO wishlist_items (user_id, product_id) VALUES
(4, 7),
(4, 8),
(5, 1),
(6, 2);