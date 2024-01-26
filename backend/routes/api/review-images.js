const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ReviewImage } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

// REQ AUTH - Delete a Review Image
router.delete('/:imageId', authCheck, async (req, res, next) => {
    res.json({ route: "delete/review-images/:imageId" })
})

module.exports = router;
