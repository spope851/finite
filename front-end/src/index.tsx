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
import { Timesheet } from './components/timesheet/timesheet'
import { PlayerRoutes } from './routes/player-routes'
import { useData } from './services/data.service'
import eclipse from './assets/Eclipse.gif'
import { PlayerSearch } from './components/player-search'
import { Home } from './components/home'
import { App } from './app'
import { Drawer } from '@material-ui/core'
import { MainNav } from './components/navs/main-nav'
import { DebtTable } from './components/debt-table'
import { DepositForm } from './components/deposit-form'
import { BankFab } from './components/buttons/bank-fab'
import styled from 'styled-components'
// import { PopulateUsers } from './components/buttons/populate-users-button'

export const FOOTHEIGHT = 75

const BankFabWrapper = styled.div`
&& {
  margin: 10px 0 0 10px
}`

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
        <BankFabWrapper>
          {user && <BankFab toggleDrawer={toggleDrawer}/>}
        </BankFabWrapper>
        {userCall.loading
          ? <img
              alt={'loading'}
              src={eclipse}
              height={50}
              style={{ marginLeft: "50px" }} />
          : user
            ? <>
                <Drawer className={""} anchor={'left'} open={drawerOpen} onClose={() => toggleDrawer()}>
                  <div className="d-flex flex-column justify-content-between h-100 p-3">
                    <p>{user._id.username}</p>
                    <p className="mb-auto">{`Cash: $${Number(user._id.cash).toFixed(2)}`}</p>
                    <DebtTable userId={user._id._id} />
                    <DepositForm userId={user._id._id} />
                  </div>
                </Drawer>
                <User user={user}/>
              </>
            : <Login />}
        <MainNav />
        <PlayerSearch />
      </FixedHeader>
      {/* <PopulateUsers /> */}
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
