import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const demoUser = {
    credential: 'Demo-lition',
    password: 'password'
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log(data)
        if (data && data.message) {
          setErrors({ message: "The provided credentials were invalid." });
        }
      });
  };
  const handleDemoLogin = () => {
    dispatch(sessionActions.login(demoUser))
      .then(closeModal)
  }

  return (
    <>
      <h1>Log In</h1>
      <p>{errors.message}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button disabled={credential.length < 4 || password.length < 6} type="submit">Log In</button>
      </form>

      <button onClick={handleDemoLogin}>Login as Demo User</button>
    </>
  );
}

export default LoginFormModal;
