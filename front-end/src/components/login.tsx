import React, { useState } from 'react';
import { userProps } from './user';
import { Redirect } from 'react-router-dom'

let axios = require('axios');

const MONGO_EXPRESS_API = process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

const MONGO_DB = {
  "db":"user_account",
  "table":"users"
}

export const Login:React.FC = () => {
  const [SignedUp, setSignedUp] = useState<boolean>(false)
  const [wrongPassword, setWrongPassword] = useState<boolean>(false)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const [presentUser, setPresentUser] = useState<string>()
  const [presentUPW, setPresentUPW] = useState<string>()
  
  const hasUser = async (username:string) => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`)
    const jsnData = await data.json()
    
    setSignedUp(false)

    jsnData.forEach((user:userProps) => {
      user.username === username && setSignedUp(true)
    })
  }
  
  const fetchUser = async (username:string, password:string) => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`)
    const jsnData = await data.json()

    jsnData.forEach((user:userProps) => {
      user.username === username && user.password !== password && setWrongPassword(true)
      if (user.username === username && user.password === password) {
        axios.put(MONGO_EXPRESS_API, {
            "function":"login",
            ...MONGO_DB, 
            "id":user.id
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
        {loggedIn && <Redirect from={'/login'} to={'/app'} /> }
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