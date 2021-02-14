import React, { useEffect, useState } from 'react';
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
      fetchPlayers()
  },[])
  
  const fetchPlayers = async () => {
    const data = await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`, {
      headers: {
        "team":id
      }
    })
    console.log(data)
    data.data[0] && 
    setResponse(data.data[0])
  }

  return (
    <div className="card col-12">
      <div className="card-header">{response && response.name}</div>
      <div className="card-body">
        <table className="table">
          <tbody>
            <tr>
              <td>{response && 'City: '+response.city}</td>
              <td>{response && 'Conference: '+response.conference}</td>
              <td>{response && 'Division: '+response.division}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <h2>Players</h2>
        <div className="row">
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
              key={player._id}/>
          )}
        </div>
      </div>
    </div>
  )
}
