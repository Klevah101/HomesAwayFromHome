const router = require('express').Router();

const { check } = require('express-validator');
const { authCheck } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Review, ReviewImage } = require('../../db/models');

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


// REQ AUTH - Get Reviews of Current User
router.get('/current', authCheck, async (req, res, next) => {
    const { user } = req
    const reviews = await Review.findAll({
        where: {
            userId: user.id
        }
    })
    res.json(reviews)
    // res.json({ route: "get/reviews/current" })
})

// REQ AUTH - Create an Image for a Review
router.post('/:reviewId/images', authCheck, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId)

    if (review === null) {
        // create err 
        const err = new Error("Review couldn't be found")
        // set error title
        // set status code
        err.status = 404;
        // next(err)
        next(err);
    }

    const numReviewImages = await ReviewImage.count({
        where: {
            reviewId: reviewId
        }
    })

    if (numReviewImages >= 10) {
        const err = new Error("Maximum number of images for this resource was reached")
        // set error title
        // set status code
        err.status = 403;
        // next(err)
        next(err);
    }

    const newReviewImageEntry = {
        reviewId: reviewId,
        url: url
    }

    const newReviewImage = await ReviewImage.create(newReviewImageEntry)


    return res.json(newReviewImage)
})

// REQ AUTH - Edit a Review
router.put('/:reviewId', authCheck, validateReview, async (req, res, next) => {

    const { reviewId } = req.params;
    const { review, stars } = req.body;

    const gotReview = await Review.findByPk(reviewId);

    if(gotReview === null){
          // create err 
          const err = new Error("Review couldn't be found")
          // set error title
          // set status code
          err.status = 404;
          // next(err)
          next(err);
    }

    const reviewEntry = {}

    if (review) reviewEntry["review"] = review
    if (stars) reviewEntry["stars"] = parseInt(stars)

    await gotReview.update(reviewEntry);

    res.json(gotReview)
    // res.json({ route: "put/reviews/:reviewId" })
})

// REQ AUTH - Delete a Review
router.delete('/:reviewId', authCheck, async (req, res, next) => {
    res.json({ route: "delete/reviews/:reviewId" })
})

module.exports = router;
