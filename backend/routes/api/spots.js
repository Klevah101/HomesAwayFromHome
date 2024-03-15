const router = require('express').Router();

const { Op } = require('sequelize')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { authCheck } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking, ReviewImage } = require('../../db/models');

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
        .custom(val => {
            if (val > 90 || val < -90) return false;
            return true;
        })
        .withMessage('Latitude is not valid'),
    check('lng')
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

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    if (!page) page = 1;
    if (!size) size = 20;
    if (!maxLat) maxLat = 90;
    if (!minLat) minLat = -90;
    if (!maxLng) maxLng = 180;
    if (!minLng) minLng = -180;
    if (!maxPrice) maxPrice = Number.MAX_VALUE;
    if (!minPrice) minPrice = 0;

    const err = new Error("Bad Request");
    err.errors = {};
    if (page) {
        if (page <= 0) err.errors.page = "Page must be greater than or equal to 1"
    }

    if (size) {
        if (size <= 0) err.errors.size = "Size must be greater than or equal to 1"
    }

    if (maxLat) {
        if (maxLat > 90 || maxLat < -90) err.errors.maxLat = "Maximum latitude is invalid"
    }
    if (minLat) {
        if (minLat > 90 || minLat < -90) err.errors.minLat = "Minimum latitude is invalid"
    }

    if (maxLng) {
        if (maxLng > 180 || maxLng < -180) err.errors.maxLng = "Maximum longitude is invalid"
    }

    if (minLng) {
        if (minLng > 180 || minLng < -180) err.errors.minLng = "Minimum longitude is invalid"
    }

    if (minPrice) {
        if (minPrice < 0) err.errors.minPrice = "Minimum Price is must be greater than or equal to 0"
    }

    if (maxPrice) {
        if (maxPrice < 0) err.errors.maxPrice = "Maximum Price is must be greater than or equal to 0"
    }

    if (Object.keys(err.errors).length > 0) {
        err.status = 400;
        return next(err);
    }

    const pagination = {};

    pagination.limit = size;
    pagination.offset = size * (page - 1)

    let spots = await Spot.findAll({
        where: {
            [Op.and]: [
                //     {
                { lat: { [Op.gte]: minLat } },
                { lat: { [Op.lte]: maxLat } },
                { lng: { [Op.gte]: minLng } },
                { lng: { [Op.lte]: maxLng } },
                { price: { [Op.gte]: minPrice } },
                { price: { [Op.lte]: maxPrice } },
            ]
        },
        ...pagination,
        include: [{
            model: SpotImage,
            where: {
                preview: true
            },
            required: false,
            attributes: ['url']
        },
        {
            model: Review,
            require: false,
            attributes: ['stars']
        }]
    })

    spots = JSON.stringify(spots);
    spots = JSON.parse(spots);

    for (let i = spots.length - 1; i >= 0; i--) {
        if (spots[i].SpotImages[0]) {
            spots[i]["previewImage"] = spots[i].SpotImages[0].url;
        }
        if (spots[i].Reviews.length > 0) {
            sum = 0;
            for (let j = 0; j < spots[i].Reviews.length; j++) {
                sum += spots[i].Reviews[j].stars
            }
            spots[i]["avgRating"] = sum / spots[i].Reviews.length;
        } else {
            spots[i]["avgRating"] = null;
        }
        delete spots[i].SpotImages;
        delete spots[i].Reviews;
    }

    return res.json({ Spots: spots, page, size })
})

// REQ AUTH - Get Spots of Current User
router.get('/current', authCheck, async (req, res, next) => {

    const { user } = req;
    let spots = await Spot.findAll({
        where: {
            ownerId: user.id
        },
        include: [{
            model: SpotImage,
            where: {
                preview: true
            },
            required: false,
            attributes: ['url']
        },
        {
            model: Review,
            attributes: ['stars'],
        }]
    })


    spots = JSON.stringify(spots);
    spots = JSON.parse(spots);

    for (let i = spots.length - 1; i >= 0; i--) {
        if (spots[i].SpotImages[0] !== null) {
            spots[i]["previewImage"] = spots[i].SpotImages[0];
        }
        if (spots[i].Reviews.length > 0) {
            sum = 0;
            for (let j = 0; j < spots[i].Reviews.length; j++) {
                sum += spots[i].Reviews[j].stars
            }
            spots[i]["avgRating"] = sum / spots[i].Reviews.length;
        } else {
            spots[i]["avgRating"] = null
        }
        delete spots[i].SpotImages;
        delete spots[i].Reviews;
    }

    return res.json({ Spots: spots })
    // return res.json({ route: "get/spots/current" })
})

