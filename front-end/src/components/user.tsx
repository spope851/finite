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
  
  const value = user ? `$${user && ((Number(user.cash) + Number(user.stockValue)).toFixed(2) || 0)}` : ''

  const message =
    `${user
      ? user.username 
      : 'Guest'}: `


  return (
    <>
      <Card className="card text-dark">
          <span>
            {message} 
            {user 
            ? ''
            : <span>Click <a href='/login'>here</a> to sign up for an account</span>}
            <span className={`text-success`}>{value}</span>
           </span>
      </Card>
      {noUsers && <button onClick={populateUsers}>No users in DB. Click here to add some for testing</button>}
    </>
  )
}

const Card = styled.div`
& {
  margin: 10px;
  padding: 10px;
}`
