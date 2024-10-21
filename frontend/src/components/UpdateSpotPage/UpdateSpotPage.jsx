import {useSelector, useDispatch} from "react-redux";
import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { updateSpotById, getSpotById, uploadSpotImage } from "../../store/spot";
import { useNavigate } from "react-router-dom";

import './UpdateSpotPage.css';
function UpdateSpotPage () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {spotId} = useParams();
    const currentSpot = useSelector(state => state.spot);


    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [imageUrl1, setImageUrl1] = useState("");
    const [imageUrl2, setImageUrl2] = useState("");
    const [imageUrl3, setImageUrl3] = useState("");
    const [imageUrl4, setImageUrl4] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getSpotById(spotId))
    }, [dispatch, spotId])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
      
        const updatedSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }
        console.log(updatedSpot)
        dispatch(updateSpotById(updatedSpot))
        .then(spot => {
            if(previewImage)
            dispatch(uploadSpotImage({spotId: spot.id, url: previewImage, preview: true}))
            return spot.id
        })
        .then((id) => {
            if(imageUrl1) {
            dispatch(uploadSpotImage({spotId: id, url: imageUrl1, preview: false}))
            }
            return id;
        })
        .then((id) => {
            if(imageUrl2) {
            dispatch(uploadSpotImage({spotId: id, url: imageUrl2, preview: false}))
            }
            return id;
        })
        .then((id) => {
            if(imageUrl3) {
            dispatch(uploadSpotImage({spotId: id, url: imageUrl3, preview: false}))
            }
            return id;
        })
        .then((id) => {
            if(imageUrl4) {
            dispatch(uploadSpotImage({spotId: id, url: imageUrl4, preview: false}))
            }
            navigate(`/spots/${id}`)
            return id;
        })
        .catch(async (res) => {
            const data = await res.json();
            if(data?.errors) {
                setErrors(data.errors);
            }
        });
    };


    if(currentSpot.SpotImages) {
    return (
       <div className="update-spot-container">
           <h1>Update Your Spot</h1>

           <form onSubmit={handleSubmit}>
            <div className="address-area">

                <h2>Where is your place located?</h2>
                <p>Guests will only get your exact address once they have booked a reservation.</p>

                <label>
                    Country
                </label>
                <input
                    placeholder={"country"}
                    type="text"
                    defaultValue={currentSpot.country}
                    onChange={(e) => setCountry(e.target.value)}
                    required/>
                {errors.country && <p>{errors.country}</p>}
                <label>
                    Street Address
                </label>
                <input
                    placeholder="address"
                    type="text"
                    defaultValue={currentSpot.address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                {errors.address && <p>{errors.address}</p>}

                <label>
                    City
                </label>
                <input
                    placeholder="city"
                    type="text"
                    defaultValue={currentSpot.city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                {errors.city && <p>{errors.city}</p>}

                <label>
                State
                </label>
                <input
                placeholder="state"
                type="text"
                defaultValue={currentSpot.state}
                onChange={(e) => setState(e.target.value)}
                required
                />
                {errors.state && <p>{errors.state}</p>}
            </div>

            <div className="lat-lng-area">

            <label>
                Latitude
            </label>
            <input
                placeholder="(optional)"
                type="text"
                defaultValue={currentSpot.lat}
                onChange={(e) => setLat(e.target.value)}
                />
            {errors.lat && <p>{errors.lat}</p>}

            <label>
                Longitude
            </label>
            <input
                placeholder="(optional)"
                type="text"
                defaultValue={currentSpot.lng}
                onChange={(e) => setLng(e.target.value)}
                />
            {errors.lng && <p>{errors.lng}</p>}
        </div>
        <div className="description-area">
             <h2>Describe your place to guests</h2>
             <p>Mention the best features of your space any special amentities like fast wifi or parking and what you love
                about the neighborhood
             </p>
            <input
                placeholder="Please write at least 30 characters"
                type="text"
                defaultValue={currentSpot.description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />
            {errors.description && <p>{errors.description}</p>}
            </div>
            <div className="spot-title-area">
           <h2>Create a title for your spot</h2>
           <p>Catch guests attention with a spot title that highlights
            what makes your place special
           </p>
            <input
                placeholder="Name of your spot"
                type="text"
                defaultValue={currentSpot.name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            {errors.name && <p>{errors.name}</p>}
                </div>

                <div className="price-area">
           <h2>Set a base price for your spot</h2>
           <p>Competitive pricing can help your listing stand out and
            rank higher in search results
           </p>
            <span>$</span><input
                placeholder="Price per night (USD)"
                type="number"
                defaultValue={currentSpot.price}
                onChange={(e) => setPrice(e.target.value)}
                required
                />
            {errors.price && <p>{errors.price}</p>}
                </div>
                <div className="photos-area">
            <h2>Liven up your spot with photos</h2>
            <p>Submit a link to at least one photo to pubish your spot</p>
            <input
                placeholder="Preview Image URL"
                type="text"
                defaultValue={currentSpot.SpotImages[0].url}
                onChange={(e) => setPreviewImage(e.target.value)}
                required
                />
            {errors.previewImage && <p>{errors.previewImage}</p>}

            <input
                placeholder="Image URL"
                type="text"
                defaultValue={imageUrl1}
                onChange={(e) => setImageUrl1(e.target.value)}
                />
              <input
                placeholder="Image URL"
                type="text"
                defaultValue={imageUrl2}
                onChange={(e) => setImageUrl2(e.target.value)}
                />
              <input
                placeholder="Image URL"
                type="text"
                defaultValue={imageUrl3}
                onChange={(e) => setImageUrl3(e.target.value)}
                />
              <input
                placeholder="Image URL"
                type="text"
                defaultValue={imageUrl4}
                onChange={(e) => setImageUrl4(e.target.value)}
                />
            </div>

            <button type="submit">Create Spot</button>

           </form>
       </div>
    )
}
else {
    return (
        <>
        <p>Loading details</p>
        </>
    )
}
}

export default UpdateSpotPage;
