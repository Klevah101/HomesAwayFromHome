const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot } = require('../../db/models');

const validateCreateSpot = [
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
        .isFloat()
        .withMessage('Latitude is not valid'),
    check('lng')
        .isFloat()
        .withMessage('Longitude is not valid'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

// Get All Spots With Params
router.get('/', async (req, res, next) => {
    res.json({ route: "get/spots?" })
})

// REQ AUTH - Get Spots of Current User
router.get('/current', async (req, res, next) => {
    res.json({ route: "get/spots/current" })
})

// Get Reviews by Spot Id - Verify Creation, Prevention, Image Update
router.get('/:spotId/reviews', async (req, res, next) => {
    res.json({ route: "get/spots/:spotId/reviews" })
})

// REQ AUTH - Get All Bookings for a Spot
router.get('/:spotId/bookings', async (req, res, next) => {
    res.json({ route: "get/spots/:spotId/bookings" })
})

// Get All Spots by Spot Id
router.get('/:spotId', async (req, res, next) => {
    res.json({ route: "get/spots/:spotId" })
})

// REQ AUTH - Create a Spot
router.post('/', validateCreateSpot, async (req, res, next) => {
    res.json({ route: "post/spots" })
})

// REQ AUTH - Create a Review for a Spot
router.post('/:spotId/reviews', async (req, res, next) => {
    res.json({ route: "post/spots/:spotId/reviews" })
})

// REQ AUTH - Create an Image for a Spot
router.post('/:spotId/images', async (req, res, next) => {
    res.json({ route: "post/spots/:spotId/images" })
})

// REQ AUTH - Create a Booking
router.post('/:spotId/bookings', async (req, res, next) => {
    res.json({ route: "post/spots/:spotId/bookings" })
})

// REQ AUTH - Edit a Spot
router.put('/:spotId', async (req, res, next) => {
    res.json({ route: "put/spots/:spotId" })
})

// REQ AUTH - Delete a Spot
router.delete('/:spotId', async (req, res, next) => {
    res.json({ route: "delete/spots/:spotId" })
})


module.exports = router;
