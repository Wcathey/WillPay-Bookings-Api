import { getCurrentUserSpots } from '../../store/spot';
import {useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function ManageSpots () {
    const dispatch = useDispatch();
    //const currentUserSpots = useSelector(state => state.spot.Spots);
    useEffect(() => {
        dispatch(getCurrentUserSpots())
    }, [dispatch]);

    return (
        <div className="manage-spots-container">
        <h1>Manage Spots</h1>
        <h2>
            <Link to="/spots/new">Create a new spot</Link>
        </h2>
        </div>
    )
}

export default ManageSpots;
