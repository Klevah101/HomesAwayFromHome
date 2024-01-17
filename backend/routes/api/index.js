
const express = require('express')
const router = express.Router();

const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);
module.exports = router;
