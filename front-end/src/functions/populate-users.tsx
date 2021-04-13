import { Endpoints } from "../variables/api.variables"

let axios = require('axios')

export const populateUsers = () => {
  axios.put(Endpoints.USERS, 
  {
    "function":"populate",
    "table":"users",
    "records":[
      {
          username: 'spope',
          password: '0123',
          signedIn: false,
          cash: 1000
      },
      {
          username: 'tlutke',
          password: '0123',
          signedIn: false,
          cash: 1000
      },
      {
          username: 'emusk',
          password: '0123',
          signedIn: false,
          cash: 1000
      },
      {
          username: 'abecker',
          password: '0123',
          signedIn: false,
          cash: 100000
      },
      {
          username: 'nhill',
          password: '0123',
          signedIn: false,
          cash: 100
      },
      {
          username: 'pattia',
          password: '0123',
          signedIn: false,
          cash: -100
      },
      {
          username: 'nravikant',
          password: '0123',
          signedIn: false,
          cash: 0
      }
    ]
  })
  document.location.reload()
}