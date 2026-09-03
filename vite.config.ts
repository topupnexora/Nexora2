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

            const telegramMessage = `🛒 *NEW NEXORA ORDER*

*Order ID:* \`${body.orderId || 'N/A'}\`
*Customer Name:* ${body.customerName || 'N/A'}
*Phone:* \`${body.phone || 'N/A'}\`
*Email:* ${body.email || 'N/A'}
*Game:* ${body.game || 'N/A'}
*Package:* ${body.package || 'N/A'}
*Player ID:* \`${body.playerId || 'N/A'}\`
*Server ID:* \`${body.serverId || 'N/A'}\`
*Quantity:* ${body.quantity || 1}
*Amount:* ${body.amount || 'N/A'}
*Payment Method:* ${body.paymentMethod || 'N/A'}
*Transaction ID:* \`${body.transactionId || 'N/A'}\`
*Status:* 🟡 ${body.status || 'Pending'}
*Date/Time:* ${body.dateTime || new Date().toISOString()}`;

            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: 'Markdown'
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
