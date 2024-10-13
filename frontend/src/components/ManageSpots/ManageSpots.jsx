import { getCurrentUserSpots } from '../../store/spot';
import {useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

function ManageSpots () {
    const dispatch = useDispatch();
    const currentUserSpots = useSelector(state => state.spot.Spots);

    useEffect(() => {
        dispatch(getCurrentUserSpots())
    }, [dispatch]);

    const SpotList = () => {
        if(currentUserSpots) {
        return (
            currentUserSpots.map((spot) => (
                <>
                <NavLink to={`/spots/${spot.id}`}>
                <li key={spot.id}>
                    {spot.name}
                </li>
                </NavLink>
                </>
            ))
        )
    }
    else {
        return (
            <>
            <p>No spots currently listed</p>
            </>
        )
    }
    }


    return (
        <div className="manage-spots-container">
        <h1>Manage Spots</h1>
        <h2>
            <Link to="/spots/new">Create a new spot</Link>
        </h2>
        <div className='spot-list'>
        <SpotList/>
        </div>
        </div>
    )
}

export default ManageSpots;