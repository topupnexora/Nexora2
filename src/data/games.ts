import { Game } from '../types';

export const GAMES_DATA: Game[] = [
  {
    id: 'free-fire',
    name: 'Free Fire',
    shortName: 'FF',
    category: 'Battle Royale',
    description: 'Instant top-up for Garena Free Fire Diamonds in Bangladesh. 100% safe, fast UID delivery straight into your account within 1-5 minutes.',
    detailedInstructions: 'Enter your 8-10 digit Free Fire Player UID found in your in-game profile tab. No password required.',
    image: '/images/games/free-fire.jpg',
    bannerImage: '/images/games/free-fire.jpg',
    popular: true,
    featured: true,
    deliveryTime: 'Instant (1-3 Mins)',
    publisher: 'Garena',
    fields: [
      {
        id: 'playerId',
        label: 'Player UID',
        placeholder: 'e.g. 1234567890',
        helperText: 'Find your numeric UID in your in-game Free Fire profile under your avatar.',
        required: true
      }
    ],
    packages: [
      { id: 'ff-100', name: '100 Diamonds', amount: 100, unit: 'Diamonds', price: 85, originalPrice: 95 },
      { id: 'ff-115', name: '115 Diamonds', amount: 115, unit: 'Diamonds', price: 95, originalPrice: 110, badge: 'Popular', isPopular: true },
      { id: 'ff-240', name: '240 Diamonds', amount: 240, unit: 'Diamonds', price: 190, originalPrice: 215 },
      { id: 'ff-355', name: '355 Diamonds', amount: 355, unit: 'Diamonds', price: 280, originalPrice: 320, badge: 'Hot' },
      { id: 'ff-610', name: '610 Diamonds', amount: 610, unit: 'Diamonds', price: 475, originalPrice: 530, badge: 'Best Value' },
      { id: 'ff-1240', name: '1240 Diamonds', amount: 1240, unit: 'Diamonds', price: 950, originalPrice: 1050 },
      { id: 'ff-2530', name: '2530 Diamonds', amount: 2530, unit: 'Diamonds', price: 1890, originalPrice: 2100, badge: 'Pro Pack' }
    ]
  },
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    shortName: 'PUBG',
    category: 'Battle Royale',
    description: 'Buy PUBG Mobile Unknown Cash (UC) instantly in Bangladesh. Safe and reliable global top-up using Player ID only.',
    detailedInstructions: 'Enter your PUBG Mobile Numeric Character ID. You can find this by clicking on your avatar at the top left of the main lobby.',
    image: '/images/games/pubg-mobile.jpg',
    bannerImage: '/images/games/pubg-mobile.jpg',
    popular: true,
    featured: true,
    deliveryTime: 'Instant (2-5 Mins)',
    publisher: 'Krafton / Tencent',
    fields: [
      {
        id: 'playerId',
        label: 'Player ID (Character ID)',
        placeholder: 'e.g. 5123456789',
        helperText: 'Find your numeric ID on your PUBG profile card.',
        required: true
      }
    ],
    packages: [
      { id: 'pubg-60', name: '60 UC', amount: 60, unit: 'UC', price: 95, originalPrice: 110 },
      { id: 'pubg-325', name: '325 UC', amount: 325, unit: 'UC', price: 475, originalPrice: 520, badge: 'Popular', isPopular: true },
      { id: 'pubg-660', name: '660 UC', amount: 660, unit: 'UC', price: 950, originalPrice: 1050, badge: 'Royale Pass' },
      { id: 'pubg-1800', name: '1800 UC', amount: 1800, unit: 'UC', price: 2450, originalPrice: 2700, badge: 'Bonus UC' },
      { id: 'pubg-3850', name: '3850 UC', amount: 3850, unit: 'UC', price: 4950, originalPrice: 5400, badge: 'Best Value' }
    ]
  },
  {
    id: 'mobile-legends',
    name: 'Mobile Legends: Bang Bang',
    shortName: 'MLBB',
    category: 'MOBA',
    description: 'Instant Mobile Legends Diamonds top-up. Cheap BDT prices, instant delivery to your MLBB account with User ID and Zone ID.',
    detailedInstructions: 'Enter your User ID and Zone ID (in brackets). For example: If your ID is 12345678 (1234), User ID is 12345678 and Zone ID is 1234.',
    image: '/images/games/mobile-legends.jpg',
    bannerImage: '/images/games/mobile-legends.jpg',
    popular: true,
    featured: true,
    deliveryTime: 'Instant (1-3 Mins)',
    publisher: 'Moonton',
    fields: [
      {
        id: 'playerId',
        label: 'User ID',
        placeholder: 'e.g. 12345678',
        helperText: 'Your main User ID found before the bracket.',
        required: true
      },
      {
        id: 'zoneId',
        label: 'Zone ID / Server ID',
        placeholder: 'e.g. 1234',
        helperText: 'The 4-5 digit number enclosed inside the brackets next to your User ID.',
        required: true
      }
    ],
    packages: [
      { id: 'mlbb-86', name: '86 Diamonds', amount: 86, unit: 'Diamonds', price: 160, originalPrice: 180 },
      { id: 'mlbb-172', name: '172 Diamonds', amount: 172, unit: 'Diamonds', price: 310, originalPrice: 350 },
      { id: 'mlbb-257', name: '257 Diamonds', amount: 257, unit: 'Diamonds', price: 460, originalPrice: 510, badge: 'Popular', isPopular: true },
      { id: 'mlbb-343', name: '343 Diamonds', amount: 343, unit: 'Diamonds', price: 615, originalPrice: 680 },
      { id: 'mlbb-429', name: '429 Diamonds', amount: 429, unit: 'Diamonds', price: 765, originalPrice: 850, badge: 'Best Value' },
      { id: 'mlbb-514', name: '514 Diamonds', amount: 514, unit: 'Diamonds', price: 915, originalPrice: 1020 }
    ]
  },
  {
    id: 'cod-mobile',
    name: 'Call of Duty: Mobile',
    shortName: 'CODM',
    category: 'FPS',
    description: 'Get Call of Duty Mobile CP (COD Points) fast and cheap in Bangladesh. Garena & Global supported via Player UID.',
    detailedInstructions: 'Find your CODM UID by clicking your player profile in the top-left corner, navigating to the player card tab, and copying the UID.',
    image: '/images/games/cod-mobile.jpg',
    bannerImage: '/images/games/cod-mobile.jpg',
    popular: true,
    featured: false,
    deliveryTime: 'Instant (2-5 Mins)',
    publisher: 'Activision',
    fields: [
      {
        id: 'playerId',
        label: 'Player UID',
        placeholder: 'e.g. 674284910294829104',
        helperText: 'Your 18-digit numeric UID in the CODM player profile tab.',
        required: true
      }
    ],
    packages: [
      { id: 'codm-80', name: '80 CP', amount: 80, unit: 'CP', price: 95, originalPrice: 110 },
      { id: 'codm-420', name: '420 CP', amount: 420, unit: 'CP', price: 475, originalPrice: 530, badge: 'Battle Pass', isPopular: true },
      { id: 'codm-880', name: '880 CP', amount: 880, unit: 'CP', price: 950, originalPrice: 1060, badge: 'Popular' },
      { id: 'codm-2400', name: '2400 CP', amount: 2400, unit: 'CP', price: 2490, originalPrice: 2750, badge: 'Best Value' }
    ]
  },
  {
    id: 'ea-fc-mobile',
    name: 'EA FC Mobile',
    shortName: 'FC Mobile',
    category: 'Sports',
    description: 'Top up EA SPORTS FC Mobile Points with instant delivery in BD. Level up your Ultimate Team with fast FC Points top-up.',
    detailedInstructions: 'Open FC Mobile Settings -> Link Accounts / Profile to copy your unique UID or Player ID.',
    image: '/images/games/ea-fc-mobile.jpg',
    bannerImage: '/images/games/ea-fc-mobile.jpg',
    popular: false,
    featured: false,
    deliveryTime: 'Instant (3-7 Mins)',
    publisher: 'EA Sports',
    fields: [
      {
        id: 'playerId',
        label: 'Player ID / UID',
        placeholder: 'e.g. 98124018401',
        helperText: 'Find your User ID in game settings under the Customer Service/Credits tab.',
        required: true
      }
    ],
    packages: [
      { id: 'eafc-500', name: '500 FC Points', amount: 500, unit: 'FC Points', price: 490, originalPrice: 550 },
      { id: 'eafc-1050', name: '1050 FC Points', amount: 1050, unit: 'FC Points', price: 980, originalPrice: 1100, badge: 'Popular', isPopular: true },
      { id: 'eafc-2200', name: '2200 FC Points', amount: 2200, unit: 'FC Points', price: 1950, originalPrice: 2200, badge: 'Best Value' },
      { id: 'eafc-5750', name: '5750 FC Points', amount: 5750, unit: 'FC Points', price: 4800, originalPrice: 5300, badge: 'Mega Pack' }
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    shortName: 'Roblox',
    category: 'Sandbox',
    description: 'Instant Roblox Robux top-up for Bangladeshi gamers. Fast delivery to your Roblox username or ID. Safe and guaranteed.',
    detailedInstructions: 'Enter your exact Roblox Username (or numeric Roblox User ID). Please make sure spelling and capitalization match your account.',
    image: '/images/games/roblox.jpg',
    bannerImage: '/images/games/roblox.jpg',
    popular: true,
    featured: true,
    deliveryTime: 'Instant (1-5 Mins)',
    publisher: 'Roblox Corporation',
    fields: [
      {
        id: 'playerId',
        label: 'Username / User ID',
        placeholder: 'e.g. GamerPro_BD',
        helperText: 'Enter your Roblox Username accurately without spaces.',
        required: true
      }
    ],
    packages: [
      { id: 'rbx-400', name: '400 Robux', amount: 400, unit: 'Robux', price: 490, originalPrice: 550 },
      { id: 'rbx-800', name: '800 Robux', amount: 800, unit: 'Robux', price: 960, originalPrice: 1080, badge: 'Popular', isPopular: true },
      { id: 'rbx-1700', name: '1700 Robux', amount: 1700, unit: 'Robux', price: 1950, originalPrice: 2200, badge: 'Best Value' },
      { id: 'rbx-4500', name: '4500 Robux', amount: 4500, unit: 'Robux', price: 4850, originalPrice: 5400, badge: 'High Roller' }
    ]
  }
];

