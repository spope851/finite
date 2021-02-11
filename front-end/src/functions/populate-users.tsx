import React from 'react'

let axios = require('axios')

const MONGO_EXPRESS_API = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

export const populateUsers = () => {
  axios.put(MONGO_EXPRESS_API, 
  {
    "function":"populate",
    "table":"users",
    "records":[
      {
          username: 'spope',
          password: '0123',
          signedIn: false,
          cash: 1000,
          stockValue: 0
      },
      {
          username: 'tlutke',
          password: '0123',
          signedIn: false,
          cash: 1000,
          stockValue: 0
      },
      {
          username: 'emusk',
          password: '0123',
          signedIn: false,
          cash: 1000,
          stockValue: 0
      },
      {
          username: 'abecker',
          password: '0123',
          signedIn: false,
          cash: 100000,
          stockValue: 1000
      },
      {
          username: 'nhill',
          password: '0123',
          signedIn: false,
          cash: 100,
          stockValue: 0
      },
      {
          username: 'pattia',
          password: '0123',
          signedIn: false,
          cash: -100,
          stockValue: 200
      },
      {
          username: 'nravikant',
          password: '0123',
          signedIn: false,
          cash: 0,
          stockValue: 0
      }
    ]
  })
  document.location.reload()
}