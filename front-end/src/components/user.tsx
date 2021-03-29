import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
& {
  margin: 10px;
  padding: 10px;
}`

export interface UserProps {
  _id:string,
  username:string,
  password:string,
  signedIn:boolean,
  cash:string,
  stockValue:string
}

interface OwnProps {
  user?:any
}

export const User:React.FC<OwnProps> = (props) => {
  const { user } = props
  
  const value = user ? `$${user && ((Number(user.cash) + Number(user.stockValue)).toFixed(2) || 0)}` : ''

  const message =
    `${user
      ? user.username 
      : 'Guest'}: `

  return (
    <>
      <Card className="card text-dark animate__animated animate__fadeInDownBig">
          <span>
            {message} 
            <span className={`text-success`}>{value}</span>
           </span>
      </Card>
    </>
  )
}
