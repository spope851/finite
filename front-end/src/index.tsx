import React from 'react'
import ReactDOM from 'react-dom'
import { Account } from './components/account'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation
} from "react-router-dom";
import { User, ActiveUserProps } from './components/user'
import { Welcome } from './components/welcome'
import { TeamRoutes } from './routes/team-routes'
import { Login } from './components/login'
import { onThatTab } from './functions/on-that-tab'
import { FixedHeader } from './components/wrappers/header'
import { App } from './App'
import { Timesheet } from './components/timesheet/timesheet'
import { PlayerRoutes } from './routes/player-routes'
import { useData } from './services/data.service'
import infinity from './assets/Infinity.gif'
// import { populateUsers } from './functions/populate-users'
import { PlayerSearch } from './components/player-search'

export const Index:React.FC = () => {
  let location = useLocation()

  const userCall = useData('GET', 'user')
  const user:ActiveUserProps = !userCall.loading && userCall.data[0]
  
  return (
    <>
      <FixedHeader className="nav-tabs d-flex justify-content-between py-0 bg-light">
        {userCall.loading
          ? <img alt={'loading'} src={infinity} height={50} style={{ marginLeft: "50px" }} />
          : user
            ? <User user={user}/>
            : <Login />}
        <ul className="nav align-self-end animate__animated animate__fadeInDownBig">
          <li className={`nav-item`}><a className={`nav-link ${onThatTab('app') ? 'active' : ''}`} href="/app">App</a></li>
          <li className={`nav-item`}><a className={`nav-link ${onThatTab('account') ? 'active' : ''}`} href="/account">Account</a></li>
        </ul>
        <PlayerSearch />
      </FixedHeader>
      {/* <button
        className="btn btn-outline-warning m-2"
        onClick={populateUsers}>
          No users in DB. Click here to add some for testing
      </button> */}
      {location.pathname === "/"
        ? <Welcome/>
        : ''}
    </>
  )  
}

ReactDOM.render(
    <div className="App">
      <div className="content-wrap">
        <Router>
            <Route path="/" component={Index} />
            <Route path="/account" component={Account} />
            <Route path="/app" component={App} />
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