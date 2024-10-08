import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { RiMapPinUserFill } from "react-icons/ri";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from "./OpenModalMenuItem/";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignUpFormModal from "../SignUpFormModal/SignUpFormModal";


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
                    <>
                        <li>{user.username}</li>
                        <li>{user.firstName}</li>
                        <li>{user.email}</li>
                        <li>
                            <button className="logout-btn" onClick={logout}>Log Out</button>
                        </li>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
