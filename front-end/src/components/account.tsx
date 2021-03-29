import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Gear } from '../assets/gear'
import { useData } from '../services/data.service'
import { Position } from './buttons/trade-button'
import { IPlayer, Player } from './player'
import { Signup } from './signup'
import { ITeam } from './team'
import { UserProps } from './user'
let axios = require('axios')

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
  const [positions, setPositions] = useState<AccountPosition[]>()
  const [stockValue, setStockValue] = useState<number>(0)

  const users = useData('GET', 'users')
  const user = !users.loading && users.data.find((user:any) => user.signedIn === true)
  
  useEffect(() => {
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
    user && fetchTrades()
  },[user])
  
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
            <Gear onClick={() => {
              setShowSettings(!showSettings)
              setChangepw(false)
              setDisabled(false)
            }}/>
            {showSettings
             && <AccountButtons className={'animate__animated animate__fadeInDown'}>
                  <button 
                    disabled={disabled} 
                    className="btn btn-outline-info m-3" 
                    onClick={()=> {
                      setChangepw(true)
                      setDisabled(true)
                    }}>Change Password</button>
                  <button 
                    className="btn btn-outline-info m-3"
                    disabled={disabled}
                    onClick={deleteAccount}>Delete Account</button>
                  <button
                    disabled={disabled}
                    className="btn btn-outline-info m-3"
                    onClick={logout}>Logout</button>
                  {changepw 
                    ? <div className={'animate__animated animate__fadeIn'}>  
                        <input
                          className="form-control"
                          type="password" 
                          placeholder="New Password"
                          onChange={e => setNewPassword(e.target.value)}/>
                        <button
                          className="btn btn-outline-info m-3" 
                          type="button" 
                          onClick={changePassword}>Confirm</button>
                        <button
                          className="btn btn-outline-info m-3"
                          type="button" 
                          onClick={() => {
                            setChangepw(false)
                            setDisabled(false)
                          }}>Cancel</button>
                      </div>
                    : ''}
               </AccountButtons>}
            <AccountInfo>
              <p>
                <span className={'px-5'}>{`Username: ${user.username}`}</span>
                <span className={'px-5'}>{`Cash: $${Number(user.cash).toFixed(2)}`}</span>
                <span className={'px-5'}>{`Equity: $${calculating ? '{..}' : Number(stockValue).toFixed(2)}`}</span>
              </p>
              <h2>Portfilio:</h2>
              <Divider className="border-light" />
              <div className="d-flex justify-content-center flex-wrap">
                {positions && positions.map((position:AccountPosition) =>
                  <Player
                    key={position.player._id}
                    _id={position.player._id} 
                    height={position.player.height} 
                    weight={position.player.weight} 
                    position={position.player.position} 
                    price={position.player.price} 
                    team={position.player.team}
                    name={position.player.name}
                    teamName={position.team.full_name}
                    image={position.player.image && position.player.image}
                    value={`(${position.quantity})
                      $${(position.player.price[Object.keys(position.player.price)[Object.keys(position.player.price).length - 1]] * position.quantity).toFixed(2)}`}/>)}
              </div>
            </AccountInfo>
          </>
        : <Signup />
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
  border-bottom: solid 3px;
  margin: 20px;
}`
