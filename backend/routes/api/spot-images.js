const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

// REQ AUTH - Delete a Spot Image
router.delete('/:imageId', authCheck, async (req, res, next) => {
    res.json({ route: "delete/spot-images/:imageId" })
})

module.exports = router;
