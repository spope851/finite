import React from 'react';
import logo from './logo.svg';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Account from './components/account';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Login from './components/login';
import User from './components/user'
import stats from './scrape/playerStats.json'
import Team from './components/team';

let teams = [];
Object.keys(stats).forEach(function(el){
  if(teams.indexOf(stats[el].data[0].team.id)===-1){
    teams.push(stats[el].data[0].team.id)
  }
})

export const Welcome = () => {
  return (
        <>
          <br />
          <br />
          <br />
          <h1>Welcome To Finite</h1>
        </>
  )
}
  export const Index = () => {
    return (
        <>
          <header className="App-header">
            <br  /><User/>
            <div className="navbar">
              <a className="nav-link" href="/account">Account</a>
              <a className="nav-link" href="/app">App</a>
            </div>
            <img src={logo} className="App-logo" alt="logo" />
          </header>
          {window.location.pathname === "/"
            ? <Welcome/>
            : ''}
        </>
    )
  
}

ReactDOM.render(
  <React.StrictMode>
    <div className="App">
      <Router>
          <Route path="/" component={Index} />
          <Route path="/login" component={Login} />
          <Route path="/account" component={Account} />
          <Route path="/app" component={App} />
          <Switch>
            {teams.map((el) =>
              <Route key={el} path={"/teams/"+el} component={Team} />
            )}
          </Switch>
      </Router>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA