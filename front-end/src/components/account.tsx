import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Gear } from '../assets/gear'
import { useData } from '../services/data.service'
import { Endpoints } from '../variables/api.variables'
import { Position } from './buttons/trade-button'
import { IPlayer, Player } from './player'
import { Signup } from './signup'
import { ITeam } from './team'
import { ActiveUserProps } from './user'
import { Modal } from './utils/modal'

let axios = require('axios')

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
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [openCPWModal, setOpenCPWModal] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>()
  const [positions, setPositions] = useState<AccountPosition[]>()

  const userCall = useData('GET', 'user')
  const user:ActiveUserProps = !userCall.loading && userCall.data[0]
  
  useEffect(() => {
    const fetchTrades = async () => {
      const positions = await axios.get(Endpoints.POSITIONS, {
        headers: {
          "user_id":user && user._id._id
        }
      })
      positions.data[0] && setPositions(positions.data)
    }
    user && fetchTrades()
  },[user])
  
  const logout = () => {
    axios.put(Endpoints.USERS, {
      "function":"logout"
    })
    document.location.reload()
  }

  const deleteAccount = () => {
    axios.delete(Endpoints.USERS, { "data": {"_id": user && user._id._id}})
    document.location.reload()
  }
      
  const changePassword = () => {
    axios.put(Endpoints.USERS, {
      "function":"changePassword",
      "_id": user && user._id._id,
      "newPassword": newPassword
    })
    document.location.reload()
  }

  return (
    <>
      {user
        ? <>  
            <table className="table table-borderless text-muted border-0">
              <tbody>
                <tr style={{ borderTop: "hidden" }}>
                  <th>{`Username: ${user._id.username}`}</th>
                  <th>{`Cash: $${Number(user._id.cash).toFixed(2)}`}</th>
                  <th>{`Equity: $${Number(user.equity).toFixed(2)}`}</th>
                  <th>
                    <Gear 
                      onClick={() => {
                        setShowSettings(!showSettings)
                        setChangepw(false)
                        setDisabled(false)
                      }}
                      />
                  </th>
                </tr>
              </tbody>
            </table>
            {showSettings && 
              <AccountButtons className={'animate__animated animate__fadeInDown'}>
                  <button 
                    disabled={disabled} 
                    className="btn btn-outline-info mx-3 mb-3" 
                    onClick={()=> {
                      setChangepw(true)
                      setDisabled(true)
                    }}>Change Password</button>
                  <Modal
                    open={openCPWModal}
                    message={
                      <>
                        <h2>Is your new password secure?</h2>
                        <Button onClick={changePassword}>Confirm</Button>
                        <Button onClick={() => setOpenCPWModal(false)}>Cancel</Button>
                      </>} />
                  <button 
                    className="btn btn-outline-info mx-3 mb-3"
                    disabled={disabled}
                    onClick={() => setOpenDeleteModal(true)}>Delete Account</button>
                  <Modal
                    open={openDeleteModal}
                    message={
                      <>
                        <h2>Is your new password secure?</h2>
                        <Button onClick={deleteAccount}>Confirm</Button>
                        <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
                      </>} />
                  <button
                    disabled={disabled}
                    className="btn btn-outline-info mx-3 mb-3"
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
                          disabled={!newPassword}
                          onClick={() => setOpenCPWModal(true)}>Confirm</button>
                        <button
                          className="btn btn-outline-info m-3"
                          type="button" 
                          onClick={() => {
                            setChangepw(false)
                            setDisabled(false)
                          }}>Cancel</button>
                      </div>
                    : ''}
              </AccountButtons>
            }
            <h2 className="h2 text-muted">Portfilio</h2>
            <div className="row mx-5 pt-1 bg-white justify-content-center border-top">
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
                    $${(position.player.price[Object.keys(position.player.price)[Object.keys(position.player.price).length - 1]] * position.quantity).toFixed(2)}`}
                  volume={position.player.volume}/>)}
            </div>
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
