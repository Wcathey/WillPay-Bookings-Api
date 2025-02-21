



async function addPreviewImage(spots, imageModel) {

    const updatedSpots = [];
    for (let i = 0; i < spots.length; i++) {

        let spot = spots[i].toJSON();
        const spotImage = await imageModel.findOne( {
            attributes: ['url'],
            where: {
                preview: true,
                spotId: spot.id

            }
        });
        if (spotImage) {
            console.log(spotImage)
            spot["previewImage"] = spotImage.dataValues.url

        }
        updatedSpots.push(spot)
    }
    return updatedSpots

}

async function getReviewAvg(spots, reviewModel) {
    const updatedSpots = [];

    for (let i = 0; i < spots.length; i++) {
        let spot = spots[i]
        const reviewCount = await reviewModel.count({
            where: {
                spotId: spot.id
            }
        });
        const reviewSum = await reviewModel.sum('stars', {
            where: {
                spotId: spot.id
            }
        });

        spot["avgRating"] = (reviewSum / reviewCount) || 0;

        updatedSpots.push(spot)
    }
    return updatedSpots

}


module.exports = { addPreviewImage, getReviewAvg }
