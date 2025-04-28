const db = require('../lib/db');

class Order {
  // Get order by ID with all related information
  static async getById(orderId) {
    // Get order details
    const order = await db.getOne(`
      SELECT o.*, u.user_name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.customer_id = u.user_id
      WHERE o.order_id = ?
    `, [orderId]);
    
    if (!order) return null;
    
    // Get order details (items)
    const orderDetails = await db.query(`
      SELECT od.*, p.name as product_name, p.description as product_description,
             (SELECT image_path FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) as product_image
      FROM order_details od
      JOIN products p ON od.product_id = p.product_id
      WHERE od.order_id = ?
    `, [orderId]);
    
    // Get payment information
    const payment = await db.getOne('SELECT * FROM payments WHERE order_id = ?', [orderId]);
    
    // Get delivery information
    const delivery = await db.getOne(`
      SELECT d.*, u.user_name as logistician_name, u.email as logistician_email
      FROM deliveries d
      LEFT JOIN users u ON d.logistician_id = u.user_id
      WHERE d.order_id = ?
    `, [orderId]);
    
    return {
      ...order,
      items: orderDetails,
      payment,
      delivery
    };
  }

  // Get all orders with filtering and pagination
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      customer_id,
      seller_id,
      logistician_id,
      status,
      start_date,
      end_date,
      sort_by = 'order_date',
      sort_order = 'DESC'
    } = options;
    
    const offset = (page - 1) * limit;
    
    // Build the query
    let sql = `
      SELECT o.*, u.user_name as customer_name,
             (SELECT COUNT(*) FROM order_details WHERE order_id = o.order_id) as item_count
      FROM orders o
      JOIN users u ON o.customer_id = u.user_id
    `;
    
    // Build WHERE clause
    const whereConditions = [];
    const params = [];
    
    if (customer_id) {
      whereConditions.push('o.customer_id = ?');
      params.push(customer_id);
    }
    
    if (seller_id) {
      sql += ` JOIN order_details od ON o.order_id = od.order_id
               JOIN products p ON od.product_id = p.product_id`;
      whereConditions.push('p.seller_id = ?');
      params.push(seller_id);
    }
    
    if (logistician_id) {
      sql += ` JOIN deliveries d ON o.order_id = d.order_id`;
      whereConditions.push('d.logistician_id = ?');
      params.push(logistician_id);
    }
    
    if (status) {
      whereConditions.push('o.status = ?');
      params.push(status);
    }
    
    if (start_date) {
      whereConditions.push('o.order_date >= ?');
      params.push(start_date);
    }
    
    if (end_date) {
      whereConditions.push('o.order_date <= ?');
      params.push(end_date);
    }
    
    if (whereConditions.length > 0) {
      sql += ' WHERE ' + whereConditions.join(' AND ');
    }
    
    // Add GROUP BY if we're filtering by seller_id to avoid duplicates
    if (seller_id) {
      sql += ' GROUP BY o.order_id';
    }
    
    // Add sorting
    const validSortColumns = ['order_date', 'total_amount', 'status'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'order_date';
    const sortOrder = validSortOrders.includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : 'DESC';
    
    sql += ` ORDER BY o.${sortColumn} ${sortOrder}`;
    
    // Add pagination
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    // Execute query
    const orders = await db.query(sql, params);
    
    // Get total count for pagination
    let countSql = 'SELECT COUNT(DISTINCT o.order_id) as total FROM orders o';
    
    if (seller_id) {
      countSql += ` JOIN order_details od ON o.order_id = od.order_id
                    JOIN products p ON od.product_id = p.product_id`;
    }
    
    if (logistician_id) {
      countSql += ` JOIN deliveries d ON o.order_id = d.order_id`;
    }
    
    if (whereConditions.length > 0) {
      countSql += ' WHERE ' + whereConditions.join(' AND ');
    }
    
    const countResult = await db.getOne(countSql, params.slice(0, params.length - 2));
    const total = countResult.total;
    
    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Create a new order
  static async create(orderData) {
    const connection = await db.beginTransaction();
    
    try {
      // Insert order
      const orderId = await db.insert('orders', {
        customer_id: orderData.customer_id,
        total_amount: orderData.total_amount,
        status: orderData.status || 'pending',
        notes: orderData.notes
      });
      
      // Insert order details (items)
      if (orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
        for (const item of orderData.items) {
          await db.query(
            'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [orderId, item.product_id, item.quantity, item.price]
          );
          
          // Update product stock
          await db.query(
            'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
            [item.quantity, item.product_id]
          );
        }
      }
      
      // Insert payment if provided
      if (orderData.payment) {
        await db.insert('payments', {
          order_id: orderId,
          customer_id: orderData.customer_id,
          amount: orderData.payment.amount || orderData.total_amount,
          method: orderData.payment.method,
          status: orderData.payment.status || 'pending',
          transaction_reference: orderData.payment.transaction_reference
        });
      }
      
      // Insert delivery if provided
      if (orderData.delivery) {
        await db.insert('deliveries', {
          order_id: orderId,
          logistician_id: orderData.delivery.logistician_id,
          customer_id: orderData.customer_id,
          estimated_delivery_date: orderData.delivery.estimated_delivery_date,
          delivery_cost: orderData.delivery.delivery_cost || 0,
          delivery_status: orderData.delivery.delivery_status || 'pending',
          tracking_number: orderData.delivery.tracking_number,
          delivery_notes: orderData.delivery.delivery_notes
        });
      }
      
      // Commit the transaction
      await db.commitTransaction(connection);
      
      return orderId;
    } catch (error) {
      // Rollback the transaction in case of error
      await db.rollbackTransaction(connection);
      throw error;
    }
  }

  // Update order status
  static async updateStatus(orderId, status) {
    return db.update('orders', { status, updated_at: new Date() }, { order_id: orderId });
  }

  // Update payment status
  static async updatePaymentStatus(orderId, status, transactionReference = null) {
    const updateData = { status, updated_at: new Date() };
    
    if (transactionReference) {
      updateData.transaction_reference = transactionReference;
    }
    
    return db.update('payments', updateData, { order_id: orderId });
  }

  // Update delivery status
  static async updateDeliveryStatus(orderId, status, deliveryDate = null) {
    const updateData = { delivery_status: status, updated_at: new Date() };
    
    if (deliveryDate) {
      updateData.delivery_date = deliveryDate;
    }
    
    return db.update('deliveries', updateData, { order_id: orderId });
  }

  // Assign logistician to delivery
  static async assignLogistician(orderId, logisticianId) {
    return db.update('deliveries', { logistician_id: logisticianId, updated_at: new Date() }, { order_id: orderId });
  }
}

module.exports = Order;