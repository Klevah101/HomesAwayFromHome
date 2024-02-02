const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, Spot } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

// REQ AUTH - Delete a Spot Image
router.delete('/:imageId', authCheck, async (req, res, next) => {

    const { user } = req;
    const { imageId } = req.params;

    const spotImage = await SpotImage.findByPk(imageId)

    if (spotImage === null) {
        const err = new Error("Spot Image couldn't be found")
        err.status = 404;
        return next(err)
    }

    const spot = await Spot.findByPk(spotImage.spotId)

    if (spot.ownerId !== user.id) {
        if (spot.ownerId !== user.id) {
    
            const err = new Error("Forbidden")
            err.status = 403;
            return next(err);
        }
    }

    await spotImage.destroy();

    return res.json({ "message": "Successfully deleted" })
})

module.exports = router;
