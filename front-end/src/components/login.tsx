import React, { useState, useEffect } from 'react';
import { UserProps } from './user';
import { Redirect, useHistory } from 'react-router-dom'

let axios = require('axios');

const MONGO_EXPRESS_API = process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

export const Login:React.FC = () => {
  const [SignedUp, setSignedUp] = useState<boolean>(false)
  const [wrongPassword, setWrongPassword] = useState<boolean>(false)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const [presentUser, setPresentUser] = useState<string>()
  const [presentUPW, setPresentUPW] = useState<string>()
  
  let history = useHistory()

  useEffect(() => {
    if (loggedIn) {
      history.push("/app")
    }
  },[loggedIn])

  const hasUser = async (username:string) => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`)
    const jsnData = await data.json()
    
    setSignedUp(false)

    jsnData.forEach((user:UserProps) => {
      user.username === username && setSignedUp(true)
    })
  }
  
  const fetchUser = async (username:string, password:string) => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`)
    const jsnData = await data.json()

    jsnData.forEach((user:UserProps) => {
      user.username === username && user.password !== password && setWrongPassword(true)
      if (user.username === username && user.password === password) {
        axios.put(MONGO_EXPRESS_API, {
            "function":"login",
            "_id":user._id
        })
        setLoggedIn(true)
      }
    })
  }

  const login = () => {
    setLoggingIn(true)
    presentUser && presentUPW && fetchUser(presentUser, presentUPW)
  }

  const usernameEntered = (val:string) => {
    hasUser(val)
    setPresentUser(val)
  }

    return (
      <div>
        <h2>Login:</h2>
        <br />
        <input 
          type="text" 
          placeholder="Username" 
          onChange={e => usernameEntered(e.target.value)}  
        />
        <input
          type="password" 
          placeholder="Password" 
          onChange={e => setPresentUPW(e.target.value)} 
        />
        <input 
          onClick={login}
          type="button" 
          value="Login"
          disabled={!presentUser || !presentUPW}
        />
        {loggingIn && !SignedUp && <p style={{color:'red'}}>We can't find your account. Sign up below!</p>}
        {wrongPassword && <p style={{color:'red'}}>Incorrect Password</p>}
      </div>
    )
}