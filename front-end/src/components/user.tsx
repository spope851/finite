import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
& {
  margin: 10px;
  padding: 10px;
}`

export interface UserProps {
  _id:string
  username:string
  password:string
  signedIn:boolean
}

export interface ActiveUserProps {
  _id: {
    _id:string,
    cash:string,
    username:string
  }
  equity:string
}

interface OwnProps {
  user?:ActiveUserProps
}

export const User:React.FC<OwnProps> = (props) => {
  const { user } = props
  
  const value = user ? `$${user && ((Number(user._id.cash) + Number(user.equity)).toFixed(2) || 0)}` : ''

  const message =
    `${user
      ? user._id.username
      : 'Guest'}: `

  return (
    <>
      <Card className="card mr-auto text-dark animate__animated animate__fadeInDownBig">
          <span>
            {message} 
            <span className={`text-success`}>{value}</span>
           </span>
      </Card>
    </>
  )
}
