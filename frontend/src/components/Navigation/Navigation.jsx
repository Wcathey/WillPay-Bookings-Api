import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import ProfileButton from "./ProfileButton";
import './Navigation.css';
function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);




    const sessionLinks = sessionUser ? (
        <ul>
            <li>
            <ProfileButton user={sessionUser} />
            </li>
        </ul>


    ) : (
        <ul>
            <li>
                <NavLink to='/login'>Log in</NavLink>
            </li>
            <li>
                <NavLink to="/signup">Sign up</NavLink>
            </li>
        </ul>
    );

    return (
        <nav className="nav-bar">


                <NavLink to="/">Home</NavLink>

            {isLoaded && sessionLinks}

        </nav>
    );
}

export default Navigation;
