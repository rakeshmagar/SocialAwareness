require('dotenv').config();
const sequelize = require('./config/database');
const app = require('./app');
const { User } = require('./models');
const { hashPassword } = require('./utils/password');

async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const [admin, created] = await User.findOrCreate({
    where: { email },
    defaults: { fullName: process.env.ADMIN_NAME || 'System Administrator', email, phone: null, passwordHash: await hashPassword(password), role: 'admin' },
  });
  if (!created && admin.role !== 'admin') { admin.role = 'admin'; await admin.save(); }
}

async function start() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established.');
    await sequelize.sync();
    console.log('Database schema synchronized.');
    await ensureAdmin();
    const port = Number(process.env.PORT || 5000);
    app.listen(port, () => console.log(`SocialConnect API running on http://localhost:${port}`));
  } catch (error) {
    console.error('Unable to start API:', error.message);
    process.exit(1);
  }
}
start();
