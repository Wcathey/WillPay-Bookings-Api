import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react";
import { getSpotById } from "../../store/spot"
import { useParams } from "react-router-dom";

function SpotDetails() {
const dispatch = useDispatch();

const {spotId} = useParams();
const spot = useSelector(state => state.spot)
const spotImages = spot.SpotImages
const owner = spot.Owner[0];
useEffect(() => {
    dispatch(getSpotById(spotId))
}, [dispatch, spotId])
    return (
        <div className="spot-details-container">
            <h1>{spot.name}</h1>
            <h2>
                Location: {spot.city}, {spot.state}, {spot.country}
            </h2>

                {spotImages.map((image) => (
                    <li key={image.id}>
                        <img src={image.url}></img>
                    </li>
                ))}
            <p>Hosted By: {owner.firstName} {owner.lastName}</p>
            <p>{spot.description}</p>


        </div>
    )
}

export default SpotDetails;
