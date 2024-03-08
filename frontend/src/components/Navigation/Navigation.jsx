import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormPage/SignupFormModal';
import logo from '../../resources/logo.png'
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    const sessionLinks = sessionUser ? (
        <li>
            <ProfileButton user={sessionUser} />
        </li>
    ) : (
        <>
            <li>
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                />
            </li>
            <li>
                <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                />
            </li>
        </>
    );

    return (
        <div className="wrapper">
            <img src={logo} className="logo" />
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                {isLoaded && sessionLinks}
            </ul>
        </div>
    );
}

export default Navigation;
