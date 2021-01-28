import React, { useEffect, useState } from 'react';
import { Player } from './player'

interface OwnProps {
  
}

export const Team:React.FC<OwnProps> = (props) => {
  
  let teamID = window.location.pathname.replace('/teams/','')
  
  const [allPlayers, setAllPlayers] = useState<any[]>()
    
  useEffect(() => {
    fetchUser()
  },[])
  
  const fetchUser = async () => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`)
    const jsnData = await data.json()
    setAllPlayers(jsnData)
  }
  
  let players:any[] = []
  
  allPlayers && allPlayers.forEach((player, i) => {
    if(player.data[0].team.id.toString() === teamID){
      players.push(i)
    }
  })
  
  return (
    <div className="card col-12">
      <div className="card-header">{allPlayers && allPlayers[players[0]].data[0].team.name}</div>
      <div className="card-body">
        <table className="table">
          <tbody>
            <tr>
              <td>{allPlayers && 'City: '+allPlayers[players[0]].data[0].team.city}</td>
              <td>{allPlayers && 'Conference: '+allPlayers[players[0]].data[0].team.conference}</td>
              <td>{allPlayers && 'Division: '+allPlayers[players[0]].data[0].team.division}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <h2>Players</h2>
        <div className="row">
          {players.map((el, i) => 
            <Player details={allPlayers && allPlayers[el].data[0]} name={allPlayers && allPlayers[el].data[0].first_name+' '+allPlayers[el].data[0].last_name} key={i}/>
          )}
        </div>
      </div>
    </div>
  );
}
