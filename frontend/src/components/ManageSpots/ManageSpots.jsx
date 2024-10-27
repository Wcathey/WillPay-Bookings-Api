import { getCurrentUserSpots } from '../../store/spot';
import {useDispatch, useSelector} from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import './ManageSpots.css'


function ManageSpots () {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const btnRef = useRef();
    const currentUserSpots = useSelector(state => state.spot.Spots);
    const navigate = useNavigate();

    const toggleAlert = () => {
        setShowAlert(!showAlert);
    }

    useEffect(() => {
        dispatch(getCurrentUserSpots())

        if(!showAlert) return;
        const closeAlert = (e) => {
            if(!btnRef.current.contains(e.target)) {
                setShowAlert(false);
            }
        }

        document.addEventListener('click', closeAlert);

        return () => document.removeEventListener('click', closeAlert)
    }, [dispatch, showAlert]);


    const deleteClassName = "delete-btn-wrapper" + (showAlert ? "" : " hidden");

    const SpotList = () => {
        if(currentUserSpots) {
        return (
            currentUserSpots.map((spot) => (

                <div className="spot-wrapper" key={spot.id}>
                <NavLink to={`/spots/${spot.id}`}>
                <li key={spot.id}>
                <img src={spot.previewImage}></img>
                <p>Rating: {spot.rating ? spot.rating : "New"}</p>
                <p>Price: {spot.price}</p>
                <p>Location: {spot.address}, {spot.city}, {spot.state} </p>
                </li>
                </NavLink>
                <div className="edit-buttons">
                        <button onClick={(e) => {
                            e.preventDefault();
                            navigate(`/spots/${spot.id}/edit`)
                        }}>
                            Update</button>
                        <div className={deleteClassName} ref={btnRef}></div>
                        <OpenModalButton
                            className="delete-button"
                            buttonText="Delete"
                            onButtonClick={toggleAlert}
                            modalComponent={<DeleteSpotModal spotId={spot.id}/>}
                            />
                </div>
                </div>
            ))
        )
    }
    else {
        return (

                <p>Loading</p>


        )
    }
    }


    return (
        <div className="manage-spots-container">
        <h1>Manage Spots</h1>
        <Link to="/spots/new">
        <p id="create-spot-button">Create a New Spot</p>
        </Link>
        <div className='spot-list'>
        <SpotList/>
        </div>
        </div>
    )
}

export default ManageSpots;
