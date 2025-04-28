-- Seed Categories
INSERT INTO Category (name, description, image_path) VALUES
('Grains', 'Various grain products including rice, millet, and fonio', '/images/categories/grains.jpg'),
('Vegetables', 'Fresh vegetables from local farms', '/images/categories/vegetables.jpg'),
('Fruits', 'Seasonal fruits from West Africa', '/images/categories/fruits.jpg'),
('Tubers', 'Root vegetables and tubers', '/images/categories/tubers.jpg'),
('Herbs', 'Medicinal and culinary herbs', '/images/categories/herbs.jpg');

-- Update existing products with category_id
UPDATE Product SET category_id = 1 WHERE category = 'Grains';
UPDATE Product SET category_id = 2 WHERE category = 'Vegetables';
UPDATE Product SET category_id = 3 WHERE category = 'Fruits';
UPDATE Product SET category_id = 4 WHERE category = 'Tubers';
UPDATE Product SET category_id = 5 WHERE category = 'Herbs';

-- Seed User specializations
-- Sellers
INSERT INTO Seller (user_id, business_name, business_license, address, rating, preferred_payment_method) VALUES
(1, 'Burkina Organic Farms', 'BF12345', 'Ouagadougou, Sector 15', 4.8, 'Mobile Money'),
(2, 'Mali Grain Cooperative', 'ML54321', 'Bamako, District 3', 4.5, 'Bank Transfer');

-- Customers
INSERT INTO Customer (user_id, address, location, preferred_payment_method) VALUES
(3, '123 Ouaga Street, Sector 15', 'Ouagadougou', 'Mobile Money'),
(4, '45 Bamako Road, District 3', 'Bamako', 'Cash on Delivery');

-- Administrators
INSERT INTO Administrator (user_id, admin_level, permissions) VALUES
(5, 'national', '["manage_users", "manage_products", "manage_orders", "manage_payments", "manage_deliveries"]');

-- Logisticians
INSERT INTO Logistician (user_id, availability_status, location, rating) VALUES
(6, TRUE, 'Ouagadougou', 4.7),
(7, TRUE, 'Niamey', 4.3);

-- Seed Orders (if not already seeded)
INSERT INTO `Order` (order_id, customer_id, order_date, total_amount, status) VALUES
(1, 3, '2023-04-15 10:30:00', 12500.00, 'delivered'),
(2, 4, '2023-03-28 14:45:00', 9000.00, 'delivered'),
(3, 3, '2023-05-05 09:15:00', 15700.00, 'processing');

-- Seed OrderDetails (if not already seeded)
INSERT INTO OrderDetail (order_id, product_id, quantity, price) VALUES
(1, 1, 3, 2500.00),
(1, 2, 2, 1800.00),
(2, 3, 5, 1200.00),
(2, 4, 2, 900.00),
(3, 5, 4, 1500.00),
(3, 7, 2, 3000.00),
(3, 6, 3, 1700.00);

-- Seed Payments
INSERT INTO Payment (order_id, customer_id, amount, method, transaction_date, status) VALUES
(1, 3, 12500.00, 'Mobile Money', '2023-04-15 10:35:00', 'completed'),
(2, 4, 9000.00, 'Cash on Delivery', '2023-03-28 16:20:00', 'completed'),
(3, 3, 15700.00, 'Bank Transfer', '2023-05-05 09:20:00', 'pending');

-- Seed Deliveries
INSERT INTO Delivery (order_id, logistician_id, customer_id, delivery_date, estimated_delivery_date, delivery_cost, delivery_status, tracking_number) VALUES
(1, 6, 3, '2023-04-17', '2023-04-18', 1000.00, 'delivered', 'TRK-2023-1001'),
(2, 7, 4, '2023-03-30', '2023-03-31', 1200.00, 'delivered', 'TRK-2023-0892'),
(3, 6, 3, NULL, '2023-05-12', 1500.00, 'processing', 'TRK-2023-1105');

-- Seed ProductImages
INSERT INTO ProductImage (product_id, image_url, is_primary) VALUES
(1, '/images/fonio.jpg', TRUE),
(2, '/images/millet.jpg', TRUE),
(3, '/images/cassava.jpg', TRUE),
(4, '/images/okra.jpg', TRUE),
(5, '/images/sweet_potatoes.jpg', TRUE),
(6, '/images/plantains.jpg', TRUE),
(7, '/images/hibiscus.jpg', TRUE),
(1, '/images/fonio_2.jpg', FALSE),
(1, '/images/fonio_3.jpg', FALSE),
(2, '/images/millet_2.jpg', FALSE);

-- Seed Reviews
INSERT INTO Review (product_id, user_id, rating, title, content, created_at) VALUES
(1, 3, 5.0, 'Excellent quality grain', 'The fonio grain I received was of excellent quality. Very clean and well-packaged. It cooks quickly and has a delicious nutty flavor. Will definitely order again!', '2023-04-20 14:30:00'),
(1, 4, 4.0, 'Good product, fast delivery', 'The quality of the grain is good, and the delivery was faster than expected. I would have given 5 stars, but the packaging could be improved to better preserve freshness during storage.', '2023-04-25 09:45:00'),
(2, 3, 5.0, 'Traditional quality', 'This reminds me of the millet my grandmother used to prepare. Authentic taste and excellent nutritional value. I appreciate that it\'s organically grown using traditional methods.', '2023-05-02 16:20:00');

-- Seed WishlistItems
INSERT INTO WishlistItem (user_id, product_id, added_at) VALUES
(3, 7, '2023-04-10 11:20:00'),
(3, 5, '2023-04-12 15:45:00'),
(4, 1, '2023-03-25 09:30:00');