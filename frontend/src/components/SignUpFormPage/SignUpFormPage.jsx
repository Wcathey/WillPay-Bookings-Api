import { useState } from "react";
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import './SignUpForm.css';

function SignUpFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    if (sessionUser) return <Navigate to="/" replace={true} />;

    const handleSubmit = (e) => {
        e.preventDefault();
        if(password === confirmPassword) {
        setErrors({});
        return dispatch(sessionActions.signUp({
            username,
            firstName,
            lastName,
            email,
            password
        })
        ).catch(async (res) => {
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
        <div className="sign-up-wrapper">
            <h1 className="form-title">Sign up</h1>
            <form onSubmit={handleSubmit}>

                <label>
                    Create a username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                {errors.username && <p>{errors.username}</p>}

                <label>
                    First Name
                </label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    />
                {errors.firstName && <p>{errors.firstName}</p>}

                <label>
                    Last Name
                </label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    />
                {errors.lastName && <p>{errors.lastName}</p>}

                <label>
                    Email
                </label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                {errors.email && <p>{errors.email}</p>}


                <label>
                    Create a Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                {errors.password && <p>{errors.password}</p>}

                <label>
                    Confirm Password
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                    
                <button type="submit">Create Account</button>
            </form>
        </div>
    )
}

export default SignUpFormPage;
