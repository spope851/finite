import React from 'react'
import styled from 'styled-components'

interface OwnProps {
  price:number
  position?:string
  height?:string
  weight?:number
  teamId:number
  teamName:string
  last_price?:number
}

export const PlayerDetails:React.FC<OwnProps> = (props) => {

  const { price, position, height, weight, teamId, teamName } = props
  
  return (
    <>
      <p>{'Position: '+position}</p>
      <p>{height ? 'Height: '+height : ''}</p>
      <p>{weight ? 'Weight: '+weight : ''}</p>
      {window.location.pathname.indexOf('team') === -1? <p><span>Team: </span><a href={"/teams/"+teamId}>{teamName}</a></p> : ''}
    </>
  )
}
