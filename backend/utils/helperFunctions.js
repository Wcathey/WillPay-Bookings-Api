const e = require("express");



async function addPreviewImage(spots, imageModel) {

    const updatedSpots = [];
    for(let i = 0; i < spots.length; i++) {

        let spot = spots[i].toJSON();
        const spotImage = await imageModel.findByPk(spot.id, {
            attributes: ['url'],
            where: {
                preview: true
            }
        });

        spot["previewImage"] = spotImage.dataValues.url
        updatedSpots.push(spot)

    }
    if(updatedSpots.length > 0) {
    return updatedSpots;
    }
    else {
        return spots
    }
}

async function getReviewAvg(spots, reviewModel) {
    const updatedSpots = [];
    let sum;
    for(let i = 0; i < spots.length; i++) {
        let spot = spots[i].toJSON();
        const reviews = await reviewModel.findAll({
            attributes: ["stars"],
            where: {
                spotId: spot.id
            }
        });
        reviews.forEach((review) => {
            sum += review.stars
        })
        const average = sum / reviews.length
        spot["avgRating"] = average;
        updatedSpots.push(spot)
    }
    if(average) {
    return updatedSpots
    } else {
        return spots
    }
}

module.exports = {addPreviewImage, getReviewAvg}
