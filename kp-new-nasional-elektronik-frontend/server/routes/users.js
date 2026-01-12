const express = require('express');

const router = express.Router();

const {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers, 
    getUserByEmail,
    login
  } = require('../controllers/users');

  router.route('/')
  .get(getAllUsers)
  .post(createUser);

  router.route('/login')
  .post(login);

  router.route('/:id')
  .get(getUser)
  .put(updateUser) 
  .delete(deleteUser);

  router.route('/email/:email')
  .get(getUserByEmail);


  module.exports = router;