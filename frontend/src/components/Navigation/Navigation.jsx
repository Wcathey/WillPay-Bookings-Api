import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import ProfileButton from "./ProfileButton";
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <ul className="nav-bar">
            <li>
                <NavLink to="/">Home</NavLink>
            </li>
            {isLoaded && (
                <div className="nav-buttons">
                    {sessionUser && (
                        <NavLink to="/spots/new">Create a New Spot</NavLink>
                    )}
                <li>
                    <ProfileButton user={sessionUser} />
                </li>
                </div>
            )}
        </ul>
    );

}

export default Navigation;
