import express from 'express';
import { register, login } from '../controllers/authController.js';
import { body } from 'express-validator';

const router = express.Router();

router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  register
);

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  login
);

export default router;