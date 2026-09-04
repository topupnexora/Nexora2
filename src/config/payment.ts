/**
 * Centralized Payment & Support Configuration for NEXORA
 * 
 * You can configure these directly in this file or provide them
 * via environment variables in .env (prefixed with VITE_).
 * 
 * IMPORTANT: No real account credentials or numbers are invented here.
 * Replace the placeholder values with your real accounts before launch.
 */

export const PAYMENT_CONFIG = {
  // NEXORA Receiving Number for bKash and Nagad
  RECEIVING_NUMBER: '01638749806',

  // bKash Configuration (ACTIVE)
  BKASH_NUMBER: import.meta.env.VITE_BKASH_NUMBER || '01638749806',
  BKASH_TYPE: 'Personal (Send Money)',
  BKASH_ACTIVE: true,

  // Nagad Configuration (ACTIVE)
  NAGAD_NUMBER: import.meta.env.VITE_NAGAD_NUMBER || '01638749806',
  NAGAD_TYPE: 'Personal (Send Money)',
  NAGAD_ACTIVE: true,

  // Binance Pay Configuration (DISABLED / OFF for now)
  BINANCE_PAY_ID_OR_ADDRESS: import.meta.env.VITE_BINANCE_PAY_ID_OR_ADDRESS || 'YOUR_BINANCE_PAY_ID_OR_ADDRESS',
  BINANCE_PAY_TYPE: 'Binance Pay ID / USDT (BEP20 / TRC20)',
  BINANCE_PAY_ACTIVE: false,

  // Bank Transfer Configuration (DISABLED / OFF for now)
  BANK_NAME: import.meta.env.VITE_BANK_NAME || 'YOUR_BANK_NAME',
  BANK_ACCOUNT_NAME: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'YOUR_BANK_ACCOUNT_NAME',
  BANK_ACCOUNT_NUMBER: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || 'YOUR_BANK_ACCOUNT_NUMBER',
  BANK_BRANCH: import.meta.env.VITE_BANK_BRANCH || 'YOUR_BANK_BRANCH',
  BANK_ROUTING_NUMBER: import.meta.env.VITE_BANK_ROUTING_NUMBER || 'YOUR_BANK_ROUTING_NUMBER',
  BANK_TRANSFER_ACTIVE: false,

  // Telegram Support Contact
  TELEGRAM_USERNAME: import.meta.env.VITE_TELEGRAM_USERNAME || 'callmeriyadh',
  get TELEGRAM_SUPPORT_URL() {
    const username = this.TELEGRAM_USERNAME.replace('@', '').trim();
    return `https://t.me/${username}`;
  }
};

export type SupportedPaymentMethod = 'bKash' | 'Nagad' | 'Binance Pay' | 'Bank Transfer';

export interface PaymentMethodItem {
  id: SupportedPaymentMethod;
  name: string;
  type: string;
  isActive: boolean;
  receivingNumber?: string;
  badge?: string;
}

export const PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: 'bKash',
    name: 'bKash',
    type: 'Personal (Send Money)',
    isActive: true,
    receivingNumber: PAYMENT_CONFIG.BKASH_NUMBER
  },
  {
    id: 'Nagad',
    name: 'Nagad',
    type: 'Personal (Send Money)',
    isActive: true,
    receivingNumber: PAYMENT_CONFIG.NAGAD_NUMBER
  },
  {
    id: 'Binance Pay',
    name: 'Binance Pay',
    type: 'Pay ID / USDT',
    isActive: false // DISABLED / OFF for now
  },
  {
    id: 'Bank Transfer',
    name: 'Bank Transfer',
    type: 'Direct Banking',
    isActive: false // DISABLED / OFF for now
  }
];