// Get Reviews by Spot Id - Verify Creation, Prevention, Image Update
router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params

    const reviews = await Spot.findOne({
        attributes: [],
        where: {
            id: spotId,
        },
        include: {
            model: Review,
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }]
        }

    })

    if (reviews === null) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        return next(err);
    }

    return res.json(reviews)
})

// REQ AUTH - Get All Bookings for a Spot
router.get('/:spotId/bookings', authCheck, async (req, res, next) => {


    const { user } = req;
    const { spotId } = req.params;

    let spotBookings

    spotBookings = await Booking.findAll({
        where: {
            spotId: spotId,
        },
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
    })


    if (spotBookings.length === 0) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        return next(err);
    }

    if (spotBookings[0].userId === user.id) return res.json(spotBookings)

    spotBookings = JSON.stringify(spotBookings)
    spotBookings = JSON.parse(spotBookings)

    for (let i = 0; i < spotBookings.length; i++) {
        delete spotBookings[i].User
        delete spotBookings[i].createdAt
        delete spotBookings[i].updatedAt
        delete spotBookings[i].userId
        delete spotBookings[i].id
    }

    return res.json(spotBookings)
})

// Get All Spots by Spot Id
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;

    let spot = await Spot.findOne({
        where: {
            id: parseInt(spotId)
        },
        include: [{
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        },
        {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: Review,
            attributes: ['stars']
        }]
    })

    if (spot === null) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        return next(err);
    }


    spot = JSON.stringify(spot);
    spot = JSON.parse(spot);

    let sumReviews = 0;
    let avgStarRating;

    for (let i = 0; i < spot.Reviews.length; i++) {
        sumReviews += spot.Reviews[i].stars;
    }

    avgStarRating = sumReviews / spot.Reviews.length
    spot.numReviews = spot.Reviews.length;
    spot.avgStarRating = avgStarRating;
    delete spot.Reviews;

    return res.json(spot);
})

// REQ AUTH - Create a Spot
router.post('/', authCheck, validateSpot, async (req, res, next) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const spot = await Spot.create({
        ownerId: user.id,
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price

    })

    res.status(201);
    return res.json(spot)
})

// REQ AUTH - Create a Review for a Spot
router.post('/:spotId/reviews', authCheck, validateReview, async (req, res, next) => {

    const { user } = req;
    const { spotId } = req.params
    const { review, stars } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (spot === null) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        return next(err);
    }

    const prevReview = await Review.findAll({
        where: {
            userId: user.id,
            spotId: spot.id
        }
    })


    if (prevReview.length > 0) {
        const err = new Error("User already has a review for this spot")
        err.status = 500;
        return next(err);
    }

    const reviewEntry = {
        userId: user.id,
        spotId: spotId,
        review: review,
        stars: stars
    }

    const newReview = await Review.create(reviewEntry)

    res.status(201);
    return res.json(newReview)
})

// REQ AUTH - Create an Image for a Spot
router.post('/:spotId/images', authCheck, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params
    const { url, preview } = req.body

    const spot = await Spot.findByPk(spotId)

    if (spot === null) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        return next(err);
    }

    if (spot.ownerId !== user.id) {
        const err = new Error("Forbidden")
        err.status = 403;
        return next(err);
    }

    let spotImage = await SpotImage.create({
        spotId: parseInt(spotId),
        url: url,
        preview: preview
    });

    spotImage = JSON.stringify(spotImage)
    spotImage = JSON.parse(spotImage)

    delete spotImage.createdAt
    delete spotImage.updatedAt


    return res.json(spotImage)
})

