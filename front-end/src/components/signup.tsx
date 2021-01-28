import React, { useState } from 'react';
import { userProps } from './user';
import { Redirect } from 'react-router-dom'

let axios = require('axios');

const MONGO_EXPRESS_API = process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

const MONGO_DB = {
  "db":"user_account",
  "table":"users"
}

export const Signup:React.FC = () => {
  const [unavailable, setUnavailable] = useState<boolean>(false)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [presentUser, setPresentUser] = useState<string>()
  const [presentUPW, setPresentUPW] = useState<string>()
  
  let nextID:number

  const hasUser = async (username:string) => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`)
    const jsnData = await data.json()

    setUnavailable(false)
    
    jsnData.forEach((user:userProps) => {
      nextID = user.id
      user.username === username && setUnavailable(true)
    })
  }
  
  const fetchUser = async (username:string, password:string) => {
    axios.post(MONGO_EXPRESS_API,{
        "id": nextID + 1,
        "username": username,
        "password": password,
        "signedIn":true
        })
    setLoggedIn(true)
  }

  const usernameEntered = (val:string) => {
    hasUser(val)
    setPresentUser(val)
  }

    return (
      <div>
        {loggedIn && <Redirect from={'/login'} to={'/app'} /> }
        <h2>Sign Up:</h2>
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
          onClick={() => presentUser && presentUPW && fetchUser(presentUser, presentUPW)} 
          type="button" 
          value="Create Account"
          disabled={!presentUser || !presentUPW || unavailable}
        />
        {unavailable && <p style={{color:'red'}}>{`This username is taken :( Please try another`}</p>}
      </div>
    )
}