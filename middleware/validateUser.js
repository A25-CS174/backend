import { body, validationResult } from 'express-validator';

//middleware rules untuk input user
export const validateUser = [
    body('name')
    .notEmpty().withMessage('Nama wajib diisi')
    .isLength({ max: 100 }).withMessage('Nama minimal 3 karakter'),

    body('email')
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid'),

    body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),

    //Handler hasil evaluasi
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array().map(e => e.msg)
            });
        }
        next();
    }
];