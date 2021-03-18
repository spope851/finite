import React, { useEffect, useState } from 'react';
import './App.css';
import stats from './scrape/player-info.json'
import teams from './scrape/teams.json'
import {Player, IPlayer} from './components/player'
import { ITeam } from './components/team';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string'

let axios = require('axios')

const MONGO_EXPRESS_API = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`
const MONGO_EXPRESS_API_TEAMS = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/teams`

const MONGO_DB = {
  players: {"table":"players"},
  teams: {"table":"teams"}
}

const populateDB = () => {
  axios.put(MONGO_EXPRESS_API, 
  {
    "function":"populate",
    ...MONGO_DB.players,
    "records":stats
  })
  axios.put(MONGO_EXPRESS_API_TEAMS, 
  {
    "function":"populate",
    ...MONGO_DB.teams,
    "records":teams
  })
  document.location.reload()
}

export const App:React.FC = () => {
  
  const { search } = useLocation()
  const { term } = queryString.parse(search)
  
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [teams, setTeams] = useState<ITeam[]>()
  
  useEffect(() => {
    fetchPlayers()
    fetchTeams()
  },[term])
  
  const fetchPlayers = async () => {
    const data = await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`, {
      headers: {term: term || ''}
    })
    
    const jsnData = await data.data
    setPlayers(jsnData)
  }

  const fetchTeams = async () => {
    const data = await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/teams`)
    setTeams(data.data)
  }

  return (
    <>
      {players.length
        ? <div className="row mx-1 bg-white">
            {players.map((player:IPlayer) =>
              <div className={'col-sm-3'} key={player._id}>
                <Player 
                  _id={player._id} 
                  height={player.height && player.height}
                  weight={player.weight && player.weight}
                  position={player.position && player.position}
                  team={player.team}
                  price={player.price}
                  teamName={(teams && teams[player.team - 1].full_name)}
                  name={player.name} 
                  image={player.image && player.image}/>
              </div>)}
          </div>
        : <button onClick={populateDB}>DB is empty, click here to populate</button>}
    </>
  )
}