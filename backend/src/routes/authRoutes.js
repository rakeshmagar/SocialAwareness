const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const controller = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
router.post('/register', asyncHandler(controller.register));
router.post('/login', asyncHandler(controller.login));
router.get('/me', authenticate, asyncHandler(controller.me));
module.exports = router;
