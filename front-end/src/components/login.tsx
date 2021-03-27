import React, { useState, BaseSyntheticEvent } from 'react'
import { UserProps } from './user'
import { onThatTab } from '../functions/on-that-tab'
import { useData } from '../services/data.service'
let axios = require('axios')

const MONGO_EXPRESS_API = process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

export const Login:React.FC = () => {
  const [signedUp, setSignedUp] = useState<boolean>(true)
  const [incorrectPw, setIncorrectPw] = useState<boolean>(false)
  const [presentUser, setPresentUser] = useState<string>()
  const [presentUPW, setPresentUPW] = useState<string>()
  
  const users = useData('GET', 'users').data
  const hasUser = (username:string) => {
    setSignedUp(users.find((user: UserProps) => user.username === username))
  }
  
  const fetchUser = (user_id: string) => {
    axios.put(MONGO_EXPRESS_API, {
        "function":"login",
        "_id":user_id
    })
  }

  const login = (e: BaseSyntheticEvent) => {
    !signedUp && e.preventDefault()
    presentUser && presentUPW && users.forEach((user:UserProps) => {
      if (user.username === presentUser && user.password !== presentUPW) {
        e.preventDefault()
        setIncorrectPw(true)
      }
      if (user.username === presentUser && user.password === presentUPW) {
        fetchUser(user._id)
      }
    })
  }

  const usernameEntered = (val:string) => {
    hasUser(val)
    setPresentUser(val)
  }

    return (
      <form className="form-inline m-2 justify-content-center animate__animated animate__fadeInDownBig" onSubmit={login}>
        <br />
        <input
          className={`form-control mr-sm-2 animate__animated animate__faster ${!signedUp && 'animate__headShake border-danger'}`}
          aria-label="Username"
          type="text" 
          placeholder="Username" 
          onBlur={e => usernameEntered(e.target.value)}  
        />
        <input
          className={`form-control mr-sm-2 animate__animated animate__faster ${incorrectPw && 'animate__headShake border-danger'}`}
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
      </form>
    )
}