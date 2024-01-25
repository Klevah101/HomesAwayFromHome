const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ReviewImage } = require('../../db/models');

// REQ AUTH - Delete a Review Image
router.delete('/:imageId', async (req, res, next) => {
    res.json({ route: "delete/review-images/:imageId" })
})

module.exports = router;
