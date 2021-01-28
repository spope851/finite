import React from 'react'
import styled from 'styled-components'

interface OwnProps {
  data:any
  trade: (price:number) => void
}

export const PlayerDetails:React.FC<OwnProps> = (props) => {
  
  let base = props.data.height_inches !== 0 ? props.data.height_inches : props.data.height_feet
  let price = ((base+10)*1.16)
  
  return (
    <>
      <p><span>Price: <Price onClick={e => e.target === e.currentTarget && props.trade(price)}>{price}</Price></span></p>
      <p>{'Position: '+props.data.position}</p>
      <p>{props.data.height_feet ? 'Height: '+props.data.height_feet+'\''+props.data.height_inches+'"' : ''}</p>
      {window.location.pathname.indexOf('team') === -1? <><span>Team: </span><a href={"/teams/"+props.data.team.id}>{props.data.team.full_name}</a></> : <p></p>}
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
