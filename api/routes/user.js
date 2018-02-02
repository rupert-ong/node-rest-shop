const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
const checkAdminOrSameUser = require('../middleware/check-admin-or-same-user');

router.post('/signup', UserController.user_sign_up);

router.post('/login', UserController.user_login);

router.post('/signout', (req, res, next) => {});

router.delete('/:userId', checkAuth, checkAdminOrSameUser, UserController.user_delete_user);

module.exports = router;