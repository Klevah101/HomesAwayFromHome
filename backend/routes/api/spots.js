const router = require('express').Router();

const { sequelize } = require('sequelize')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { authCheck } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, Booking } = require('../../db/models');

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
    // const stuff = await User.findAll({
    //     include: [{
    //         model: Spot,
    //     }],
    // })
    let spots = await Spot.findAll({
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
    // spots = spots.map(el => {
    //     if (el.SpotImages[0] !== null) {
    //         el["previewImage"] = el.SpotImages[0];
    //     }
    //     if (el.Reviews.length > 0) {
    //         sum = 0;
    //         for (i = 0; i < el.Reviews.length; i++) {
    //             sum += el.Reviews[i].stars
    //         }
    //         el["avgRating"] = sum / el.Reviews.length;
    //     }
    //     return el
    // })

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
        }
        delete spots[i].SpotImages;
        delete spots[i].Reviews;
    }



    return res.json({ Spots: spots })
    // res.json({ route: "get/spots?" })
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
            model: Review
        }
    })

    if (reviews === null) {
        const err = new Error("Spot couldn't be found")
        // set error title
        // set status code
        err.status = 404;
        // next(err)
        next(err);
    }

    res.json(reviews)
    // res.json({ route: "get/spots/:spotId/reviews" })
})

// REQ AUTH - Get All Bookings for a Spot
router.get('/:spotId/bookings', authCheck, async (req, res, next) => {


    const { spotId } = req.params;

    const spotsBookings = await Booking.findAll({
        where: {
            spotId: spotId
        }
    })

    if(spotsBookings.length ===0){
        // create err 
        const err = new Error("Spot couldn't be found")
        // set error title
        // set status code
        err.status = 404;
        // next(err)
        next(err); 
    }
    // return res.json(booking)
    res.json(spotsBookings)
    // res.json({ route: "get/spots/:spotId/bookings" })
})

// Get All Spots by Spot Id
router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;

    console.log(spotId)
    const spot = await Spot.findOne({
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
        },
        {
            model: Review,
            attributes: ['stars']
        }]
    })

    if (spot === null) {
        // create err 
        const err = new Error("Spot couldn't be found")
        // set error title
        // set status code
        err.status = 404;
        // next(err)
        next(err);
    }


    return res.json(spot);
    // res.json({ route: "get/spots/:spotId" })
})

// REQ AUTH - Create a Spot
router.post('/', authCheck, validateSpot, async (req, res, next) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const spot = await Spot.create({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price,
        ownerId: user.id
    })

    // res.status(201)
    return res.json(spot)
    // res.json({ route: "post/spots" })
})

// REQ AUTH - Create a Review for a Spot
router.post('/:spotId/reviews', authCheck, validateReview, async (req, res, next) => {

    const { user } = req;
    const { spotId } = req.params
    const { review, stars } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (spot === null) {
        // create err 
        const err = new Error("Spot couldn't be found")
        // set error title
        // set status code
        err.status = 404;
        // next(err)
        next(err);

    }

    const prevReview = await Review.findAll({
        where: {
            userId: user.id,
            spotId: spot.id
        }
    })

    console.log(prevReview);

    if (prevReview !== null) {
        // create err 
        const err = new Error("User already has a review for this spot")
        // set error title
        // set status code
        err.status = 500;
        // next(err)
        next(err);
    }

    const reviewEntry = {
        userId: user.id,
        spotId: spotId,
        review: review,
        stars: stars
    }

    const newReview = await Review.create(reviewEntry)

    return res.json(newReview)
    // return res.json({ route: "post/spots/:spotId/reviews" })
})

// REQ AUTH - Create an Image for a Spot
router.post('/:spotId/images', authCheck, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params
    const { url, preview } = req.body

    const spot = await Spot.findByPk(spotId)
    if (spot.ownerId !== spotId) {
        // create err 
        const err = new Error("Forbidden")
        // set error title maybe
        // set status code
        err.status = 403;
        // next(err)
        next(err);
    }
    // console.log('//////////////', spotId)
    // const spot = Spot.findOne({
    //     where: {
    //         id: spotId
    //     }
    // })

    // let same = null;
    // if (spot.id === user.id) { same = "same" }
    // if spot is null
    //     do spot doesn't exists stuff - create error blah blah blah 
    // if user.id and spot.ownerId are the same
    //     create new SpotImage - add spotId as review.spotId 

    const spotImage = await SpotImage.create({
        spotId: parseInt(spotId),
        url: url,
        preview: preview
    });


    return res.json(spotImage)
    // return res.json({ route: "post/spots/:spotId/images", same })
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

    const booking = await Booking.create(bookingEntry);
    res.json(booking)
    // res.json({ route: "post/spots/:spotId/bookings" })
})

// REQ AUTH - Edit a Spot
router.put('/:spotId', authCheck, validateSpot, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const newTable = {};

    const spot = await Spot.findByPk(spotId);
    if (spot === null) {
        // create err 
        const err = new Error("Spot couldn't be found")
        // set error title
        // set status code
        err.status = 404;
        // next(err)
        next(err);
    }

    if (spot.ownerId !== user.id) {
        // create err 
        const err = new Error("Forbidden")
        // set error title maybe
        // set status code
        err.status = 403;
        // next(err)
        next(err);
    }

    if (address) newTable["address"] = address
    if (city) newTable["city"] = city
    if (state) newTable["state"] = state
    if (country) newTable["country"] = country
    if (lat) newTable["lat"] = lat  // can be 0 which is falsy
    if (lng) newTable["lng"] = lng  // can be 0 which is falsy
    if (name) newTable["name"] = name
    if (description) newTable["description"] = description
    if (price) newTable["price"] = price

    console.log(newTable)

    spot.update(newTable);

    return res.json(spot);
    // res.json({ route: "put/spots/:spotId" })
})

// REQ AUTH - Delete a Spot
router.delete('/:spotId', authCheck, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId)

    if (spot.ownerId !== user.id) {
        // create err 
        const err = new Error("Forbidden")
        // set error title maybe
        // set status code
        err.status = 403;
        // next(err)
        next(err);
    }


    await Spot.destroy(spot)

    res.json({ route: "delete/spots/:spotId" })
    // res.json({ route: "delete/spots/:spotId" })
})


module.exports = router;
