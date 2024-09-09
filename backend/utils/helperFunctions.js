

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
    return updatedSpots;
}

module.exports = {addPreviewImage}