// REQ AUTH - Create a Booking
router.post('/:spotId/bookings', authCheck, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;

    const bookingEntry = {
        startDate: startDate,
        endDate: endDate,
        spotId: spotId,
        userId: user.id,
    };

    if (bookingEntry.startDate >= bookingEntry.endDate) {
        const err = new Error("Bad Request")
        err.status = 400;
        err.errors = {};
        err.errors.endDate = "endDate cannot be on or before startDate";
        return next(err);
    }

    const conflicts = await Spot.findAll({
        include: {
            model: Booking,
            where: {
                spotId: spotId,
                [Op.or]: [
                    {
                        [Op.and]: [
                            { startDate: { [Op.lt]: new Date(bookingEntry.startDate) } },
                            { endDate: { [Op.gt]: new Date(bookingEntry.startDate) } },
                        ]
                    },
                    {
                        [Op.or]: [
                            { startDate: { [Op.eq]: new Date(bookingEntry.startDate) } },
                            { endDate: { [Op.eq]: new Date(bookingEntry.endDate) } },
                            { startDate: { [Op.eq]: new Date(bookingEntry.endDate) } },
                            { endDate: { [Op.eq]: new Date(bookingEntry.startDate) } },
                        ]
                    },
                    {
                        [Op.and]: [
                            { startDate: { [Op.lt]: new Date(bookingEntry.endDate) } },
                            { endDate: { [Op.gt]: new Date(bookingEntry.endDate) } },
                        ]
                    },
                    {
                        [Op.and]: [
                            { startDate: { [Op.gt]: new Date(bookingEntry.startDate) } },
                            { endDate: { [Op.gt]: new Date(bookingEntry.startDate) } },
                            { startDate: { [Op.lt]: new Date(bookingEntry.endDate) } },
                            { endDate: { [Op.lt]: new Date(bookingEntry.endDate) } },
                        ]
                    }
                ]
            }
        }
    })

    if (conflicts[0]) {
        const err = new Error('Sorry, this spot is already booked for the specified dates');
        err.errors = {};
        err.status = 403;

        for (let i = 0; i < conflicts[0].Bookings.length; i++) {

            if (new Date(bookingEntry.startDate) >= conflicts[0].Bookings[i].startDate && new Date(bookingEntry.startDate) <= conflicts[0].Bookings[i].endDate) {
                err.errors.startDate = "Start date conflicts with an existing booking";
            }
        }

        for (let i = 0; i < conflicts[0].Bookings.length; i++) {
            if (new Date(bookingEntry.endDate) >= conflicts[0].Bookings[i].startDate && new Date(bookingEntry.endDate) <= conflicts[0].Bookings[i].endDate) {
                err.errors.endDate = "End date conflicts with an existing booking";
            }
        }

        for (let i = 0; i < conflicts[0].Bookings.length; i++) {

            if (
                new Date(bookingEntry.endDate) > conflicts[0].Bookings[i].startDate
                && new Date(bookingEntry.endDate) > conflicts[0].Bookings[i].endDate
                && new Date(bookingEntry.startDate) < conflicts[0].Bookings[i].startDate
                && new Date(bookingEntry.startDate) < conflicts[0].Bookings[i].endDate
            ) {
                err.errors.startDate = "Start date conflicts with an existing booking";
                err.errors.endDate = "End date conflicts with an existing booking";
            }
        }
        return next(err);
    }

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })


    if (spot === null) {
        const err = new Error("Spot couldn't be found")
        return next(err);
    }

    if (spot.ownerId === user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const booking = await Booking.create(bookingEntry);
    return res.json(booking)

})

// REQ AUTH - Edit a Spot
router.put('/:spotId', authCheck, validateSpot, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const newTable = {};

    const spot = await Spot.findByPk(spotId);
    if (spot === null) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        return next(err);
    }

    if (spot.ownerId !== user.id) {
        const err = new Error("Forbidden")
        err.status = 403;
        return next(err);
    }

    if (address) newTable["address"] = address
    if (city) newTable["city"] = city
    if (state) newTable["state"] = state
    if (country) newTable["country"] = country
    if (lat !== null || lat !== undefined) newTable["lat"] = lat  // can be 0 which is falsy - need to correct
    if (lng !== null || lng !== undefined) newTable["lng"] = lng  // can be 0 which is falsy - need to correct
    if (name) newTable["name"] = name
    if (description) newTable["description"] = description
    if (price !== null || price !== undefined) newTable["price"] = price
    await spot.update(newTable);

    return res.json(spot);
})

// REQ AUTH - Delete a Spot
router.delete('/:spotId', authCheck, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId)

    if (spot === null) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (spot.ownerId !== user.id) {
        const err = new Error("Forbidden")
        err.status = 403;
        return next(err);
    }

    await spot.destroy({ force: true });
    return res.json({ "message": "Successfully deleted" })
})


module.exports = router;