export const CATEGORIES = ['All', 'Battle Royale', 'MOBA', 'FPS', 'Sports', 'Sandbox'] as const;

export const REVIEWS = [
  {
    id: '1',
    name: 'Tanvir Ahmed',
    game: 'Free Fire',
    rating: 5,
    comment: 'Instant 610 diamonds delivery within 2 minutes via bKash! NEXORA is the fastest top-up site in Bangladesh.',
    date: 'Yesterday'
  },
  {
    id: '2',
    name: 'Sabbir Hossain',
    game: 'PUBG Mobile',
    rating: 5,
    comment: 'Got my 660 UC for Royale Pass instantly. The instructions were super clear and customer support helped right away.',
    date: '2 days ago'
  },
  {
    id: '3',
    name: 'Rifat Chowdhury',
    game: 'Mobile Legends',
    rating: 5,
    comment: 'Zone ID was easy to input and got diamonds before my ranked match started. Best pricing in BDT!',
    date: '3 days ago'
  },
  {
    id: '4',
    name: 'Nayeem Islam',
    game: 'Roblox',
    rating: 5,
    comment: 'Bought 1700 Robux for my sibling. Payment with Nagad was smooth and verified quickly.',
    date: '5 days ago'
  }
];

export const FAQS_DATA = [
  {
    id: 'how-to-top-up',
    question: 'How do I top up my game on NEXORA?',
    answer: 'It\'s simple: 1) Select your game from the marketplace. 2) Enter your Player ID / UID (and Zone ID if required). 3) Choose your desired package. 4) Proceed to checkout and select bKash or Nagad. 5) Send the money to the provided number, input your Transaction ID, and submit! Your top-up will be processed within minutes.'
  },
  {
    id: 'delivery-time',
    question: 'How long does delivery take?',
    answer: 'Most top-ups are processed within 1 to 5 minutes after payment verification. During peak hours or maintenance, it may rarely take up to 15-20 minutes. You can track your order anytime on the Track Order page.'
  },
  {
    id: 'player-id-help',
    question: 'What is a Player ID / UID and how do I find it?',
    answer: 'A Player ID or UID is your unique numeric account identifier provided by the game. You can find it by tapping on your in-game profile picture or settings. We never ask for your game password or login credentials.'
  },
  {
    id: 'server-zone-id',
    question: 'What is Server ID / Zone ID (e.g. Mobile Legends)?',
    answer: 'Some games like Mobile Legends: Bang Bang require both a User ID and a Zone/Server ID. For instance, in "12345678 (2041)", 12345678 is the User ID and 2041 is the Zone ID.'
  },
  {
    id: 'payment-methods',
    question: 'What payment methods do you support in Bangladesh?',
    answer: 'We currently support bKash and Nagad (Personal Send Money). Manual verification ensures maximum safety and zero gateway failure fees.'
  },
  {
    id: 'transaction-id',
    question: 'What is a Transaction ID (TrxID)?',
    answer: 'After completing a Send Money transfer in bKash or Nagad, the payment app generates a unique Transaction ID (e.g. 9J4K2L8M or similar). Enter this TrxID on the checkout page so our automated system and admins can instantly match your payment.'
  },
  {
    id: 'order-tracking',
    question: 'How can I track my top-up order status?',
    answer: 'Visit the "Track Order" page in the navigation bar. Enter your NEXORA Order ID (e.g., NEX-20260904-XXXXXX) and your phone number to see real-time status updates.'
  },
  {
    id: 'failed-orders',
    question: 'What happens if I enter an incorrect Player ID?',
    answer: 'If you entered an invalid or non-existent Player ID, our team will flag it as Pending/On-Hold and contact you via Phone or Telegram (@callmeriyadh). If diamonds were delivered to an incorrect valid ID due to user typing mistake, it cannot be reversed, so please double check your ID before submitting.'
  },
  {
    id: 'refund-policy',
    question: 'What is the refund policy?',
    answer: 'If we fail to deliver your game items due to stock or technical issues, you are entitled to a full 100% refund back to your bKash or Nagad wallet within 24 hours. Contact our 24/7 support team on Telegram (@callmeriyadh).'
  },
  {
    id: 'customer-support',
    question: 'How do I reach NEXORA customer support?',
    answer: 'We provide 24/7 live customer support on Telegram (@callmeriyadh: https://t.me/callmeriyadh) and support email at riadhsn.39@gmail.com. You can click the "Chat on Telegram" button anywhere on the site or visit our Support page anytime!'
  }
];
