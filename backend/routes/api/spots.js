const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { authCheck } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        // .isLatLong() // not correct, might change to custom
        .custom(val => {
            if (val > 90 || val < -90) return false;
            return true;
        })
        .withMessage('Latitude is not valid'),
    check('lng')
        // .isLatLong() // not correct, might change to custom
        .custom(val => {
            if (val > 180 || val < -180) return false;
            return true;
        })
        .withMessage('Longitude is not valid'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .custom(val => {
            if (val <= 0) return false;
            return true;
        }) ///////////////////////////////////////////////////////////////
        .withMessage('Price per day is required'),
    handleValidationErrors
];


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

// Get All Spots With Params
router.get('/', async (req, res, next) => {
    res.json({ route: "get/spots?" })
})

// REQ AUTH - Get Spots of Current User
router.get('/current', authCheck, async (req, res, next) => {

    return res.json(req.user)
    // return res.json({ route: "get/spots/current" })
})

// Get Reviews by Spot Id - Verify Creation, Prevention, Image Update
router.get('/:spotId/reviews', async (req, res, next) => {
    res.json({ route: "get/spots/:spotId/reviews" })
})

// REQ AUTH - Get All Bookings for a Spot
router.get('/:spotId/bookings', authCheck, async (req, res, next) => {
    res.json({ route: "get/spots/:spotId/bookings" })
})

// Get All Spots by Spot Id
router.get('/:spotId', async (req, res, next) => {
    res.json({ route: "get/spots/:spotId" })
})

// REQ AUTH - Create a Spot
router.post('/', authCheck, validateSpot, async (req, res, next) => {
    res.json({ route: "post/spots" })
})

// REQ AUTH - Create a Review for a Spot
router.post('/:spotId/reviews', authCheck, validateReview, async (req, res, next) => {
    res.json({ route: "post/spots/:spotId/reviews" })
})

// REQ AUTH - Create an Image for a Spot
router.post('/:spotId/images', authCheck, async (req, res, next) => {
    res.json({ route: "post/spots/:spotId/images" })
})

// REQ AUTH - Create a Booking
router.post('/:spotId/bookings', authCheck, async (req, res, next) => {
    res.json({ route: "post/spots/:spotId/bookings" })
})

// REQ AUTH - Edit a Spot
router.put('/:spotId', authCheck, validateSpot, async (req, res, next) => {
    res.json({ route: "put/spots/:spotId" })
})

// REQ AUTH - Delete a Spot
router.delete('/:spotId', authCheck, async (req, res, next) => {
    res.json({ route: "delete/spots/:spotId" })
})


module.exports = router;
