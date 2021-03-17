import React, { useState, BaseSyntheticEvent } from 'react';
import { UserProps } from './user';
import { onThatTab } from '../functions/on-that-tab';

let axios = require('axios');

const MONGO_EXPRESS_API = process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

export const Login:React.FC = () => {
  const [signedUp, setSignedUp] = useState<boolean>(false)
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const [presentUser, setPresentUser] = useState<string>()
  const [presentUPW, setPresentUPW] = useState<string>()
  
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
      user.username === username && user.password !== password && alert('Incorrect Password')
      if (user.username === username && user.password === password) {
        axios.put(MONGO_EXPRESS_API, {
            "function":"login",
            "_id":user._id
        })
      }
    })
  }

  const login = (e: BaseSyntheticEvent) => {
    !signedUp && e.preventDefault()
    setLoggingIn(true)
    presentUser && presentUPW && fetchUser(presentUser, presentUPW)
  }

  const usernameEntered = (val:string) => {
    hasUser(val)
    setPresentUser(val)
  }

    return (
      <form className="form-inline m-2 justify-content-center" onSubmit={login}>
        <br />
        <input
          className="form-control mr-sm-2"
          aria-label="Username"
          type="text" 
          placeholder="Username" 
          onChange={e => usernameEntered(e.target.value)}  
        />
        <input
          className="form-control mr-sm-2"
          aria-label="Password" 
          type="password" 
          placeholder="Password" 
          onChange={e => setPresentUPW(e.target.value)} 
        />
        <button
          className="btn btn-outline-primary my-2 my-sm-0" 
          type="submit" 
          disabled={!presentUser || !presentUPW}>Login</button>
        {!onThatTab('account') && <><span className="ml-1">or </span><a className="stretched-link ml-1" href={'/account'}>create an account</a></>}
        {loggingIn && !signedUp && !onThatTab('account') && <span className="text-danger mx-1">We can't find your account</span>}
        {loggingIn && !signedUp && onThatTab('account') && <span className="text-danger ml-1">We can't find your account. Sign up below!</span>}
      </form>
    )
}