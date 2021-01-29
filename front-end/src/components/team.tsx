import React from 'react';
import { Player } from './player'

interface OwnProps {
  id:string
  players:any[]
}

export const Team:React.FC<OwnProps> = (props) => {
  
  const {players} = props

  return (
    <div className="card col-12">
      <div className="card-header">{players[0].data[0].team.name}</div>
      <div className="card-body">
        <table className="table">
          <tbody>
            <tr>
              <td>{'City: '+players[0].data[0].team.city}</td>
              <td>{'Conference: '+players[0].data[0].team.conference}</td>
              <td>{'Division: '+players[0].data[0].team.division}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <h2>Players</h2>
        <div className="row">
          {players.map((player, i) => 
            <Player details={player.data[0]} name={player.data[0].first_name+' '+player.data[0].last_name} key={i}/>
          )}
        </div>
      </div>
    </div>
  )
}
