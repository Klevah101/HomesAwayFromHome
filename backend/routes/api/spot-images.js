const router = require('express').Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, Spot } = require('../../db/models');
const { authCheck } = require('../../utils/auth');

// REQ AUTH - Delete a Spot Image
router.delete('/:imageId', authCheck, async (req, res, next) => {

    const { user } = req;
    const { imageId } = req.params;
    // console.log(imageId)


    // console.log(spotImage)
    const spot = await Spot.findByPk(spotImage.spotId)

    // console.log(spot.ownerId)
    // console.log(user.id)

    if (spot.ownerId !== user.id) {
        if (spot.ownerId !== user.id) {
            // create err 
            const err = new Error("Forbidden")
            // set error title maybe
            // set status code
            err.status = 403;
            // next(err)
            return next(err);
        }
    }
    
    const spotImage = await SpotImage.findByPk(imageId)
    await spotImage.destroy();

    return res.json({ "message": "Successfully deleted" })
    // return res.json({ route: "delete/spot-images/:imageId" })
})

module.exports = router;
