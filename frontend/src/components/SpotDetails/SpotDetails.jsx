import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react";
import { getSpotById } from "../../store/spot"
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import './SpotDetails.css';

function SpotDetails() {
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spot);
    const { spotId } = useParams();
    const images = spot.SpotImages;
    const owner = spot.Owner;
    useEffect(() => {

        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])


    const ShowSpot = () => {
        if (images && owner) {
            return (
                <>
                    <div className="sd-title">
                    <h2>{spot.name}</h2>
                    <p>{spot.city}, {spot.state}, {spot.country}</p>
                    </div>
                    <div className="images-wrapper">

                    <div className="preview-image-container">
                        {images.map((image) => (
                            image.preview &&
                            <li key={image.id}>
                                <img src={image.url}></img>
                            </li>
                        ))}
                    </div>
                    <div className="sd-images-container">
                    {images.map((image) => (
                        !image.preview &&

                        <li key={image.id}>
                            <img className="sd-image" src={image.url}></img>
                        </li>

                    ))}
                    </div>
                    </div>

                    <div className="lower-container">
                    <div className="details-area">
                        <h3>Hosted by: {owner[0].firstName} {owner[0].lastName}</h3>
                        <p>{spot.description}</p>
                        </div>
                    <div className="sd-callout-box">
                        <div id="callout-contents">
                            <p>${spot.price} night</p>
                            <p><FaStar /> {spot.avgStarRating === 0 ? "New" : spot.avgStarRating} {spot.numReviews}</p>
                        </div>
                        <button className="reserve-btn">Reserve</button>
                    </div>
                    </div>

                </>
            )
        }
        else {
            return (
                <>
                    <p>loading</p>
                </>
            )
        }
    }

    return (
        <div className="spot-details-container">
            <ShowSpot />
        </div>
    )


}




export default SpotDetails;
