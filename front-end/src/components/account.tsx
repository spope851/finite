import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Gear } from '../assets/gear';
import { Position } from './buttons/trade-button';
import { IPlayer, Player } from './player';
import { ITeam } from './team';
import { UserProps } from './user';

let axios = require('axios');

const USERS_API =  `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`
const TRADES_API =  `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/trades`
const POSITIONS_API =  `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/positions`

export interface TradeProps {
  _id:string
  user_id:string
  buy:boolean
  timestamp:Date
  player_id:string
  quantity:number
  price:number
}

export interface AccountPosition extends Position {
  all_trades:TradeProps[]
  player:IPlayer
  team:ITeam
}

export const Account:React.FC = () => {

  const [changepw, setChangepw] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [calculating, setCalculating] = useState<boolean>(true)
  const [newPassword, setNewPassword] = useState<string>()
  const [user, setUser] = useState<UserProps>()
  const [positions, setPositions] = useState<AccountPosition[]>()
  const [stockValue, setStockValue] = useState<number>(0)

  useEffect(() => {
    fetchUser()
  },[])
  
  useEffect(() => {
    user && fetchTrades()
  },[user])
  
  const fetchUser = async () => {
    const data = await fetch(USERS_API)
    const jsnData = await data.json()
    jsnData.forEach((user:UserProps) => {
      if (user.signedIn) {
        setUser(user)
      }
    })
  }
  
  const fetchTrades = async () => {
    const data = await axios.get(TRADES_API, {
      headers: {
        "function":"userValue",
        "user_id":user && user._id
      }
    })
    data.data[0] && 
      setStockValue(data.data[0].stockValue)
      setCalculating(false)
    const positions = await axios.get(POSITIONS_API, {
      headers: {
        "user_id":user && user._id
      }
    })
    positions.data[0] && setPositions(positions.data)
  }
  
  const logout = () => {
    axios.put(USERS_API, {
      "function":"logout"
    })
    document.location.reload()
  }

  const deleteAccount = () => {
    let ans = window.confirm("Are you sure?")
    if(ans){
      axios.delete(USERS_API, { "data": {"_id": user && user._id}})
      document.location.reload()
    }
  }
      
  const changePassword = () => {
    axios.put(USERS_API, {
      "function":"changePassword",
      "_id": user && user._id,
      "newPassword": newPassword
    })
    let ans = window.confirm('Password changed successfully!')
    if (ans) {document.location.reload()}
  }

  return (
    <>
      {user
        ? <>  
            <Gear onClick={() => setShowSettings(!showSettings)}/>
            {showSettings
             && <AccountButtons>
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        <button 
                          disabled={disabled} 
                          className="nav-link" 
                          onClick={()=> {
                            setChangepw(true)
                            setDisabled(true)
                          }}>Change Password</button>
                      </td>
                      <td>
                        <button disabled={disabled} className="nav-link" onClick={deleteAccount}>Delete Account</button>
                      </td>
                      <td>
                        <button disabled={disabled} className="nav-link" onClick={logout}>Logout</button>
                      </td>
                    </tr>
                  </tbody>  
                </table>
                {changepw 
                  ? <div>  
                      <input 
                        type="password" 
                        placeholder="New Password"
                        onChange={e => setNewPassword(e.target.value)}/>
                      <input 
                        type="submit" 
                        value="Confirm"
                        onClick={changePassword}/>
                      <input 
                        type="button" 
                        value="Cancel"
                        onClick={() => {
                          setChangepw(false)
                          setDisabled(false)
                        }}/>
                    </div>
                  : ''}
               </AccountButtons>}
            <AccountInfo>
              <p>
                <span className={'px-5'}>{`Username: ${user.username}`}</span>
                <span className={'px-5'}>{`Cash: $${Number(user.cash).toFixed(2)}`}</span>
                <span className={'px-5'}>{`Equity: $${calculating ? '{..}' : Number(stockValue).toFixed(2)}`}</span>
              </p>
              <h1>Portfilio:</h1>
              <Divider />
              <div className="row justify-content-around">
                {positions && positions.map((position:AccountPosition) =>
                  <div className={'mw-33 px-2'}>
                    <Player 
                      _id={position.player._id} 
                      height={position.player.height} 
                      weight={position.player.weight} 
                      position={position.player.position} 
                      price={position.player.price} 
                      team={position.player.team}
                      name={`${position.player.name} (${position.quantity})
                        $${(position.player.price[Object.keys(position.player.price)[Object.keys(position.player.price).length - 1]] * position.quantity).toFixed(2)}`} 
                      key={position.player._id}
                      teamName={position.team.full_name}
                      image={position.player.image && position.player.image}/>
                  </div>)}
              </div>
            </AccountInfo>
          </>
        : <a href={'/login'}>Login</a>
      }
    </>
  )
}

const AccountButtons = styled.div`
& {
  width: 550px;
  margin: auto;
}`

const AccountInfo = styled.div`
& {
  margin-top: 26px;
}`

const Divider = styled.div`
& {
  border-bottom: solid 1px #000;
  margin: 20px;
}`
