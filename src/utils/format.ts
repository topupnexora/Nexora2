export const formatPrice = (amount: number): string => {
  return `৳ ${amount.toLocaleString('en-BD')}`;
};

export const generateOrderId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `NEX-${year}${month}${day}-${random}`;
};

export const formatDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
};

export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 7) return phone;
  const clean = phone.trim();
  const start = clean.slice(0, 3);
  const end = clean.slice(-3);
  return `${start}•••••${end}`;
};

export const maskTrxId = (trx: string): string => {
  if (!trx || trx.length <= 4) return trx;
  return `${trx.slice(0, 3)}••••${trx.slice(-2)}`;
};

export const isValidBDPhone = (phone: string): boolean => {
  const clean = phone.replace(/[\s-]/g, '');
  // Bangladesh numbers: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
  return /^(?:\+?88)?01[3-9]\d{8}$/.test(clean);
};
