const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ReviewImage } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

// REQ AUTH - Delete a Review Image
router.delete('/:imageId', authCheck, async (req, res, next) => {
    const { imageId } = req.params;
    const image = await ReviewImage.findByPk(imageId)

    await ReviewImage.destroy(image)
    return res.json({ route: "ded" })
    return res.json({ route: "delete/review-images/:imageId" })
})

module.exports = router;
