const express = require('express');
const { Review, User, Spot, SpotImage, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const {addPreviewImage} = require('../../utils/helperFunctions');
const {validateReviewImage, validateReview} = require('../../utils/validation');

const router = express.Router();
//get all review of current User
router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req;
    const reviews = await Review.findAll({
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastname"],
                where: {
                    id: user.id
                },

            }, Spot, ReviewImage

        ]
       })


   res.json(reviews)
});
//Add image to review based on reviews id
router.post('/:reviewId/images', requireAuth, validateReviewImage, async (req, res, next) => {
    const {url} = req.body;
    const checkReviewId = await Review.findByPk(req.params.reviewId);
    if(!checkReviewId) {
        res.status(404);
        res.json({message: "Review couldn't be found"})
    }


    const reviewImageAmount = await ReviewImage.count();
    if(reviewImageAmount === 10) {
        res.status(403);
        res.json({message: "Maximum number of images for this resource was reached"})
    }
   else {
    const newReviewImage = await ReviewImage.create({
        reviewId: req.params.reviewId,
        url: url
    });
    const getReviewImage = await ReviewImage.findByPk(newReviewImage.id, {
        attributes: ["id", "url"]
    });
    res.status(201);
    res.json(getReviewImage);
}
})

//Update and return an existing review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const {review, stars} = req.body;
    const updatedReview = await Review.findByPk(req.params.reviewId);
    if(!updatedReview) {
        res.status(404);
        res.json({message: "Review couldn't be found"})
    }
    else {
    await Review.update(
        {
        review: review,
        stars: stars
        },
        {
            where: {
                id: req.params.reviewId
            }
        }
    );
    const getReview = await Review.findByPk(req.params.reviewId)
    res.json(getReview)
}
})

//delete an existing review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    if(!review) {
        res.status(404);
        res.json({message: 'Review couldnt be found'})
    }
    else {
        await Review.destroy({
            where: {
                id: req.params.reviewId
            }
        });
        res.json({message: "Successfully deleted"});
    }
})



module.exports = router;
