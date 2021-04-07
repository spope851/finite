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

    const data = player && Object.entries(player.price).map((x: [string, number]) => {
      return ( { date: x[0], value: Number(x[1].toFixed(2)) } )
    })
    
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
                    <div className="d-flex mt-5 align-items-center justify-content-around">
                      <img className={"border rounded-circle border-secondary bg-light float-left align-self-start"} src={player && player.image && player.image} alt={player && player.name}/>

                      <ResponsiveContainer className="float-right" width="50%" height={400}>
                        <AreaChart data={data}>
                          <defs>
                            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>

                          <Area dataKey="value" stroke="#2451B7" fill="url(#color)" />

                          <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                          />

                          <YAxis
                            domain={data && [data[0].value - 10, data[data.length - 1].value + 10]}
                            dataKey="value"
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

                </Route>
            </Switch>
        </Router>
    )
}
