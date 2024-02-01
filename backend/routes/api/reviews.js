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


// REQ AUTH - Get Reviews of Current User
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

    console.log(reviews.length)
    // returnObj.Reviews = reviews

    for (let i = 0; i < reviews.length; i++) {
        reviews[i].Spot.previewImage = reviews[i].Spot.SpotImages[0].url;
        delete reviews[i].Spot.SpotImages
    }

    return res.json({ reviews })
    // res.json({ route: "get/reviews/current" })
})

// REQ AUTH - Create an Image for a Review
router.post('/:reviewId/images', authCheck, async (req, res, next) => {

    // reviewId is null in postman.  ask for help.

    const { user } = req;
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
        // set error title
        // set status code
        err.status = 403;
        // next(err)
        return next(err);
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

    if (gotReview === null) {
        // create err 
        const err = new Error("Review couldn't be found")
        // set error title
        // set status code
        err.status = 404;
        // next(err)
        return next(err);
    }

    if (gotReview.userId !== user.id) {
        // create err 
        const err = new Error("Review couldn't be found")
        // set error title
        // set status code
        err.status = 403;
        // next(err)
        return next(err);
    }

    const reviewEntry = {}

    if (review) reviewEntry["review"] = review
    if (stars) reviewEntry["stars"] = parseInt(stars)

    await gotReview.update(reviewEntry);

    return res.json(gotReview)
    // res.json({ route: "put/reviews/:reviewId" })
})

// REQ AUTH - Delete a Review
router.delete('/:reviewId', authCheck, async (req, res, next) => {

    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId)
    if (Review.id !== user.id) {
        const err = new Error("Forbidden");
        err.status = 403
        return next(err);
    }

    await Review.destroy({
        where: {
            id: review.id
        }
    });

    return res.json("ded")
    // return res.json({ route: "delete/reviews/:reviewId" })
})

module.exports = router;
