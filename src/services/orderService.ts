import { Order, OrderStatus, PaymentStatus, OrderItem, Address, PaymentMethod } from '../types';

const STORAGE_KEY_ORDERS = 'amarbazaar_orders';

// Initially no fake customer accounts or fake phone numbers.
// Real customer orders created through checkout will be saved and persisted here.
const SEED_ORDERS: Order[] = [];

class OrderService {
  private orders: Order[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
        if (stored) {
          this.orders = JSON.parse(stored);
        } else {
          this.orders = [...SEED_ORDERS];
        }
      } else {
        this.orders = [...SEED_ORDERS];
      }
    } catch {
      this.orders = [...SEED_ORDERS];
    }
  }

  public async getAllOrders(): Promise<Order[]> {
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async getOrderById(id: string): Promise<Order | undefined> {
    const cleanId = id.trim().toUpperCase();
    return this.orders.find((o) => o.id.toUpperCase() === cleanId);
  }

  public async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return this.getOrderById(orderNumber);
  }

  public async findOrdersByPhone(phone: string): Promise<Order[]> {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return this.orders.filter((o) =>
      o.customerInfo.phone.replace(/[^0-9]/g, '').includes(cleanPhone)
    );
  }

  public async createOrder(data: {
    customerInfo: { name: string; phone: string; email?: string };
    shippingAddress: Address;
    items: OrderItem[];
    subtotal: number;
    discountAmount: number;
    couponCode?: string;
    deliveryCharge: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
  }): Promise<Order> {
    // Generate an authentic Bangladeshi business order number e.g. AB-739215
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `AB-${randomNum}`;

    const newOrder: Order = {
      id: orderId,
      customerId: `cust_${Date.now()}`,
      customerInfo: data.customerInfo,
      shippingAddress: data.shippingAddress,
      items: data.items,
      subtotal: data.subtotal,
      discountAmount: data.discountAmount,
      couponCode: data.couponCode,
      deliveryCharge: data.deliveryCharge,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      courierPartner: data.shippingAddress.division.toLowerCase() === 'dhaka' ? 'Pathao Courier' : 'Steadfast Courier',
      trackingNumber: `BDX-${randomNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  public async updateOrderStatus(
    orderId: string,
    orderStatus: OrderStatus,
    paymentStatus?: PaymentStatus
  ): Promise<Order | undefined> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    order.orderStatus = orderStatus;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.updatedAt = new Date().toISOString();

    this.persist();
    return order;
  }

  private persist() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
      }
    } catch (e) {
      console.warn('Failed to persist orders', e);
    }
  }
}

export const orderService = new OrderService();
