import React, { useEffect, useState } from 'react';
import './App.css';
import stats from './scrape/playerStats.json'
import {Player} from './components/player'

let axios = require('axios')

const MONGO_EXPRESS_API = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`

const MONGO_DB = {
  "db":"player_account",
  "table":"players"
}

const populatePlayers = () => {
  axios.put(MONGO_EXPRESS_API, 
  {
    "function":"populate",
    ...MONGO_DB,
    "records":stats
  })
  document.location.reload()
}

export const App:React.FC = () => {
  
  const [players, setPlayers] = useState<any>([])
  
  useEffect(() => {
    fetchUser()
  },[])
  
  const fetchUser = async () => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`)
    const jsnData = await data.json()
    setPlayers(jsnData)
  }

  return (
    <div className="card col-12">
      <div className="card-header">All Players</div>
        <div className="card-body">
          {players.length
            ? <div className="row">
              {players.map((el:any, i:number) =>
              <Player details={el.data[0]} name={el.data[0].first_name+' '+el.data[0].last_name} key={i}/>)}
              </div>
            : <button onClick={populatePlayers}>No players in DB. Click here to add some for testing</button>}
      </div>
    </div>
  )
}