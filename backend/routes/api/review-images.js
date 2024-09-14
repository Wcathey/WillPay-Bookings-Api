const express = require('express')
const { ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const image = await ReviewImage.findByPk(req.params.imageId);
    if(!image) {
        res.status(404);
        res.json({message: "Image for review couldnt be found"});
    }
    else {
        await ReviewImage.destroy({
            where: {
                id: req.params.imageId
            }
        });
        res.json({message: "Successfully deleted"});
    }
})


module.exports = router
