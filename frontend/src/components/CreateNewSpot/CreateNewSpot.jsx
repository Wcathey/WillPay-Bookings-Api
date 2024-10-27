import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSpot, uploadSpotImage } from "../../store/spot";
import {useNavigate} from 'react-router-dom';
import './CreateNewSpot.css';
function CreateNewSpot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if(sessionUser)
        setErrors({});

        const newSpot = {
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
        dispatch(createSpot(newSpot))
        .then(spot => {
            dispatch(uploadSpotImage({spotId: spot.id, url: previewImage, preview: true }))
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

    return (
        <div className='spot-form-container'>
            <h1>Create a New Spot</h1>

            <form onSubmit={handleSubmit}>
            <div className="address-area">

            <h2>Where is your place located?</h2>
            <p>Guests will only get your exact address once they have booked a reservation.</p>

            <label>
                Country
            </label>
            <input
                placeholder="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                />
            {errors.country && <p>{errors.country}</p>}
            <label>
                Street Address
            </label>
            <input
                placeholder="address"
                type="text"
                value={address}
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
                value={city}
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
                value={state}
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
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                />
            {errors.lat && <p>{errors.lat}</p>}

            <label>
                Longitude
            </label>
            <input
                placeholder="(optional)"
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                />
            {errors.lng && <p>{errors.lng}</p>}

            </div>

            <div className="description-area">
             <h2>Describe your place to guests</h2>
             <p>Mention the best features of your space any special amentities like fast wifi or parking and what you love
                about the neighborhood
             </p>
            <textarea
                placeholder="Please write at least 30 characters"
                type="text"
                value={description}
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
                value={name}
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
            <input
                placeholder="Price per night (USD)"
                type="number"
                value={price}
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
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                required
                />
            {errors.previewImage && <p>{errors.previewImage}</p>}

            <input
                placeholder="Image URL"
                type="text"
                value={imageUrl1}
                onChange={(e) => setImageUrl1(e.target.value)}
                />
              <input
                placeholder="Image URL"
                type="text"
                value={imageUrl2}
                onChange={(e) => setImageUrl2(e.target.value)}
                />
              <input
                placeholder="Image URL"
                type="text"
                value={imageUrl3}
                onChange={(e) => setImageUrl3(e.target.value)}
                />
              <input
                placeholder="Image URL"
                type="text"
                value={imageUrl4}
                onChange={(e) => setImageUrl4(e.target.value)}
                />
            </div>

            <button type="submit">Create Spot</button>
            </form>
        </div>
    )
}

export default CreateNewSpot;
