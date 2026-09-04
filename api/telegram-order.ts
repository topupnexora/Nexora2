/**
 * Vercel Serverless Function & Local Dev Handler for Telegram Admin Alerts
 * 
 * Environment Variables required:
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 */

function escapeHtml(str: string | number | undefined | null): string {
  if (str === undefined || str === null || str === '') return 'N/A';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req: any, res: any) {
  // Allow POST requests only
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const {
    orderId,
    customerName,
    phone,
    email,
    game,
    package: packageName,
    playerId,
    serverId,
    quantity,
    amount,
    paymentMethod,
    transactionId,
    status,
    dateTime
  } = req.body || {};

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // If credentials are not configured, handle gracefully without erroring checkout
  if (!botToken || !chatId) {
    console.warn('[NEXORA Serverless] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured in environment variables.');
    return res.status(200).json({
      success: false,
      configured: false,
      message: 'Order recorded. Telegram credentials (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID) are not configured.'
    });
  }

  // Format exact Telegram message requested using safe HTML mode
  const telegramMessage = `🛒 <b>NEW NEXORA ORDER</b>

<b>Order ID:</b> <code>${escapeHtml(orderId)}</code>
<b>Game:</b> ${escapeHtml(game)}
<b>Package:</b> ${escapeHtml(packageName)}
<b>Quantity:</b> ${quantity || 1}
<b>Total Price:</b> ৳${escapeHtml(amount)}
<b>Player ID / UID:</b> <code>${escapeHtml(playerId)}</code>
<b>Server / Zone ID:</b> ${escapeHtml(serverId || 'N/A')}
<b>Payment Method:</b> ${escapeHtml(paymentMethod)}
<b>Transaction ID / Reference:</b> <code>${escapeHtml(transactionId)}</code>
<b>Customer Name:</b> ${escapeHtml(customerName || 'N/A')}
<b>Customer Phone:</b> <code>${escapeHtml(phone || 'N/A')}</code>
<b>Order Date &amp; Time:</b> ${escapeHtml(dateTime || new Date().toLocaleString())}
<b>Status:</b> 🟡 ${escapeHtml(status || 'Pending')} (Awaiting Verification)`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('[NEXORA Serverless] Telegram API returned an error:', data);
      return res.status(200).json({
        success: false,
        error: data.description || 'Telegram API error',
        configured: true
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Telegram admin notification sent successfully'
    });
  } catch (error: any) {
    console.error('[NEXORA Serverless] Telegram dispatch exception:', error);
    return res.status(200).json({
      success: false,
      error: error.message || 'Network exception when contacting Telegram',
      configured: true
    });
  }
}
