import { Router } from 'express';
import { login, register } from '../controller/authController.mjs';
import { authMiddleware } from '../middlewares/authMiddleware.mjs';

const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', login);

// POST /api/auth/register
authRouter.post('/register', register);

// GET /api/auth/profile (protegido con JWT)
authRouter.get('/profile', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

export default authRouter;