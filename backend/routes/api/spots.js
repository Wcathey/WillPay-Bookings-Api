const express = require('express');
const { sequelize, Spot, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { addPreviewImage } = require('../../utils/helperFunctions');

const router = express.Router();

//Get all spots, req auth: false
router.get('/', async (req, res) => {
//still needs avgRating
    const allSpots = await Spot.findAll();
    const addImage = await addPreviewImage(allSpots, SpotImage);
    if(addImage) {
    res.json(addImage)
    } else  {
        res.json(allSpots)
    }
});

router.get('/current', requireAuth,  async (req, res, next) => {
    //still needs avgRating
    const {user} = req
    const ownedSpots = await Spot.findAll({
        where: {
            ownerId: user.id
        },
    });
    const addImage = await addPreviewImage(ownedSpots, SpotImage);
    if(addImage) {
    res.json(addImage)
    }
    else {
        res.json(ownedSpots)
    }


    });
//Get details of Spot from an id, req auth: false
router.get('/:spotId', async (req, res) => {
    try {

        //add numReviews, avgStarRating
        const specificSpot = await Spot.findByPk(req.params.spotId, {

            include: [{
                model:SpotImage,

            },{
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']

            }]




        });
        res.json(specificSpot)
    } catch(error) {
        res.status(404);
        res.json({message: "Spot couldn't be found"})
    }

});



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
//added to SpotImage table but url needs to be added to Spot as previewImage
    res.json(image)
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
