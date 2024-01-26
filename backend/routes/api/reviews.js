const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Review } = require('../../db/models');

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
router.get('/current', async (req, res, next) => {
    res.json({ route: "get/reviews/current" })
})

// REQ AUTH - Create an Image for a Review
router.post('/:reviewId/images', async (req, res, next) => {
    res.json({ route: "post/reviews/:reviewId/images" })
})

// REQ AUTH - Edit a Review
router.put('/:reviewId', validateReview, async (req, res, next) => {
    res.json({ route: "put/reviews/:reviewId" })
})

// REQ AUTH - Delete a Review
router.delete('/:reviewId', async (req, res, next) => {
    res.json({ route: "delete/reviews/:reviewId" })
})

module.exports = router;
