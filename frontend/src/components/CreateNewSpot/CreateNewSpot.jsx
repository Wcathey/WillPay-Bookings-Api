import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSpot } from "../../store/spot";
import {useNavigate} from 'react-router-dom';

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
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        if(sessionUser)
        setErrors({});
        return dispatch(createSpot({
            address, city, state, country, lat,
            lng, name, description, price
        })).catch(async (res) => {
            const data = await res.json();
            if (data?.errors) {
                setErrors(data.errors);
            }
        })
    };

    return (
        <div className='spot-form-container'>
            <h1>List a New Spot</h1>
            <form onSubmit={handleSubmit}>

            <label>
                Where is your Spot located?
            </label>
            <input
                placeholder="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                />
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
            <label>
                Latitude
            </label>
            <input
                placeholder="latitude"
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                />
            <label>
                Longitude
            </label>
            <input
                placeholder="longitude"
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
                />
            <label>
                Provide a name for your spot
            </label>
            <input
                placeholder="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            <label>
                Provide a description for spot that includes amenities such as fast wifi or by the lake
            </label>
            <input
                placeholder="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />
            <label>
                Price
            </label>
            <input
                placeholder="cost $USD"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                />
            <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreateNewSpot;
