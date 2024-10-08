import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import './Navigation.css';
import SignUpFormModal from "../SignUpFormModal/SignUpFormModal";

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li>
                <ProfileButton user={sessionUser} />
            </li>
        );
    } else {
        sessionLinks = (
            <>
                <li>
                    <OpenModalButton
                        buttonText="Log in"
                        modalComponent={<LoginFormModal />
                        }
                    />
                </li >
                <li>
                    <OpenModalButton
                        buttonText="Sign up"
                        modalComponent={<SignUpFormModal />}
                    />
                </li>
            </>
        );
    }

    return (
        <ul>

            <li>
                <NavLink to="/">Home</NavLink>
            </li>
            {isLoaded && sessionLinks}

        </ul>
    );
}

export default Navigation;
