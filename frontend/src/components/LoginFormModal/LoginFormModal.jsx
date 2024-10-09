import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch} from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const {closeModal} = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      }
    )
  };

  const demoUser = () => {
    setCredential("Demo-lition");
    setPassword("password");
  }


  return (
    <div className='login-container'>
      <h1 className='login-label'>Log in</h1>
      <form onSubmit={handleSubmit}>

        <label>
          Username or Email
          </label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />

        <label>
          Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit">Continue</button>

        <div  className="demo-login-btn">
        <button onClick={demoUser} type="submit">Demo User</button>
        </div>

      </form>
    </div>

  );
}

export default LoginFormModal;
