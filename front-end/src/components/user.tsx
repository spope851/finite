import React from 'react'
import styled from 'styled-components'
import { populateUsers } from '../functions/populate-users'

export interface UserProps {
  _id:string,
  username:string,
  password:string,
  signedIn:boolean,
  cash:string,
  stockValue:string
}

interface OwnProps {
  user?:UserProps
  noUsers:boolean
}

export const User:React.FC<OwnProps> = (props) => {

  const { user, noUsers } = props

  const message =
    `Logged in as:  
    ${user
      ? user.username 
      : 'Guest'}, Welcome!`

  const value = `Account Value: $${user && ((Number(user.cash) + Number(user.stockValue)) || 0)}`

  return (
    <>
      <Card className="card text-dark">
          {message} 
          {user 
           ? ''
           : <span>Click <a href='/login'>here</a> to sign up for an account</span>}
      </Card>
      <br />
      {noUsers && <button onClick={populateUsers}>No users in DB. Click here to add some for testing</button>}
      {user &&
        <Card className="card text-dark">
          {value} 
        </Card>}
    </>
  )
}

const Card = styled.div`
& {
  margin-top: 20px;
  padding: 10px;
}`
