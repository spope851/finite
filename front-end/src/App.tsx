import React, { useEffect, useState } from 'react'
import './App.css'
import stats from './scrape/player-info.json'
import teams from './scrape/teams.json'
import {Player, IPlayer} from './components/player'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import infinity from './assets/Infinity.gif'
import { useData } from './services/data.service'
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
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<string | null>('nameaz')
  
  const teams = useData('GET', 'teams').data
  
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`, { headers: {term: term || '', sort} })
        setPlayers(data.data)
      } catch (error) {
        console.warn(error)
      } finally {
        setLoading(false)
      }
      
    }
    fetchPlayers()
  }, [term, sort])


  return (
    <>
          <div className="input-group w-25 p-3">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="sort">Sort</label>
            </div>
            <select
              id="sort"
              name="sort"
              onChange={(e) => setSort(Array.from(e.target.children).map((node) => {return node.getAttribute('value')})[e.target.options.selectedIndex])}
              className="custom-select">
              <option value="nameaz">Name (A - Z)</option>
              <option value="nameza">Name (Z - A)</option>
              <option value="priceh">Price (High - Low)</option>
              <option value="pricel">Price (Low - High)</option>
            </select>
          </div>
          {players
           ? <div className="row mx-1 bg-white">
              {players.map((player:IPlayer) =>
                <div className={'col-sm-2'} key={player._id}>
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
           : loading
             ? <img alt={'loading'} src={infinity} />
             : <button onClick={populateDB}>DB is empty, click here to populate</button>}
    </>
  )
}