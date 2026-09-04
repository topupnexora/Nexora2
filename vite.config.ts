import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function telegramDevApiPlugin(): Plugin {
  return {
    name: 'telegram-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/telegram-order', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let bodyStr = '';
        req.on('data', (chunk: Buffer) => {
          bodyStr += chunk.toString();
        });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const body = bodyStr ? JSON.parse(bodyStr) : {};
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;

            if (!botToken || !chatId) {
              console.log('[NEXORA Dev API] Order notification received. TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set. (Handled gracefully)');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: false,
                  configured: false,
                  message: 'Telegram credentials not configured in local environment.'
                })
              );
              return;
            }

            function escapeHtml(str: any): string {
              if (str === undefined || str === null || str === '') return 'N/A';
              return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            }

            const nexoraReceiving = body.nexoraReceivingNumber || '01638749806';
            const senderNumber = body.paymentSenderNumber || body.senderPhone || 'Not provided';
            const contactNumber = body.customerPhone || body.phone || 'N/A';
            const customerEmailStr = body.customerEmail || body.email || 'Not provided';
            const serverZoneStr = body.serverZoneId || body.serverId || 'N/A';
            const trxIdStr = body.transactionId && String(body.transactionId).trim() ? String(body.transactionId).trim() : 'Not provided';
            const currentDateTime = body.dateTime || new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' });
            const orderStatusStr = body.status || 'Pending';

            const telegramMessage = `🎮 <b>NEXORA NEW ORDER</b>

🆔 <b>Order ID:</b> <code>${escapeHtml(body.orderId)}</code>

🎯 <b>Game:</b> ${escapeHtml(body.game)}

📦 <b>Package:</b> ${escapeHtml(body.package)}

🔢 <b>Quantity:</b> ${escapeHtml(body.quantity || 1)}

👤 <b>Player ID:</b> <code>${escapeHtml(body.playerId)}</code>

🌐 <b>Server/Zone ID:</b> ${escapeHtml(serverZoneStr)}

💳 <b>Payment Method:</b> ${escapeHtml(body.paymentMethod)}

📱 <b>NEXORA Receiving Number:</b> <code>${escapeHtml(nexoraReceiving)}</code>

📲 <b>Customer Payment Number:</b> <code>${escapeHtml(senderNumber)}</code>

💵 <b>Amount:</b> ৳${escapeHtml(body.amount)}

🧾 <b>Transaction ID:</b> <code>${escapeHtml(trxIdStr)}</code>

👤 <b>Customer Name:</b> ${escapeHtml(body.customerName || 'N/A')}

📞 <b>Customer Contact Number:</b> <code>${escapeHtml(contactNumber)}</code>

📧 <b>Customer Email:</b> ${escapeHtml(customerEmailStr)}

🕐 <b>Date/Time:</b> ${escapeHtml(currentDateTime)}

📌 <b>Status:</b> ${escapeHtml(orderStatusStr)}

⚠️ Payment must be verified before processing.

💬 Support: https://t.me/callmeriyadh`;

            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: 'HTML'
              })
            });

            const result = await response.json();
            res.statusCode = 200;
            res.end(JSON.stringify({ success: result.ok, result }));
          } catch (err: any) {
            console.error('[NEXORA Dev API] Error processing order:', err);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), telegramDevApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
