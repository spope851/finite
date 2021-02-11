import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GearIcon } from '../assets/gear';
import { Position } from './buttons/trade-button';
import { Player } from './player';
import { UserProps } from './user';

let axios = require('axios');

const USERS_API =  `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`
const TRADES_API =  `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/trades`
const PLAYERS_API =  `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`
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

export interface Protfolio extends Position {
  all_trades:TradeProps[]
  player:any
}

export const Account:React.FC = () => {

  const [changepw, setChangepw] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [calculating, setCalculating] = useState<boolean>(true)
  const [newPassword, setNewPassword] = useState<string>()
  const [user, setUser] = useState<UserProps>()
  const [positions, setPositions] = useState<Protfolio[]>()
  const [stockValue, setStockValue] = useState<number>(0)

  useEffect(() => {
    fetchUser()
  },[])
  
  useEffect(() => {
    fetchTrades()
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
  
  const fetchPlayer = async (id:string) => {
    const data = await axios.get(PLAYERS_API, {
      headers: {
        "id":id
      }
    })
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

console.log(positions);

  return (
    <>
      {user
        ? <>  
            {showSettings
             ? <AccountButtons>
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
                      <td>
                        <GearIcon onClick={() => setShowSettings(false)}/>
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
               </AccountButtons>
             : <GearIcon onClick={() => setShowSettings(true)}/>}
            <>
              <p>{`Username: ${user.username}`}</p>
              <p>{`Cash: $${user.cash}`}</p>
              <p>{`Player Stock: $${calculating ? '{..}' : stockValue}`}</p>
              <h1>Portfilio:</h1>
              <div className="row">
                {positions && positions.map((position:Protfolio) =>
                  <Player 
                    id={position.player[0]._id} 
                    details={position.player[0].data[0]} 
                    name={`${position.player[0].data[0].first_name} ${position.player[0].data[0].last_name} (${position.quantity})`} 
                    key={position.player[0]._id}/>
                )}
              </div>
            </>
          </>
        : <a href={'/login'}>Login</a>
      }
    </>
  )
}

const AccountButtons = styled.div`
& {
  width: 550px;
}`
