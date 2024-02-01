const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { ReviewImage, Review } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

// REQ AUTH - Delete a Review Image
router.delete('/:imageId', authCheck, async (req, res, next) => {
    const { user } = req;
    const { imageId } = req.params;

    const image = await ReviewImage.findByPk(imageId);

    if (image === null) {
        const err = new Error("Review Image couldn't be found")
        err.status = 404;
        return next(err);
    }

    const review = await Review.findOne({
        where: {
            id: image.reviewId
        }
    })

    // console.log('//////////////////////', imageId, '///////////////////////')

    if (review.userId !== user.id) {
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
