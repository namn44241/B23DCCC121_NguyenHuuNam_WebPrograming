// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Register
router.post('/register', UserController.register);

// Login
router.post('/login', UserController.login);

// Thêm route mới
router.get('/', UserController.getAllUsers);

module.exports = router;