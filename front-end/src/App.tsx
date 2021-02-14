import React, { useEffect, useState } from 'react';
import './App.css';
import stats from './scrape/player-info.json'
import leaders from './scrape/season-leaders.json'
import teams from './scrape/teams.json'
import {Player, IPlayer} from './components/player'
import { ITeam } from './components/team';

let axios = require('axios')

const MONGO_EXPRESS_API = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`

const MONGO_DB = {
  players: {"table":"players"},
  leaders: {"table":"leaders"},
  teams: {"table":"teams"}
}

const populatePlayers = () => {
  axios.put(MONGO_EXPRESS_API, 
  {
    "function":"populate",
    ...MONGO_DB.players,
    "records":stats
  })
  axios.put(MONGO_EXPRESS_API, 
    {
      "function":"populate",
      ...MONGO_DB.leaders,
      "records":leaders
    })
  axios.put(MONGO_EXPRESS_API, 
    {
      "function":"populate",
      ...MONGO_DB.teams,
      "records":teams
    })
    document.location.reload()
}

export const App:React.FC = () => {
  
  const [players, setPlayers] = useState<IPlayer[]>()
  const [teams, setTeams] = useState<ITeam[]>()
  
  useEffect(() => {
    fetchPlayers()
    fetchTeams()
  },[])
  
  const fetchPlayers = async () => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`)
    const jsnData = await data.json()
    setPlayers(jsnData)
  }

  const fetchTeams = async () => {
    const data = await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/teams`)
    setTeams(data.data)
  }

  return (
    <div className="card col-12">
      <div className="card-header">All Players</div>
        <div className="card-body">
          {players
            ? <div className="row">
              {players.map((player:IPlayer) =>
                <Player 
                  _id={player._id} 
                  height={player.height && player.height}
                  weight={player.weight && player.weight}
                  position={player.position}
                  team={player.team}
                  price={player.price}
                  teamName={(teams && teams[player.team - 1].full_name)}
                  name={player.name} 
                  key={player._id}/>)}
              </div>
            : <button onClick={populatePlayers}>No players in DB. Click here to add some for testing</button>}
      </div>
    </div>
  )
}