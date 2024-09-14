const express = require('express')
const { ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const image = await ReviewImage.findByPk(req.params.imageId);
    if(!image) {
        res.status(404);
        res.json({message: "Image for review couldnt be found"});
    }
    const review = await Review.findByPk(image.reviewId);
    if(user.id !== review.userId) {
        res.status(403);
        res.json({message: "Forbidden"})
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
