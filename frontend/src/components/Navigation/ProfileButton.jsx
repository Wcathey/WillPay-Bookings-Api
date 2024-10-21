import { useDispatch} from "react-redux";
import { useState, useEffect, useRef } from "react";
import { RiMapPinUserFill } from "react-icons/ri";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from "./OpenModalMenuItem/";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignUpFormModal from "../SignUpFormModal/SignUpFormModal";
import { Link } from "react-router-dom";

const ProfileButton = ({ user }) => {

    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();


    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    }

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu)
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
    };



    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button className="profile-button" onClick={toggleMenu}>
                <div style={{ color: "white", fontSize: "50px"}}>
                    <RiMapPinUserFill />
                </div>
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className="user-content">
                        <li><p>Username:</p> {user.username}</li>
                        <li><p>First Name:</p>{user.firstName}</li>
                        <li><p>Email:</p> {user.email}</li>
                        <li className="manage-spots-link">
                            <Link to='/spots/current'>Manage Spots</Link>
                        </li>
                        <li>
                            <button className="logout-btn" onClick={logout}>Log Out</button>
                        </li>
                        </div>
                ) : (
                    <div className="side-bar">
                        <li>
                            <OpenModalMenuItem
                                className="login-container"
                                itemText="Log In"
                                onItemClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </li>
                        <li>
                            <OpenModalMenuItem
                                className="signup-container"
                                itemText="Sign Up"
                                onItemClick={closeMenu}
                                modalComponent={<SignUpFormModal />}
                            />
                        </li>
                        </div>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
