const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const c = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');
router.get('/', authenticate, asyncHandler(c.list));
router.post('/', authenticate, asyncHandler(c.create));
router.patch('/:id/resolve', authenticate, authorize('admin'), asyncHandler(c.resolve));
router.patch('/:id/dismiss', authenticate, authorize('admin'), asyncHandler(c.dismiss));
module.exports = router;
