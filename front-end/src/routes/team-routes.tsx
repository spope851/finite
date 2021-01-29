import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, useParams, Switch, Route } from 'react-router-dom'
import { RouterParams } from './types/router-params.interface'
import { Team } from '../components/team'

export const TeamRoutes: React.FC = () => {
    
    const { id } = useParams<RouterParams>()

    const [players, setPlayers] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
        
    useEffect(() => {
        fetchPlayers()
    },[])
    
    const fetchPlayers = async () => {
        const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`)
        const jsnData = await data.json()
        for (let i = 0; jsnData.length > i; i++) {
            if(jsnData[i].data[0].team.id.toString() === id){
                setPlayers(players => [...players, jsnData[i]])
            }
            if (i === (jsnData.length - 1)) {
                setLoading(false)
            }
        }
    }

    return (
        <Router basename="/teams">
            <Switch>
                <Route path={`/${id}`}>
                    {!loading && <Team id={id} players={players} />}
                </Route>
            </Switch>
        </Router>
    )
}
