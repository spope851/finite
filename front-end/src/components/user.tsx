import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../contexts/user'
import {useGet} from '../services/get.service'

let axios = require('axios')

const MONGO_EXPRESS_API = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

const MONGO_DB = {
  "db":"user_account",
  "table":"users"
}

const populateUsers = () => {
  axios.put(MONGO_EXPRESS_API, 
  {
    "function":"populate",
    ...MONGO_DB,
    "records":[
      {
          id: 0,
          username: 'spope',
          password: '0123',
          signedIn: false
      },
      {
          id: 1,
          username: 'tlutke',
          password: '0123',
          signedIn: false
      },
      {
          id: 2,
          username: 'emusk',
          password: '0123',
          signedIn: false
      },
      {
          id: 3,
          username: 'abecker',
          password: '0123',
          signedIn: false
      },
      {
          id: 4,
          username: 'nhill',
          password: '0123',
          signedIn: false
      },
      {
          id: 5,
          username: 'pattia',
          password: '0123',
          signedIn: false
      },
      {
          id: 6,
          username: 'nravikant',
          password: '0123',
          signedIn: false
      }
    ]
  })
}

export interface userProps {
  id:number,
  username:string,
  password:string,
  signedIn:boolean
}

interface OwnProps {
  user?:string
  noUsers:boolean
}

export const User:React.FC<OwnProps> = (props) => {

  const {user, noUsers} = props

  const message =
    `Logged in as:  
    ${user
      ? user 
      : 'Guest'}, Welcome!`

  return (
    <>
      <div className="card text-dark">
          {message} 
          {user 
           ? ''
           : <span>Click <a href='/login'>here</a> to sign up for an account</span>}
      </div><br />
      {noUsers && <button onClick={populateUsers}>No users in DB. Click here to add some for testing</button>}
    </>
    )
}