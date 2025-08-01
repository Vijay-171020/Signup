const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);

router.get('/users', userController.getUsers);
router.get('/users/:id', auth, userController.getUserById);
router.put('/users/:id', auth, userController.updateUser);
router.delete('/users/:id', auth, userController.deleteUser);

module.exports = router;




