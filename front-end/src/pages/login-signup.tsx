import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Login } from '../components/login';
import { Signup } from '../components/signup';

export const LoginSignup:React.FC = () => {
  const [loggingIn, setLoggingIn] = useState<boolean>(true)
  const [signingUp, setSigningUp] = useState<boolean>(false)

    const toggle = () => {
        setLoggingIn(!loggingIn)
        setSigningUp(!signingUp)
    }

    return (
      <>
        {loggingIn && 
            <>
                <Login/>
                <br />
                <button onClick={toggle}>create an account</button>
            </>
        }
        {signingUp && 
            <>
                <Signup/>
                <br />
                <button onClick={toggle}>login with existing user</button>
            </>
        }
      </>
    )
}