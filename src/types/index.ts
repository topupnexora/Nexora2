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
  game: string;
  package: string;
  quantity: number;
  playerId: string;
  serverZoneId?: string;
  serverId?: string;
  customerName: string;
  customerPhone: string;
  phone: string;
  email?: string;
  paymentMethod: PaymentMethod;
  paymentSenderNumber: string;
  senderPhone: string;
  paymentNumberSentTo: string;
  transactionId: string;
  amount: number;
  totalPrice: number;
  totalAmount: number;
  dateTime: string;
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
