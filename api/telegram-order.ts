/**
 * Vercel Serverless Function & Local Dev Handler for Telegram Admin Alerts
 * 
 * Environment Variables required:
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 */

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
      message: 'Order recorded locally. Telegram credentials are not configured in environment variables.'
    });
  }

  // Format exact Telegram message requested
  const telegramMessage = `🛒 *NEW NEXORA ORDER*

*Order ID:* \`${orderId || 'N/A'}\`
*Customer Name:* ${customerName || 'N/A'}
*Phone:* \`${phone || 'N/A'}\`
*Email:* ${email || 'N/A'}
*Game:* ${game || 'N/A'}
*Package:* ${packageName || 'N/A'}
*Player ID:* \`${playerId || 'N/A'}\`
*Server ID:* \`${serverId || 'N/A'}\`
*Quantity:* ${quantity || 1}
*Amount:* ${amount || 'N/A'}
*Payment Method:* ${paymentMethod || 'N/A'}
*Transaction ID:* \`${transactionId || 'N/A'}\`
*Status:* 🟡 ${status || 'Pending'}
*Date/Time:* ${dateTime || new Date().toISOString()}`;

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
        parse_mode: 'Markdown'
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
