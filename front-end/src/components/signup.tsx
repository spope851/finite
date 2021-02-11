import React, { useState } from 'react';
import { UserProps } from './user';
import { Redirect } from 'react-router-dom'

let axios = require('axios');

const MONGO_EXPRESS_API = process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

export const Signup:React.FC = () => {
  const [unavailable, setUnavailable] = useState<boolean>(false)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [presentUser, setPresentUser] = useState<string>()
  const [presentUPW, setPresentUPW] = useState<string>()
  
  let nextID:string

  const hasUser = async (username:string) => {
    const data = await fetch(MONGO_EXPRESS_API)
    const jsnData = await data.json()

    setUnavailable(false)
    
    jsnData.forEach((user:UserProps) => {
      nextID = user._id
      user.username === username && setUnavailable(true)
    })
  }
  
  const storeUser = async (username:string, password:string) => {
    axios.post(MONGO_EXPRESS_API,{
        "username": username,
        "password": password,
        "signedIn":true,
        "cash": '0',
        "stockValue": '0'
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
          onClick={() => presentUser && presentUPW && storeUser(presentUser, presentUPW)} 
          type="button" 
          value="Create Account"
          disabled={!presentUser || !presentUPW || unavailable}
        />
        {unavailable && <p style={{color:'red'}}>{`This username is taken :( Please try another`}</p>}
      </div>
    )
}