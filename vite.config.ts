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

            const telegramMessage = `🛒 <b>NEW NEXORA ORDER</b>

<b>Order ID:</b> <code>${escapeHtml(body.orderId)}</code>
<b>Game:</b> ${escapeHtml(body.game)}
<b>Package:</b> ${escapeHtml(body.package)}
<b>Quantity:</b> ${body.quantity || 1}
<b>Total Price:</b> ৳${escapeHtml(body.amount)}
<b>Player ID / UID:</b> <code>${escapeHtml(body.playerId)}</code>
<b>Server / Zone ID:</b> ${escapeHtml(body.serverId || 'N/A')}
<b>Payment Method:</b> ${escapeHtml(body.paymentMethod)}
<b>Transaction ID / Reference:</b> <code>${escapeHtml(body.transactionId)}</code>
<b>Customer Name:</b> ${escapeHtml(body.customerName || 'N/A')}
<b>Customer Phone:</b> <code>${escapeHtml(body.phone || 'N/A')}</code>
<b>Order Date &amp; Time:</b> ${escapeHtml(body.dateTime || new Date().toLocaleString())}
<b>Status:</b> 🟡 ${escapeHtml(body.status || 'Pending')} (Awaiting Verification)`;

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
