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
    customerPhone,
    phone,
    customerEmail,
    email,
    game,
    package: packageName,
    playerId,
    serverZoneId,
    serverId,
    quantity,
    amount,
    paymentMethod,
    nexoraReceivingNumber,
    paymentSenderNumber,
    senderPhone,
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

  const nexoraReceiving = nexoraReceivingNumber || '01638749806';
  const senderNumber = paymentSenderNumber || senderPhone || 'Not provided';
  const contactNumber = customerPhone || phone || 'N/A';
  const customerEmailStr = customerEmail || email || 'Not provided';
  const serverZoneStr = serverZoneId || serverId || 'N/A';
  const trxIdStr = transactionId && String(transactionId).trim() ? String(transactionId).trim() : 'Not provided';
  const currentDateTime = dateTime || new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' });
  const orderStatusStr = status || 'Pending';

  // Format exact Telegram message requested
  const telegramMessage = `🎮 <b>NEXORA NEW ORDER</b>

🆔 <b>Order ID:</b> <code>${escapeHtml(orderId)}</code>

🎯 <b>Game:</b> ${escapeHtml(game)}

📦 <b>Package:</b> ${escapeHtml(packageName)}

🔢 <b>Quantity:</b> ${escapeHtml(quantity || 1)}

👤 <b>Player ID:</b> <code>${escapeHtml(playerId)}</code>

🌐 <b>Server/Zone ID:</b> ${escapeHtml(serverZoneStr)}

💳 <b>Payment Method:</b> ${escapeHtml(paymentMethod)}

📱 <b>NEXORA Receiving Number:</b> <code>${escapeHtml(nexoraReceiving)}</code>

📲 <b>Customer Payment Sender Number:</b> <code>${escapeHtml(senderNumber)}</code>

💵 <b>Amount:</b> ৳${escapeHtml(amount)}

🧾 <b>Transaction ID:</b> <code>${escapeHtml(trxIdStr)}</code>

👤 <b>Customer Name:</b> ${escapeHtml(customerName || 'N/A')}

📞 <b>Customer Contact Number:</b> <code>${escapeHtml(contactNumber)}</code>

📧 <b>Customer Email:</b> ${escapeHtml(customerEmailStr)}

🕐 <b>Date/Time:</b> ${escapeHtml(currentDateTime)}

📌 <b>Status:</b> ${escapeHtml(orderStatusStr)}

⚠️ Payment must be verified before processing.

💬 Support: https://t.me/callmeriyadh`;

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
