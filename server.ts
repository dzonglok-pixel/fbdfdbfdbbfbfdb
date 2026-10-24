import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'NetBanaSHOP',
    service: 'Zero-Ban Gaming Marketplace',
    timestamp: new Date().toISOString()
  });
});

// Mock order creation API
app.post('/api/orders', (req, res) => {
  const { gameId, server, amount, nickname, paymentGateway } = req.body;
  res.json({
    success: true,
    orderId: `NB-${Date.now().toString().slice(-6)}`,
    gameId,
    server,
    amount,
    nickname,
    paymentGateway,
    status: 'created',
    createdAt: new Date().toISOString()
  });
});

// Serve static assets from Vite dist in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[NetBanaSHOP] Production server running on http://0.0.0.0:${PORT}`);
});
