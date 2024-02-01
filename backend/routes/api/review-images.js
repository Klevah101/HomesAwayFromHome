const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ReviewImage } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

// REQ AUTH - Delete a Review Image
router.delete('/:imageId', authCheck, async (req, res, next) => {
    const { imageId } = req.params;

    const image = await ReviewImage.findByPk(imageId);
    const review = await ReviewImage.findOne({
        where: {
            id: image.reviewId
        }
    })

    if (review.userId !== userInfo.id) {
        let err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }
    
    await ReviewImage.destroy({
        where: {
            id: imageId
        }
    })


    return res.json({ "message": "Successfully deleted" })
    // return res.json({ route: "delete/review-images/:imageId" })
})

module.exports = router;
