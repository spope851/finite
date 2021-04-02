import React from 'react'
import ReactDOM from 'react-dom'
import { Account } from './components/account'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { User, ActiveUserProps } from './components/user'
import { TeamRoutes } from './routes/team-routes'
import { Login } from './components/login'
import { onThatTab } from './functions/on-that-tab'
import { FixedHeader } from './components/wrappers/header'
import { App } from './App'
import { Timesheet } from './components/timesheet/timesheet'
import { PlayerRoutes } from './routes/player-routes'
import { useData } from './services/data.service'
import eclipse from './assets/Eclipse.gif'
import { PlayerSearch } from './components/player-search'
import { Home } from './components/home'
import Axios from 'axios';
// import { Welcome } from './components/welcome'
// import { populateUsers } from './functions/populate-users'

export const Index:React.FC = () => {
  const userCall = useData('GET', 'user')
  const user:ActiveUserProps = !userCall.loading && userCall.data[0]

  // Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`, {}, { auth: { username:"spope", password:"0123" } })
  
  return (
    <>
      <FixedHeader className={`nav-tabs d-flex justify-content-between py-0 ${onThatTab("/", true) && "mb-2"} bg-light`}>
        {userCall.loading
          ? <img
              alt={'loading'}
              src={eclipse}
              height={50}
              style={{ marginLeft: "50px" }} />
          : user
            ? <User user={user}/>
            : <Login />}
        <ul className="nav align-self-end animate__animated animate__fadeInDownBig">
          <li className={`nav-item`}>
            <a
              className={`navbar-brand text-dark nav-link ${onThatTab('/', true) ? 'active animate__animated animate__pulse animate__delay-2s' : ''}`}
              href="/">
                finite
            </a>
          </li>
          <li className={`nav-item`}>
            <a
              className={`nav-link text-muted ${onThatTab('players') ? 'active' : ''}`}
              href="/players">
                Players
            </a>
          </li>
          <li className={`nav-item`}>
            <a
              className={`nav-link text-muted ${onThatTab('account') ? 'active' : ''}`}
              href="/account">
                Account
            </a>
          </li>
        </ul>
        <PlayerSearch />
      </FixedHeader>
      {/* <button
        className="btn btn-outline-warning m-2"
        onClick={populateUsers}>
          No users in DB. Click here to add some for testing
      </button> */}
      {onThatTab('/', true) && <Home/> }
    </>
  )  
}

ReactDOM.render(
    <div className="App">
      <div className="content-wrap">
        <Router>
            <Route path="/" component={Index} />
            <Route path="/account" component={Account} />
            <Route path="/players" component={App} />
            <Switch>
                <Route path="/teams/:id" component={TeamRoutes} />
            </Switch>
            <Switch>
                <Route path="/players/:id" component={PlayerRoutes} />
            </Switch>
            <Route path="/time" component={Timesheet} />
        </Router>
      </div>
      <footer 
        className={"bg-light p-4 border-top"}
        style={{ marginTop: "auto", height: "75px"}}>
        github:<a className="stretched-link ml-1" href="http://github.com/spope851" >spope851</a>
      </footer>
    </div>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA