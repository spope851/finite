import React, { useState } from 'react'
import logo from './logo.svg'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import { Account } from './components/account'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation
} from "react-router-dom";
import { User, UserProps } from './components/user'
import { useEffect } from 'react'
import { LoginSignup } from './pages/login-signup'
import { Welcome } from './components/welcome'
import { TeamRoutes } from './routes/team-routes'

export const Index:React.FC = () => {
  
  let location = useLocation()

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
    
  return (
      <>
        <header className="App-header">
          <User 
            user={activeUser} 
            noUsers={noUsers}/>
          <div className="navbar">
            <a className="nav-link" href="/account">Account</a>
            <a className="nav-link" href="/app">App</a>
          </div>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
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
          <Route path="/login" component={LoginSignup} />
          <Route path="/account" component={Account} />
          <Route path="/app" component={App} />
          <Switch>
              <Route path={"/teams/:id"} component={TeamRoutes} />
          </Switch>
      </Router>
    </div>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA