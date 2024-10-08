import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
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
                <OpenModalButton
                buttonText="Log in"
                modalComponent={<LoginFormModal/>}
                />
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
