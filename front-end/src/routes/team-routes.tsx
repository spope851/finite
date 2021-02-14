import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, useParams, Switch, Route } from 'react-router-dom'
import { RouterParams } from './types/router-params.interface'
import { Team } from '../components/team'
import { IPlayer } from '../components/player'

let axios = require('axios')

export const TeamRoutes: React.FC = () => {
    
    const { id } = useParams<RouterParams>()

    return (
        <Router basename="/teams">
            <Switch>
                <Route path={`/${id}`}>
                    <Team id={id} />
                </Route>
            </Switch>
        </Router>
    )
}
