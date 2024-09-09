const express = require('express');
const { sequelize, Spot, SpotImage, User, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { addPreviewImage, getReviewAvg } = require('../../utils/helperFunctions');

const router = express.Router();

//Get all spots, req auth: false
router.get('/', async (req, res) => {
//still needs avgRating
    const allSpots = await Spot.findAll();
    const addImage = await addPreviewImage(allSpots, SpotImage);
    const addReviewAvg = await getReviewAvg(addImage, Review);
    res.json(addReviewAvg)

});

router.get('/current', requireAuth,  async (req, res, next) => {
    //still needs avgRating
    const {user} = req
    let ownedSpots = await Spot.findAll({
        where: {
            ownerId: user.id
        },
    });
    const addImage = await addPreviewImage(ownedSpots, SpotImage);
    const addReviewAvg = await getReviewAvg(addImage, Review)
    res.json(addReviewAvg)



    });
//Get details of Spot from an id, req auth: false
router.get('/:spotId', async (req, res) => {
    try {

        //add numReviews, avgStarRating
        const specificSpot = await Spot.findByPk(req.params.spotId);
        const reviewCount = await Review.count({
            where: {
                spotId: req.params.spotId
            }
        })
        const reviewSum = await Review.sum('stars', {
            where: {
                spotId: req.params.spotId
            }
        })
        const jsonSpot = specificSpot.toJSON();
        jsonSpot["numReviews"] = reviewCount;
        jsonSpot['avgStarRating'] = (reviewSum / reviewCount) || 0;
        const SpotImages = await SpotImage.findAll({
            where: {
                spotId: req.params.spotId
            }
        });
        const Owner = await User.findAll({
            attributes: ["id", "firstName", "lastName"],
            where: {
                id: jsonSpot.ownerId
            }
        });

        res.json({...jsonSpot, SpotImages, Owner})
    } catch(error) {
        console.error(error)
        res.status(404);
        res.json({message: "Spot couldn't be found"})
    }

});
// get all reviews by spots id
router.get('/:spotId/reviews', async (res, req) => {
   try {
    const reviews = await Review.findAll({
        include: [{
            model: User,
            attributes: ["id", "firstName", "lastName"],

        }, ReviewImages],
         where: {
            spotId: req.params.spotId
        }
    })
} catch(error) {
    res.status(404);
    res.json({message: "Spot couldn't be found"})
}
});

//create a review for spot based on spot id
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    try {
    const {user} = req;
    const {review, stars} = req.body;
    handleValidationErrors
    const checkReviews = await Review.findAll({
        where: {
            userId: user.id,
            spotId: req.params.spotId
        }
    })
    if(checkReviews) {
        res.status(500);
        res.json({message: "User already has a review for this spot"})
    }
    else {
        const newReview = await Review.create({
            spotId: req.params.spotId,
            review: review,
            stars: stars
    });
    res.status(201);
    res.json(newReview)
}
} catch(error) {
    res.status(404);
    res.json({message: "Spot could't be found"})
}
})


//Create a Spot, req auth: true
router.post('/', requireAuth, async (req, res, next) => {
const {user} = req
const {address, city, state, country, lat, lng, name, description, price} = req.body
const newSpot = await Spot.create({
   ownerId: user.id,
   address: address,
   city: city,
   state: state,
   country: country,
   lat: lat,
   lng: lng,
   name: name,
   description: description,
   price: price

});
res.status(201)
res.json(newSpot)
});

//Add an Image to Spot based on Spot Id, req auth: true
router.post('/:spotId/images', requireAuth, async (req, res, next) => {

try{

    const {url, preview} = req.body
    const image = await SpotImage.create({
        spotId: req.params.spotId,
        url: url,
        preview: preview
    });
    const getImage = await SpotImage.findByPk(image.spotId)
    res.status(201);
    res.json(getImage);
} catch(error) {
    res.status(404);
    res.json({message: "Spot couldn't be found"})
}



});

//Edit a Spot, req auth: true
router.put('/:spotId', requireAuth, async (req, res, next) => {
    try{
       const {address, city, state, country, lat, lng, name, description, price} = req.body
       const updatedSpot = await Spot.update({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
       },
    {
        where: {
            id: req.params.spotId
        }
    });
    res.json(updatedSpot)
    } catch(error) {
        res.status(404);
        res.json({message: "Spot couldn't be found"})
    }
});

//Delete a Spot, req auth: true
router.delete('/:spotId', requireAuth, async (req, res, next) =>{
    try {
        await Spot.destroy({
            where: {
                id: req.params.spotId
            }
        });

        res.json({message: "Successfully deleted"});

    } catch(error) {
        res.status(404)
        res.json({message: "Spot couldn't be found"})
    }
})
module.exports = router;
