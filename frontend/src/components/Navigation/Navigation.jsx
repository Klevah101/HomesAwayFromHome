import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormPage/SignupFormModal';
import logo from '../../resources/logo.png'
import './Navigation.css';


function Navigation({ isLoaded }) {
    const navigate = useNavigate();
    const handleLogoClick = (e) => {
        e.stopPropagation();
        navigate('/');
    }
    const sessionUser = useSelector((state) => state.session.user);

    const sessionLinks = sessionUser ? (
        <li className="profileMenu">
            <ProfileButton user={sessionUser} />
        </li>
    ) : (
        <>
            <li>
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal
                        className="clickable" />}
                />
            </li>
            <li>
                <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal
                        className="clickable" />}
                />
            </li>
        </>
    );

    return (
        <div className="header-wrapper">
            <img src={logo} className="logo clickable" onClick={(e) => handleLogoClick(e)} />
            <ul className='right-menu'>
                {sessionUser ?
                    <li className="link-text">
                        <NavLink to="/spots/new" className="menu-link menu-link-cs">Create a New Spot</NavLink>
                    </li> : null}
                {isLoaded && sessionLinks}
            </ul>
        </div>
    );
}

export default Navigation;
