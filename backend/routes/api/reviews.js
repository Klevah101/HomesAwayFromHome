const router = require('express').Router();

const { check } = require('express-validator');
const { authCheck } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .custom(val => {
            if (val <= 0 || val > 5) return false;
            return true;
        })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.get('/current', authCheck, async (req, res, next) => {
    const { user } = req
    let reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: {
                    model: SpotImage,
                    where: {
                        preview: true
                    }
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    reviews = JSON.stringify(reviews)
    reviews = JSON.parse(reviews)

    for (let i = 0; i < reviews.length; i++) {
        reviews[i].Spot.previewImage = reviews[i].Spot.SpotImages[0].url;
        delete reviews[i].Spot.SpotImages
    }

    const Reviews = reviews;
    return res.json({ Reviews })
})

// REQ AUTH - Create an Image for a Review
router.post('/:reviewId/images', authCheck, async (req, res, next) => {

    const { user } = req;
    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId)

    if (review === null) {
        const err = new Error("Review couldn't be found")
        err.status = 404;
        return next(err);
    }

    if (review.userId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const numReviewImages = await ReviewImage.count({
        where: {
            reviewId: reviewId
        }
    })

    if (numReviewImages >= 10) {
        const err = new Error("Maximum number of images for this resource was reached")
        err.status = 403;
        return next(err);
    }

    const newReviewImageEntry = {
        reviewId: reviewId,
        url: url
    }

    const newReviewImage = await ReviewImage.create(newReviewImageEntry)

    let returnReviewImage = JSON.stringify(newReviewImage);
    returnReviewImage = JSON.parse(returnReviewImage);

    delete returnReviewImage.createdAt;
    delete returnReviewImage.updatedAt;
    delete returnReviewImage.reviewId;

    return res.json(returnReviewImage);
})

// REQ AUTH - Edit a Review
router.put('/:reviewId', authCheck, validateReview, async (req, res, next) => {

    const { user } = req;
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    const gotReview = await Review.findByPk(reviewId);

    if (gotReview === null) {
        const err = new Error("Review couldn't be found")
        err.status = 404;
        return next(err);
    }

    if (gotReview.userId !== user.id) {
        const err = new Error("Forbidden")
        err.status = 403;
        return next(err);
    }

    const reviewEntry = {}

    if (review) reviewEntry["review"] = review
    if (stars) reviewEntry["stars"] = parseInt(stars)

    await gotReview.update(reviewEntry);

    return res.json(gotReview)
})

// REQ AUTH - Delete a Review
router.delete('/:reviewId', authCheck, async (req, res, next) => {

    const { user } = req;
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId)

    if (review === null) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }

    

    if (review.userId !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    await Review.destroy({
        where: {
            id: review.id
        }
    });

    return res.json({ "message": "Successfully deleted" })
})

module.exports = router;
