import { PAYMENT_CONFIG } from './payment';

export const SITE_CONFIG = {
  name: 'NEXORA',
  tagline: 'POWER UP YOUR GAME',
  description: 'Bangladesh\'s #1 premium gaming top-up destination. Instant delivery for Free Fire, PUBG, MLBB, COD Mobile, EA FC & Roblox via bKash, Nagad, Binance Pay, and Bank Transfer.',
  currency: '৳',
  currencyCode: 'BDT',
  // Centralized payment recipient details from PAYMENT_CONFIG
  payment: PAYMENT_CONFIG,
  support: {
    telegramHandle: '@callmeriyadh',
    telegramUrl: 'https://t.me/callmeriyadh',
    email: 'riadhsn.39@gmail.com',
    hours: '24/7 (Avg. response < 5 mins)',
    location: 'Dhaka, Bangladesh'
  },
  social: {
    facebook: 'https://facebook.com/nexora.bd',
    instagram: 'https://instagram.com/nexora.bd',
    telegram: 'https://t.me/callmeriyadh'
  }
};

