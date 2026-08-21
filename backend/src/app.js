const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header (Postman, health checks, server-to-server)
      // are allowed. Browser requests must come from an explicitly configured URL.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS.'));
    },
    credentials: false,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'SocialConnect API' }));
app.get('/api/health/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

app.use((req, res) => res.status(404).json({ message: 'API route not found.' }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message === 'Origin is not allowed by CORS.') {
    return res.status(403).json({ message: err.message });
  }
  if (err.name === 'SequelizeValidationError') return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
  if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'That record already exists.' });
  return res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message });
});

module.exports = app;
