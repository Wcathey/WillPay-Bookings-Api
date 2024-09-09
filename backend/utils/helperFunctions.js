const e = require("express");



async function addPreviewImage(spots, imageModel) {

    const updatedSpots = [];
    for (let i = 0; i < spots.length; i++) {

        let spot = spots[i].toJSON();
        const spotImage = await imageModel.findByPk(spot.id, {
            attributes: ['url'],
            where: {
                preview: true
            }
        });
        if (spotImage) {
            spot["previewImage"] = spotImage.dataValues.url

        }
        updatedSpots.push(spot)
    }
    return updatedSpots

}

async function getReviewAvg(spots, reviewModel) {
    const updatedSpots = [];
    let sum;
    for (let i = 0; i < spots.length; i++) {
        let spot = spots[i]
        const reviews = await reviewModel.findAll({
            attributes: ["stars"],
            where: {
                spotId: spot.id
            }
        });
        if(reviews) {
        reviews.forEach((review) => {
            sum += Number(review.stars)
        })
        let average = sum / reviews.length
        if(average) {
            spot["avgRating"] = average;
        }
        spot["avgRating"] = "no reviews"
    }
    updatedSpots.push(spot)
    }
   return updatedSpots
}



module.exports = { addPreviewImage, getReviewAvg }
