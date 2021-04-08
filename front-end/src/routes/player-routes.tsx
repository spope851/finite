import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, useParams, Switch, Route } from 'react-router-dom'
import { RouterParams } from './types/router-params.interface'
import { IPlayer, Player } from '../components/player'
import axios from 'axios'
import { ITeam } from '../components/team'
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const PlayerRoutes: React.FC = () => {
    const [player, setPlayer] = useState<IPlayer>()
    const [teams, setTeams] = useState<ITeam[]>()
    const { id } = useParams<RouterParams>()
    
    useEffect(() => {
      const fetchPlayers = async () => {
        const data = await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/player`, {
          headers: {player: id}
        })
        
        const player = await data.data
        setPlayer(player[0])
      }
  
      const fetchTeams = async () => {
        const data = await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/teams`)
        setTeams(data.data)
      }
      fetchPlayers()
      fetchTeams()
    },[id])

    const MAX = player && Number(Math.max(...Object.values(player.price)).toFixed())
    const MIN = player && Number(Math.min(...Object.values(player.price)).toFixed())
    
    return (
        <Router basename="/players">
            <Switch>
                <Route path={`/${id}`}>
                  {/* {player && 
                    <Player 
                      _id={player._id} 
                      height={player.height && player.height}
                      weight={player.weight && player.weight}
                      position={player.position && player.position}
                      team={player.team}
                      price={player.price}
                      teamName={(teams && teams[player.team - 1].full_name)}
                      name={player.name} 
                      image={player.image && player.image}
                      volume={player.volume}/>} */}
                    {player && 
                     <>
                      <div className="d-flex mt-5 align-items-center justify-content-around">
                        <div className={"float-left align-self-start"}>
                          <img className={"border rounded-circle border-secondary mb-3 bg-light"} src={player.image && player.image} alt={player.name}/>
                          <p>{ `${player.name} - ${player.position && player.position}` }</p>
                          <a href={`/teams/${player.team}`}>{ teams && teams[player.team - 1].full_name }</a>
                        </div>
                        <ResponsiveContainer className="float-right" width="50%" height={400}>
                          <AreaChart data={player.chart}>
                            <defs>
                              <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                                <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
                              </linearGradient>
                            </defs>

                            <Area dataKey="v" stroke="#2451B7" fill="url(#color)" />

                            <XAxis
                              dataKey="k"
                              axisLine={false}
                              tickLine={false}
                            />

                            <YAxis
                              domain={MIN && MAX ? [MIN - (MIN % 10), MAX + (10 - (MAX % 10))] : [0,0]}
                              dataKey="v"
                              axisLine={false}
                              tickLine={false}
                              tickCount={8}
                              tickFormatter={(number) => `$${number.toFixed(2)}`}
                            />

                            <Tooltip />

                            <CartesianGrid opacity={0.1} vertical={false} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className={"d-flex row m-5"}>
                        {player.stats && player.stats.map((stat: {[key:string]:number}) => {
                          return player.stats &&
                            <span className={"m-2 p-2 badge badge-light border border-secondary text-muted"}>
                              {`${Object.keys(stat)[0]}`}<span className={"p-1 mx-1 badge badge-pill badge-white bg-white border border-dark text-dark"}>{`#${stat[Object.keys(stat)[0]]}`}</span>
                            </span>
                        })}
                      </div>
                    </>}

                </Route>
            </Switch>
        </Router>
    )
}
