import React, { BaseSyntheticEvent, FormEvent, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Account } from './components/account'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import { User, UserProps } from './components/user'
import { useEffect } from 'react'
import { Welcome } from './components/welcome'
import { TeamRoutes } from './routes/team-routes'
import { Login } from './components/login'
import { onThatTab } from './functions/on-that-tab'
import { FixedHeader } from './components/wrappers/header'
import { App } from './App';

export const Index:React.FC = () => {
  
  let location = useLocation()
  let history = useHistory()

  const [activeUser, setActiveUser] = useState<UserProps>()
  const [noUsers, setNoUsers] = useState<boolean>(true)

  useEffect(() => {
    fetchUser()
  },[])
  
  const fetchUser = async () => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`)
    const jsnData = await data.json()
    jsnData.length && setNoUsers(false)
    jsnData.forEach((user:UserProps) => {
      if (user.signedIn) {
        setActiveUser(user)
      }
    })
  }

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
        {activeUser
          ? <User
              user={activeUser} 
              noUsers={noUsers}/>
          : <Login />}
        <ul className="nav nav-tabs justify-content-center">
          <li className={`nav-item`}><a className={`nav-link ${onThatTab('app') ? 'active' : ''}`} href="/app">App</a></li>
          <li className={`nav-item`}><a className={`nav-link ${onThatTab('account') ? 'active' : ''}`} href="/account">Account</a></li>
        </ul>
        <form 
          className="form-inline my-2 my-lg-0" 
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
      </Router>
    </div>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA