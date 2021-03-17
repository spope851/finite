import React, { useState } from 'react';
import { UserProps } from './user';

let axios = require('axios');

const MONGO_EXPRESS_API = process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

export const Signup:React.FC = () => {
  const [unavailable, setUnavailable] = useState<boolean>(false)
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
  }

  const usernameEntered = (val:string) => {
    hasUser(val)
    setPresentUser(val)
  }

    return (
      <form className="form-inline m-2 justify-content-center mt-5" onSubmit={() => presentUser && presentUPW && storeUser(presentUser, presentUPW)}>
        <h2 className="mr-2">Sign Up:</h2>
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
          disabled={!presentUser || !presentUPW || unavailable}>Create Account</button>
        {unavailable && <span className="text-danger ml-1">{`This username is taken :( Please try another`}</span>}
      </form>
    )
}