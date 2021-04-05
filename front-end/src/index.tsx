import React, { useState } from 'react'
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
import { styled } from '@material-ui/core/styles';
// import { populateUsers } from './functions/populate-users'
import { Drawer, Fab } from '@material-ui/core';
import AccountBalanceRounded from '@material-ui/icons/AccountBalanceRounded';

const BankFab = styled(Fab)({
  background: 'linear-gradient(45deg, green 30%, green 90%)',
  border: 0,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  margin: '10px 0 0 10px'
})

export const FOOTHEIGHT = 75

export const Index:React.FC = () => {
  const userCall = useData('GET', 'user')
  const user:ActiveUserProps = !userCall.loading && userCall.data[0]
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }
  
  return (
    <>
      <FixedHeader className={`nav-tabs d-flex py-0 ${onThatTab("/", true) && "mb-2"} bg-light`}>
        <BankFab
          size="small"
          color="secondary"
          onClick={() => toggleDrawer()}>
          <AccountBalanceRounded />
        </BankFab>
        <Drawer anchor={'left'} open={drawerOpen} onClose={() => toggleDrawer()}>
          <div>hello world</div>
        </Drawer>
        {userCall.loading
          ? <img
              alt={'loading'}
              src={eclipse}
              height={50}
              style={{ marginLeft: "50px" }} />
          : user
            ? <User user={user}/>
            : <Login />}
        <ul className="nav align-self-end mr-auto animate__animated animate__fadeInDownBig">
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