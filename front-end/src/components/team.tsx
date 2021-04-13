import React, { useEffect, useState } from 'react';
import { Endpoints } from '../variables/api.variables';
import { Player, IPlayer } from './player'

let axios = require('axios');

interface OwnProps {
  id:string
}

export interface ITeam {
    _id:string
    id:number
    abbreviation:string
    city:string
    conference:string
    division:string
    full_name:string
    name:string
}

interface TeamProfile extends ITeam {
  players:IPlayer[]
}

export const Team:React.FC<OwnProps> = (props) => {
  
  const { id } = props
  
  const [response, setResponse] = useState<TeamProfile>()
  
  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await axios.get(Endpoints.PLAYERS, {
        headers: {
          "team":id
        }
      })
      data.data[0] && 
      setResponse(data.data[0])
    }
    fetchPlayers()
  },[id])
  

  return (
    <>
      <table className="table table-borderless text-muted">
        <tbody>
          <tr style={{ borderTop: "hidden" }}>
            <th colSpan={3}>{response && response.name}</th>
          </tr>
          <tr>
            <th>{response && 'City: '+response.city}</th>
            <th>{response && 'Conference: '+response.conference}</th>
            <th>{response && 'Division: '+response.division}</th>
          </tr>
        </tbody>
      </table>
      <h2 className="h2 text-muted">Players</h2>
      <div className="row mx-5 pt-1 bg-white justify-content-center border-top">
        {response && response.players.map((player:IPlayer) => 
            <Player 
              _id={player._id} 
              height={player.height && player.height}
              weight={player.weight && player.weight}
              position={player.position}
              team={player.team}
              teamName={(response && response.full_name) || ''}
              price={player.price}
              name={player.name} 
              image={player.image}
              volume={player.volume}/>
        )}
      </div>
    </>
  )
}
