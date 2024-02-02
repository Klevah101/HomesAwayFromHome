const router = require('express').Router();

const { Op } = require('sequelize')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

//  REQ AUTH - Get All Current User's Bookings
router.get('/current', authCheck, async (req, res, next) => {
    const { user } = req;

    let bookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: {
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
            include: {
                model: SpotImage,
                where: {
                    preview: true
                }
            }
        }
    })

    bookings = JSON.stringify(bookings)
    bookings = JSON.parse(bookings)

    for (let i = 0; i < bookings.length; i++) {
        bookings[i].Spot.previewImage = bookings[i].Spot.SpotImages[0].url;
        delete bookings[i].Spot.SpotImages
    }

    return res.json({ Bookings: bookings })

})

// REQ AUTH - Edit a Booking
router.put('/:bookingId', authCheck, async (req, res, next) => {
    const { user } = req;
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })

    if (booking === null) {
        const err = new Error("Booking couldn't be found")
        return next(err);
    }

    if (booking.userId !== user.id) {
        const err = new Error("Forbidden")
        err.status = 403;
        return next(err);
    }

    const bookingEdit = {
        startDate: startDate,
        endDate: endDate
    }

    if (bookingEdit.startDate >= bookingEdit.endDate) {
        const err = new Error("Bad Request")
        err.status = 400;
        err.errors = {};
        err.errors.endDate = "endDate cannot be on or before startDate";
        return next(err);
    }

    const conflicts = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            [Op.or]: [
                {
                    [Op.and]: [
                        { startDate: { [Op.lt]: new Date(bookingEdit.startDate) } },
                        { endDate: { [Op.gt]: new Date(bookingEdit.startDate) } },
                    ]
                },
                {
                    [Op.or]: [
                        { startDate: { [Op.eq]: new Date(bookingEdit.startDate) } },
                        { endDate: { [Op.eq]: new Date(bookingEdit.endDate) } },
                        { startDate: { [Op.eq]: new Date(bookingEdit.endDate) } },
                        { endDate: { [Op.eq]: new Date(bookingEdit.startDate) } },
                    ]
                },
                {
                    [Op.and]: [
                        { startDate: { [Op.lt]: new Date(bookingEdit.endDate) } },
                        { endDate: { [Op.gt]: new Date(bookingEdit.endDate) } },
                    ]
                },
                {
                    [Op.and]: [
                        { startDate: { [Op.gt]: new Date(bookingEdit.startDate) } },
                        { endDate: { [Op.gt]: new Date(bookingEdit.startDate) } },
                        { startDate: { [Op.lt]: new Date(bookingEdit.endDate) } },
                        { endDate: { [Op.lt]: new Date(bookingEdit.endDate) } },
                    ]
                }
            ],
            [Op.not]: [{ id: bookingId }]
        }
    })

    if (conflicts.length > 0) {
        const err = new Error('Sorry, this spot is already booked for the specified dates');
        err.errors = {};
        err.status = 403;

        for (let i = 0; i < conflicts.length; i++) {
            if (new Date(bookingEdit.startDate) >= conflicts[i].startDate && new Date(bookingEdit.startDate) <= conflicts[i].endDate) {
                err.errors.startDate = "Start date conflicts with an existing booking";

            }
        }

        for (let i = 0; i < conflicts.length; i++) {
            if (new Date(bookingEdit.endDate) >= conflicts[i].startDate && new Date(bookingEdit.endDate) <= conflicts[i].endDate) {
                err.errors.endDate = "End date conflicts with an existing booking";
            }
        }

        for (let i = 0; i < conflicts.length; i++) {
            if (
                new Date(bookingEdit.endDate) > conflicts[i].startDate
                && new Date(bookingEdit.endDate) > conflicts[i].endDate
                && new Date(bookingEdit.startDate) < conflicts[i].startDate
                && new Date(bookingEdit.startDate) < conflicts[i].endDate
            ) {
                err.errors.startDate = "Start date conflicts with an existing booking";
                err.errors.endDate = "End date conflicts with an existing booking";
            }
        }
        return next(err);
    }

    const updatedBooking = await booking.update(bookingEdit)
    return res.json(updatedBooking)
})

// REQ AUTH - Delete a Booking
router.delete('/:bookingId', authCheck, async (req, res, next) => {
    const { user } = req;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
        where: {
            id: bookingId
        }
    })

    if (booking === null) {
        const err = new Error("Booking couldn't be found")
        err.status = 404;
        return next(err)
    }

    if (booking.userId !== user.id) {
        const err = new Error("Forbidden")
        err.status = 403;
        return next(err)
    }

    if (new Date(booking.startDate) < Date.now()) {
        const err = new Error("Bookings that have been started can't be deleted")
        err.status = 403;
        return next(err)
    }

    await Booking.destroy({
        where: {
            id: bookingId
        }
    });

    return res.json({ "message": "Successfully deleted" })
})


module.exports = router;
