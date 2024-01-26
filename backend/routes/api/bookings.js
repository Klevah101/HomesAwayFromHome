const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Booking } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

//  REQ AUTH - Get All Current User's Bookings
router.get('/current', authCheck, async (req, res, next) => {
    res.json({ route: "get/bookings/current" })
})

// REQ AUTH - Edit a Booking
router.put('/:bookingId', authCheck, async (req, res, next) => {
    res.json({ route: "put/bookings/:bookingId" })
})

// REQ AUTH - Delete a Booking
router.delete('/:bookigId', authCheck, async (req, res, next) => {
    res.json({ route: "delete/bookings/:bookingId" })
})


module.exports = router;
