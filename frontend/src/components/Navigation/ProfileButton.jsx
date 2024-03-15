import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaListUl } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import { NavLink, useNavigate } from 'react-router-dom';
import './ProfileButton.css'
// import { getUserReviews } from '../../store/reviews';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const navigate = useNavigate();
    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        // if (!showMenu) setShowMenu(true);
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const logout = async (e) => {
        e.preventDefault();
        await dispatch(sessionActions.logout());
        navigate('/');
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button onClick={toggleMenu} className="clickable profile-button">
                <FaListUl className='profile-icon' /><p> </p><FaUserCircle className="profile-icon" />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                <li>Hello, {user.firstName}</li>
                <li>{user.email}</li>
                <li><NavLink to='/spots/current' className="menu-link">Manage Spots</NavLink></li>
                <li><NavLink to='/reviews/current' className="menu-link">Manage Reviews</NavLink></li>
                <li>
                    <button onClick={logout} className="clickable">Log Out</button>
                </li>
            </ul>
        </>
    );
}

export default ProfileButton;
