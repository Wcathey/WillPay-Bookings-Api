const express = require('express')
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const image = await SpotImage.unscoped().findByPk(req.params.imageId);
    if(!image) {
        res.status(404);
        res.json({message: "Image for Spot couldnt be found"})
    }
    const spot = await Spot.findByPk(image.spotId);

    if(user.id !== spot.ownerId) {
        res.status(403);
        res.json({message: "Forbidden"})
    }
    else {
        await SpotImage.destroy({
            where: {
                id: req.params.imageId
            }
        });
        res.json({message: "Successfully deleted"});
    }
})

module.exports = router
