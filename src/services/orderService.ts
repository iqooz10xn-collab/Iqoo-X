import { Order, OrderStatus, PaymentStatus, OrderItem, Address, PaymentMethod } from '../types';

const STORAGE_KEY_ORDERS = 'amarbazaar_orders';

// Seed with a realistic demo sample order so users can test tracking immediately
const SEED_ORDERS: Order[] = [
  {
    id: 'AB-260312',
    customerId: 'cust_demo_01',
    customerInfo: {
      name: 'Rahim Uddin',
      phone: '01711223344',
      email: 'rahim.uddin@example.com',
    },
    shippingAddress: {
      fullName: 'Rahim Uddin',
      phone: '01711223344',
      email: 'rahim.uddin@example.com',
      division: 'Dhaka',
      district: 'Dhaka (City & Suburbs)',
      upazila: 'Dhanmondi',
      streetAddress: 'House 42, Road 9/A, Dhanmondi R/A',
      postalCode: '1209',
      deliveryNote: 'Please deliver after 2 PM',
    },
    items: [
      {
        productId: 'prod_honey_01',
        nameEn: 'Sundarbans Natural Raw Wild Honey',
        nameBn: 'সুন্দরবনের প্রাকৃতিক খলিশা ফুলের খাঁটি মধু',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80',
        quantity: 1,
        unitPrice: 950,
        selectedVariants: { Weight: '500g' },
        totalPrice: 950,
      },
      {
        productId: 'prod_rice_04',
        nameEn: 'Dinajpur Special Aromatic Kalijira Rice (Chinigura)',
        nameBn: 'দিনাজপুরের স্পেশাল সুবাসিত কালিজিরা চিনিগুঁড়া চাল',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80',
        quantity: 2,
        unitPrice: 160,
        selectedVariants: { 'Pack Size': '1kg' },
        totalPrice: 320,
      },
    ],
    subtotal: 1270,
    discountAmount: 100,
    couponCode: 'AMAR100',
    deliveryCharge: 60,
    totalAmount: 1230,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'shipped',
    estimatedDeliveryDate: '2026-03-22',
    trackingNumber: 'REDX-DH-98214',
    courierPartner: 'RedX Express Logistics',
    createdAt: '2026-03-18T10:30:00.000Z',
    updatedAt: '2026-03-19T08:00:00.000Z',
  },
];

class OrderService {
  private orders: Order[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (stored) {
        this.orders = JSON.parse(stored);
      } else {
        this.orders = [...SEED_ORDERS];
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
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
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
    } catch (e) {
      console.warn('Failed to persist orders', e);
    }
  }
}

export const orderService = new OrderService();
