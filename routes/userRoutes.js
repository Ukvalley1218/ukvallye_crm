import express from 'express';

import { createUser,getUserById,getUsers,updateUser,deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.route("/")
  .post(createUser) // create user
  .get(getUsers);   // get all users

router.route("/:id")
  .get(getUserById) // get single user
  .put(updateUser)  // update user
  .delete(deleteUser); // delete user

export default router;