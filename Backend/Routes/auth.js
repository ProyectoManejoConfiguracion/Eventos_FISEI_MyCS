// Routes/auth.js
const express = require('express');
const router = express.Router();
const {
  recover,
  resetPassword
} = require('../Controllers/personasController');

router.post('/recover', recover);
router.post('/reset-password', resetPassword);

module.exports = router;
