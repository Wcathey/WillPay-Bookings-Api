import { useDispatch} from "react-redux";
import { useState, useEffect, useRef } from "react";
import { RiMapPinUserFill } from "react-icons/ri";
import * as sessionActions from '../../store/session';

const ProfileButton = ({ user }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    }

    useEffect(() => {
        if(!showMenu) return;

        const closeMenu = (e) => {
           if (ulRef.current && !ulRef.current.contains(e.target)) {
            setShowMenu(false);
           }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu)
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };


    return (
        <>
            <button className="profile-button" onClick={toggleMenu}>
                <div style={{ color: "black", fontSize: "50px" }}>
                    <RiMapPinUserFill />
                </div>
            </button>
            <div className={showMenu ? "profile-dropdown" : "hidden"} ref={ulRef}>
            <ul >
                <li>{user.username}</li>
                <li>{user.firstName}</li>
                <li>{user.email}</li>
            </ul>
            <button className="logout-btn" onClick={logout}>Log Out</button>
            </div>
            </>
    );
}

export default ProfileButton;
