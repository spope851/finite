import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, useParams, Switch, Route } from 'react-router-dom'
import { RouterParams } from './types/router-params.interface'
import { IPlayer, Player } from '../components/player'
import axios from 'axios'
import { ITeam } from '../components/team'

export const PlayerRoutes: React.FC = () => {
    const [player, setPlayer] = useState<IPlayer>()
    const [teams, setTeams] = useState<ITeam[]>()
    const { id } = useParams<RouterParams>()
    
    useEffect(() => {
      const fetchPlayers = async () => {
        const data = await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`, {
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
    
    console.log(player)
    return (
        <Router basename="/players">
            <Switch>
                <Route path={`/${id}`}>
                  {player && 
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
                      volume={player.volume}/>}
                </Route>
            </Switch>
        </Router>
    )
}
