const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');
const auth = require('../middleware/auth');



router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

router.get('/users', auth, userController.getUsers);


module.exports = router;




