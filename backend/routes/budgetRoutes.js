const express = require('express');
const { setBudget, getBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getBudget).post(setBudget);

module.exports = router;
