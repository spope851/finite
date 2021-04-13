import React from 'react'

interface OwnProps {
  price:{[key:string]: number}
  position?:string
  height?:string
  weight?:number
  teamId:number
  teamName:string
  volume:number
}

export const PlayerDetails:React.FC<OwnProps> = (props) => {

  const { position, height, weight, teamId, teamName, volume } = props
  
  return (
    <>
      <p>{'Volume: '+volume}</p>
      <p>{'Position: '+position}</p>
      <p>{height ? 'Height: '+height : ''}</p>
      <p>{weight ? 'Weight: '+weight : ''}</p>
      {window.location.pathname.indexOf('team') === -1? <p><span>Team: </span><a href={"/teams/"+teamId}>{teamName}</a></p> : ''}
    </>
  )
}
