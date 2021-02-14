import React from 'react'
import styled from 'styled-components'

interface OwnProps {
  price:number
  position:string
  height?:string
  weight?:number
  teamId:number
  teamName:string
  trade: (price:number) => void
}

export const PlayerDetails:React.FC<OwnProps> = (props) => {

  const { price, position, height, weight, teamId, teamName } = props
  
  return (
    <>
      <p><span>Price: <Price onClick={e => e.target === e.currentTarget && props.trade(price)}>{`$${price}`}</Price></span></p>
      <p>{'Position: '+position}</p>
      <p>{height ? 'Height: '+height : ''}</p>
      <p>{weight ? 'Weight: '+weight : ''}</p>
      {window.location.pathname.indexOf('team') === -1? <><span>Team: </span><a href={"/teams/"+teamId}>{teamName}</a></> : <p></p>}
    </>
  )
}

const Price = styled.span`
&& {
  color:green;
  :hover {
    text-shadow: 0 0 5px #00ff00;
    cursor: pointer;
  }
}`
