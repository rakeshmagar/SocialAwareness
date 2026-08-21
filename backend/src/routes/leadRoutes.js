const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const c = require('../controllers/leadController');
const { authenticate, authorize } = require('../middleware/auth');
router.get('/', asyncHandler(c.listOpen));
router.post('/', authenticate, authorize('business', 'admin'), asyncHandler(c.create));
router.post('/:id/respond', authenticate, asyncHandler(c.respond));
module.exports = router;
