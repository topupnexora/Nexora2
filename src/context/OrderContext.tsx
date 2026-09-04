import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, CartItem, PaymentMethod } from '../types';
import { generateOrderId } from '../utils/format';

interface CreateOrderInput {
  customerName: string;
  phone: string;
  email?: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentNumberSentTo: string;
  senderPhone: string;
  transactionId: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (input: CreateOrderInput) => Promise<{ success: boolean; order?: Order; error?: string }>;
  getOrderById: (orderId: string, phone?: string) => Order | null;
  getUserOrders: (phone?: string, email?: string) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  recentCreatedOrder: Order | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'nexora_orders_db_v1';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    // Seed initial demo orders for rich user exploration
    const seedOrders: Order[] = [
      {
        orderId: 'NEX-20260902-841920',
        customerName: 'Shakib Gamer',
        phone: '01712345678',
        email: 'gamer@nexora.gg',
        game: 'Free Fire',
        package: '610 Diamonds',
        playerId: '8271049281',
        quantity: 1,
        totalPrice: 475,
        totalAmount: 475,
        paymentMethod: 'bKash',
        paymentNumberSentTo: '01638749806',
        senderPhone: '01712345678',
        transactionId: '9K4M8X2A10',
        orderDateTime: new Date(Date.now() - 86400000 * 2).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
        status: 'Completed',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2 + 180000).toISOString(),
        items: [
          {
            id: 'demo-1',
            gameId: 'free-fire',
            gameName: 'Free Fire',
            gameImage: '/images/games/free-fire.jpg',
            packageId: 'ff-610',
            packageName: '610 Diamonds',
            unit: 'Diamonds',
            price: 475,
            quantity: 1,
            playerId: '8271049281'
          }
        ],
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Order placed via bKash' },
          { status: 'Processing', timestamp: new Date(Date.now() - 86400000 * 2 + 60000).toISOString(), note: 'Payment verified by admin' },
          { status: 'Completed', timestamp: new Date(Date.now() - 86400000 * 2 + 180000).toISOString(), note: '610 Diamonds delivered to UID 8271049281' }
        ]
      },
      {
        orderId: 'NEX-20260904-512839',
        customerName: 'Tanvir Ahmed',
        phone: '01898765432',
        email: 'tanvir@gmail.com',
        game: 'PUBG Mobile',
        package: '660 UC',
        playerId: '5129384710',
        quantity: 1,
        totalPrice: 950,
        totalAmount: 950,
        paymentMethod: 'Nagad',
        paymentNumberSentTo: '01638749806',
        senderPhone: '01898765432',
        transactionId: 'NG77194018',
        orderDateTime: new Date(Date.now() - 1000 * 60 * 12).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
        status: 'Processing',
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        items: [
          {
            id: 'demo-2',
            gameId: 'pubg-mobile',
            gameName: 'PUBG Mobile',
            gameImage: '/images/games/pubg-mobile.jpg',
            packageId: 'pubg-660',
            packageName: '660 UC',
            unit: 'UC',
            price: 950,
            quantity: 1,
            playerId: '5129384710'
          }
        ],
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), note: 'Awaiting manual payment matching' },
          { status: 'Processing', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), note: 'TrxID verified, pushing UC to PUBG Character ID' }
        ]
      }
    ];
    return seedOrders;
  });

  const [recentCreatedOrder, setRecentCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders to localStorage', e);
    }
  }, [orders]);

  const createOrder = async (input: CreateOrderInput) => {
    const orderId = generateOrderId();
    const now = new Date().toISOString();
    const orderDateTime = new Date(now).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

    const primaryItem = input.items[0];
    const gameName = input.items.map((i) => i.gameName).join(', ') || primaryItem?.gameName || 'Game Top-Up';
    const packageName = input.items.map((i) => `${i.quantity}x ${i.packageName}`).join(', ') || primaryItem?.packageName || 'Package';
    const totalQty = input.items.reduce((s, i) => s + i.quantity, 0);
    const playerId = input.items.map((i) => `${i.playerId}${i.serverId ? ` (${i.serverId})` : ''}`).join(', ') || primaryItem?.playerId || '';
    const serverId = primaryItem?.serverId || undefined;

    const newOrder: Order = {
      orderId,
      customerName: input.customerName.trim(),
      phone: input.phone.trim(),
      email: input.email ? input.email.trim() : undefined,
      game: gameName,
      package: packageName,
      playerId,
      serverId,
      quantity: totalQty,
      totalPrice: input.totalAmount,
      totalAmount: input.totalAmount,
      paymentMethod: input.paymentMethod,
      paymentNumberSentTo: input.paymentNumberSentTo,
      senderPhone: input.senderPhone.trim(),
      transactionId: input.transactionId.trim().toUpperCase(),
      orderDateTime,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      items: input.items,
      statusHistory: [
        {
          status: 'Pending',
          timestamp: now,
          note: `Order submitted with ${input.paymentMethod} (TrxID: ${input.transactionId.trim().toUpperCase()}). Verification in queue.`
        }
      ]
    };

    // Save locally immediately so order history & tracking work reliably
    setOrders((prev) => [newOrder, ...prev]);
    setRecentCreatedOrder(newOrder);

    // Call serverless /api/telegram-order endpoint
    try {
      const telegramPayload = {
        orderId: newOrder.orderId,
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        email: newOrder.email || 'Not provided',
        game: newOrder.game,
        package: newOrder.package,
        playerId: newOrder.playerId,
        serverId: newOrder.serverId || 'N/A',
        quantity: newOrder.quantity,
        amount: newOrder.totalAmount,
        paymentMethod: newOrder.paymentMethod,
        transactionId: newOrder.transactionId,
        status: newOrder.status,
        dateTime: newOrder.orderDateTime
      };

      fetch('/api/telegram-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramPayload)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.configured === false) {
            console.info('[NEXORA Notification]', data.message);
          } else if (data.success) {
            console.log('[NEXORA Telegram] Admin alert delivered successfully');
          } else {
            console.warn('[NEXORA Telegram]', data.error || 'Failed to deliver telegram alert');
          }
        })
        .catch((err) => {
          // Graceful fallback: Network / serverless issue won't block the user's order
          console.warn('[NEXORA Telegram Notification]', 'Endpoint unreachable or unconfigured in dev:', err);
        });
    } catch (e) {
      console.warn('Telegram notification dispatcher error:', e);
    }

    return { success: true, order: newOrder };
  };

  const getOrderById = (orderId: string, phone?: string): Order | null => {
    const cleanId = orderId.trim().toUpperCase();
    const cleanPhone = phone ? phone.trim().replace(/[\s-]/g, '') : null;

    return (
      orders.find((ord) => {
        const idMatches = ord.orderId.toUpperCase() === cleanId;
        if (!idMatches) return false;
        if (!cleanPhone) return true;
        const ordCleanPhone = ord.phone.replace(/[\s-]/g, '');
        return ordCleanPhone.endsWith(cleanPhone) || cleanPhone.endsWith(ordCleanPhone);
      }) || null
    );
  };

  const getUserOrders = (phone?: string, email?: string): Order[] => {
    const cleanPhone = phone ? phone.trim().replace(/[\s-]/g, '') : null;
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    if (!cleanPhone && !cleanEmail) return [];

    return orders.filter((ord) => {
      if (cleanEmail && ord.email && ord.email.toLowerCase() === cleanEmail) return true;
      if (cleanPhone) {
        const ordCleanPhone = ord.phone.replace(/[\s-]/g, '');
        return ordCleanPhone === cleanPhone || ordCleanPhone.endsWith(cleanPhone) || cleanPhone.endsWith(ordCleanPhone);
      }
      return false;
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          const history = ord.statusHistory || [];
          return {
            ...ord,
            status,
            updatedAt: now,
            statusHistory: [
              ...history,
              {
                status,
                timestamp: now,
                note: note || `Status transitioned to ${status}`
              }
            ]
          };
        }
        return ord;
      })
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        getUserOrders,
        updateOrderStatus,
        recentCreatedOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
