import React, { useEffect, useState } from 'react'
import './App.css'
import stats from './scrape/player-info.json'
// import teams from './scrape/teams.json'
import {Player, IPlayer} from './components/player'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useData } from './services/data.service'
import infinity from './assets/Infinity.gif'
import { onThatTab } from './functions/on-that-tab'
let axios = require('axios')

const MONGO_EXPRESS_API = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`
// const MONGO_EXPRESS_API_TEAMS = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/teams`

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
  // DEV: uncomment if you need to refresh teams...
  // axios.put(MONGO_EXPRESS_API_TEAMS, 
  // {
  //   "function":"populate",
  //   ...MONGO_DB.teams,
  //   "records":teams
  // })
  document.location.reload()
}

export const App:React.FC = () => {
  const { search } = useLocation()
  const { term } = queryString.parse(search)

  const [players, setPlayers] = useState<IPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<string | null>('nameaz')
  
  const teams = useData('GET', 'teams').data

  const storage = window.localStorage.getItem("crumbs")
  const recentInterests = storage && Array.from(JSON.parse(storage)).slice(0,5) as { id:string, name:string }[]
  
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await axios.get(MONGO_EXPRESS_API, { headers: { term: term || '', sort } })
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
      {onThatTab('/players', true) &&
        <>
          {players && players[0]
          ? <>
              <div
                style={{ position: "sticky", top: 67, zIndex: 10 }}
                className="d-flex justify-content-between bg-white p-3 animate__animated animate__fadeIn">
                <div className="input-group w-25">
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
                {storage && 
                  <div className="align-self-center animate__animated animate__fadeIn">
                    <dl className="list-inline mb-0">
                      <dt className="list-inline-item text-muted">Recent Interests:</dt>
                      {recentInterests && recentInterests.map((value: { id:string, name:string }) => {
                        return (
                          <dd
                            key={value.id as string}
                            className="list-inline-item badge badge-pill badge-light p-1 border">
                            <a className="text-muted p-1" href={`/players/${value.id}`}>
                              {value.name}
                            </a>
                          </dd>
                        )
                      })}
                    </dl>
                  </div>}
              </div>
              <div className="row mx-5 pt-1 bg-white justify-content-center border-top">
                {players.map((player:IPlayer) =>
                      <Player
                        key={player._id}
                        _id={player._id} 
                        height={player.height && player.height}
                        weight={player.weight && player.weight}
                        position={player.position && player.position}
                        team={player.team}
                        price={player.price}
                        teamName={(teams && teams[player.team - 1].full_name)}
                        name={player.name} 
                        image={player.image && player.image}
                        volume={player.volume}/>)}
                
              </div>
            </>  
            : loading
              ? <img
                  alt={'loading'}
                  src={infinity} />
              : <button
                  className="btn btn-outline-warning m-5"
                  onClick={populateDB}>DB is empty, click here to populate</button>}
        </>}
    </>
  )
}
