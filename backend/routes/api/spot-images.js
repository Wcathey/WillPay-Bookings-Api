const express = require('express')
const { SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const image = await SpotImage.findByPk(req.params.imageId);
    
    if(!image) {
        res.status(404);
        res.json({message: "Image for Spot couldnt be found"})
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
