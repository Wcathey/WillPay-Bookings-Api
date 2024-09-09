const express = require('express');
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const {user} = req
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
})





module.exports = router;
