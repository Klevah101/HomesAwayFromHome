const router = require('express').Router();

const { Op } = require('sequelize')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Booking, sequelize } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

//  REQ AUTH - Get All Current User's Bookings
router.get('/current', authCheck, async (req, res, next) => {
    const { user } = req;

    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        }
    })

    return res.json(bookings)
    // res.json({ route: "get/bookings/current" })
})

// REQ AUTH - Edit a Booking
router.put('/:bookingId', authCheck, async (req, res, next) => {
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
        // create err 
        const err = new Error("Bad Request")
        // set error title
        // set status code
        err.status = 400;
        // next(err)
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
        // do error thingo
        const err = new Error('Sorry, this spot is already booked for the specified dates');
        err.errors = {};
        err.status = 403;

        for (let i = 0; i < conflicts.length; i++) {
            // console.log('start date', conflicts[0].Bookings[0].startDate)
            // console.log('end date', conflicts[0].Bookings[0].endDate)
            // console.log('bookingEntry start date', new Date(bookingEntry.startDate))
            // console.log('start date test', new Date(bookingEntry.startDate) >= conflicts[0].Bookings[0].startDate && new Date(bookingEntry.startDate) <= conflicts[0].Bookings[0].endDate)
            if (new Date(bookingEdit.startDate) >= conflicts[i].startDate && new Date(bookingEdit.startDate) <= conflicts[i].endDate) {
                // console.log('start date err')

                // next(err)

                err.errors.startDate = "Start date conflicts with an existing booking";

            }              // console.log('start date test', bookingEntry.startDate == conflicts[0].Bookings[0].startDate)
        }

        for (let i = 0; i < conflicts.length; i++) {
            // console.log('start date', conflicts[0].Bookings[0].startDate)
            // console.log('end date', conflicts[0].Bookings[0].endDate)
            // console.log('bookingEntry start date', new Date(bookingEntry.startDate))
            // console.log('start date test', new Date(bookingEntry.startDate) >= conflicts[0].Bookings[0].startDate && new Date(bookingEntry.startDate) <= conflicts[0].Bookings[0].endDate)
            if (new Date(bookingEdit.endDate) >= conflicts[i].startDate && new Date(bookingEdit.endDate) <= conflicts[i].endDate) {
                // console.log('end date err')
                err.errors.endDate = "End date conflicts with an existing booking";
            }              // console.log('start date test', bookingEntry.startDate == conflicts[0].Bookings[0].startDate)
        }

        for (let i = 0; i < conflicts.length; i++) {
            // console.log('start date', conflicts[0].Bookings[0].startDate)
            // console.log('end date', conflicts[0].Bookings[0].endDate)
            // console.log('bookingEntry start date', new Date(bookingEntry.startDate))
            // console.log('start date test', new Date(bookingEntry.startDate) >= conflicts[0].Bookings[0].startDate && new Date(bookingEntry.startDate) <= conflicts[0].Bookings[0].endDate)
            if (
                new Date(bookingEdit.endDate) > conflicts[i].startDate
                && new Date(bookingEdit.endDate) > conflicts[i].endDate
                && new Date(bookingEdit.startDate) < conflicts[i].startDate
                && new Date(bookingEdit.startDate) < conflicts[i].endDate
            ) {
                // console.log('booking surrounds date err')
                err.errors.startDate = "Start date conflicts with an existing booking";
                err.errors.endDate = "End date conflicts with an existing booking";
            }              // console.log('start date test', bookingEntry.startDate == conflicts[0].Bookings[0].startDate)
        }
        return next(err);
    }



    // console.log(conflicts, 'bookingId', bookingId)

    const updatedBooking = await booking.update(bookingEdit)

    // return res.json(conflicts)
    return res.json(updatedBooking)
    // res.json({ route: "put/bookings/:bookingId" })
})

// REQ AUTH - Delete a Booking
router.delete('/:bookigId', authCheck, async (req, res, next) => {
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

    const end = await Booking.destroy({
        where: {
            id: bookingId
        }
    });

    return res.json(end)
    // return res.json({ route: "delete/bookings/:bookingId" })
})


module.exports = router;
