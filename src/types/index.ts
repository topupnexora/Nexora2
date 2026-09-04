export interface Package {
  id: string;
  name: string;
  amount: number;
  unit: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  isPopular?: boolean;
}

export interface GameField {
  id: 'playerId' | 'serverId' | 'zoneId';
  label: string;
  placeholder: string;
  helperText?: string;
  required: boolean;
}

export interface Game {
  id: string;
  name: string;
  shortName: string;
  category: 'Battle Royale' | 'MOBA' | 'FPS' | 'Sports' | 'Sandbox';
  description: string;
  detailedInstructions?: string;
  image: string;
  bannerImage: string;
  popular: boolean;
  featured: boolean;
  deliveryTime: string;
  publisher: string;
  fields: GameField[];
  packages: Package[];
}

export interface CartItem {
  id: string;
  gameId: string;
  gameName: string;
  gameImage: string;
  packageId: string;
  packageName: string;
  unit: string;
  price: number;
  quantity: number;
  playerId: string;
  serverId?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export type PaymentMethod = 'bKash' | 'Nagad' | 'Binance Pay' | 'Bank Transfer';

export interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  // Specific required top-level fields for single or multi-item purchases
  game: string;
  package: string;
  playerId: string;
  serverId?: string;
  quantity: number;
  totalPrice: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentNumberSentTo: string;
  senderPhone: string;
  transactionId: string;
  orderDateTime: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}
