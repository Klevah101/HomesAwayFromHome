import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';
import TextInput from '../CreateSpot/TextInput';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const errorList = Object.keys(errors).map(key => {
    return (errors[key])
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
       
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>

      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {errorList.map(error => {
          return (<p className="error"> {error}</p>)
        })}
        <label >
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          // required
          />
        </label>

        {/* <TextInput title="Email" formId="email" inputType={"text"} setValue={setEmail} /> */}

        {errors.email && <p>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          // required
          />
        </label>
        {/* <TextInput title="Username" formId="username" inputType={"text"} setValue={setUsername} /> */}
        {errors.username && <p>{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          // required
          />
        </label>
        {/* <TextInput title="First Name" formId="first Name" inputType={"text"} setValue={setFirstName} /> */}
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          // required
          />
        </label>
        {/* <TextInput title="LastName" formId="lastName" inputType={"text"} setValue={setLastName} /> */}
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          // required
          />
        </label>
        {/* <TextInput title="Password" formId="password" inputType={"password"} setValue={setPassword} /> */}
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          // required
          />
        </label>
        {/* <TextInput title="Confirm Password" formId="confirm-password" inputType={"password"} setValue={setConfirmPassword} /> */}
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}
        <button type="submit" disabled={(() => {
          if (!email || !username || !firstName || !lastName || !password || !confirmPassword) return true;
          if (username.length < 4) return true;
          if (password.length < 6) return true;


        })()}>Sign Up</button>
      </form >
    </>
  );
}

export default SignupFormModal;
