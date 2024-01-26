const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
];

router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    console.log(credential, password)
    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    // console.log(user)
    // const newObj = { User };
    // newObj.User = user.dataValues;
    // console.log(newObj);

    // let jsonUser = JSON.stringify(user);
    // jsonUser = JSON.parse(jsonUser);
    // console.log(jsonUser)

    // console.log(typeof user)

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'Invalid credentials' };
        return next(err);
    }

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
}
);

router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
}
);

router.get('/', authCheck, (req, res) => {
    const { user } = req;
    // if (user) {
    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };
    return res.json({
        user: safeUser
    });
    // } else return res.json({ user: null });
}
);

function authCheck(req, res, next) {
    const { user } = req;
    if (user === null) return res.status(401).json({ message: "Authentication required" });
    next();
}


module.exports = router;
