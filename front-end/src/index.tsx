import React, { BaseSyntheticEvent, FormEvent } from 'react'
import ReactDOM from 'react-dom'
import { Account } from './components/account'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import { User, UserProps } from './components/user'
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

export const Index:React.FC = () => {
  let location = useLocation()
  let history = useHistory()

  const users = useData('GET', 'users')
  const activeUser = !users.loading && users.data.find((user:UserProps) => user.signedIn === true)

  const search = (e: BaseSyntheticEvent) => {
    e.preventDefault()
    history.replace(`/app?term=${e.target[0].value}`)
  }

  const change = (e: FormEvent<HTMLInputElement>) => {
    onThatTab('app') && history.push(`?term=${e.currentTarget.value}`)
  }
    
  return (
    <>
      <FixedHeader className="navbar bg-light">
        {users.loading
          ? <img alt={'loading'} src={infinity} height={50} style={{ marginLeft: "50px" }} />
          : activeUser
            ? <User
                user={activeUser} 
                noUsers={!users.data.length}/>
            : <Login />}
        <ul className="nav nav-tabs justify-content-center animate__animated animate__fadeInDownBig">
          <li className={`nav-item`}><a className={`nav-link ${onThatTab('app') ? 'active' : ''}`} href="/app">App</a></li>
          <li className={`nav-item`}><a className={`nav-link ${onThatTab('account') ? 'active' : ''}`} href="/account">Account</a></li>
        </ul>
        <form 
          className="form-inline my-2 my-lg-0 animate__animated animate__fadeInDownBig" 
          onSubmit={search}>
          <input 
            className="form-control mr-sm-2" 
            type="search" 
            placeholder="Search" 
            aria-label="Search"
            onChange={change} />
          <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
        </form>
      </FixedHeader>
      {location.pathname === "/"
        ? <Welcome/>
        : ''}
    </>
  )  
}

ReactDOM.render(
    <div className="App">
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
          <Switch>
              <Route exact path="/time" component={Timesheet} />
          </Switch>
      </Router>
    </div>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA