const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { hashPassword, verifyPassword } = require('../utils/password');

function publicUser(user) {
  return { id: user.id, name: user.fullName, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role };
}

function signToken(user) {
  return jwt.sign({ role: user.role }, process.env.JWT_SECRET || 'dev-only-change-me', {
    subject: String(user.id),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

exports.register = async (req, res) => {
  const { fullName, email, phone, password, role = 'user' } = req.body;
  if (!fullName || fullName.trim().length < 3) return res.status(400).json({ message: 'Full name must be at least 3 characters.' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'A valid email is required.' });
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  if (!['user', 'business'].includes(role)) return res.status(400).json({ message: 'Only user or business self-registration is allowed.' });

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ where: { email: normalizedEmail } })) return res.status(409).json({ message: 'An account with this email already exists.' });

  const user = await User.create({ fullName: fullName.trim(), email: normalizedEmail, phone: phone?.trim() || null, passwordHash: await hashPassword(password), role });
  res.status(201).json({ message: 'Account created successfully.', user: publicUser(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return res.status(401).json({ message: 'Incorrect email or password.' });
  if (!user.isActive) return res.status(403).json({ message: 'This account has been disabled.' });
  res.json({ token: signToken(user), user: publicUser(user) });
};

exports.me = async (req, res) => res.json({ user: publicUser(req.user) });
