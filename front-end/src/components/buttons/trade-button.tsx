import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useData } from '../../services/data.service'
import { Endpoints } from '../../variables/api.variables'
import { UserProps } from '../user'
import { Modal } from '../utils/modal'
let axios = require('axios')

interface Player {
    id:string
    name:string
}

export interface Position {
    _id:string
    user_id:string
    player_id:string
    quantity:number
}

interface OwnProps {
    price:number
    quantity:number
    player:Player
    buy?:boolean
}

export const TradeButton:React.FC<OwnProps> = (props) => {
    const { price, quantity, buy, player } = props

    const [position, setPosition] = useState<Position>()
    const [disableSell, setDisableSell] = useState<boolean>(true)
    const [open, setOpen] = useState<boolean>(false)
  
    const handleClose = () => {
      setOpen(false)
      storeTrade()
    }

    const users = useData('GET', 'users')
    const user = !users.loading && users.data.find((user:UserProps) => user.signedIn === true)

    const TRADE = price * quantity
    const UPDATED_QUANTITY = buy
        ? position && position.quantity + quantity
        : position && position.quantity - quantity
  
    useEffect(() => {
        const fetchPositions = async () => {
          const data = await axios.get(Endpoints.POSITIONS, {
            headers: {
              "user_id":user && user._id,
              "player_id":player.id
            }
          })
          data.data[0] && 
            setDisableSell(false)
            setPosition(data.data[0])
        }
        user && fetchPositions()
    },[player.id, user])
  
    const storeTrade = () => {
        axios.post(Endpoints.TRADES,{
            "user_id": user && user._id,
            "buy": !!buy,
            "timestamp": new Date(),
            "player_id": player.id,
            "quantity": quantity,
            "price": buy ? price : price * -1
        })
        axios.put(Endpoints.USERS, {
            "function":"updateCash",
            "_id": user && user._id,
            "tradeValue": buy ? TRADE : TRADE * -1
        })
        axios.put(Endpoints.PLAYERS, {
            "_id": player.id,
            "quantity": Math.abs(quantity)
        })
        if (position) {
            if ( UPDATED_QUANTITY === 0 ) {
                axios.delete(Endpoints.POSITIONS, { "data": {"_id": position._id} })
            } else {
                axios.put(Endpoints.POSITIONS, { 
                    quantity: UPDATED_QUANTITY,
                    _id: position._id
                })
            }
        } else {
            axios.post(Endpoints.POSITIONS, {
                user_id: user && user._id,
                player_id: player.id,
                quantity: quantity
            })
        }
        document.location.reload()
    }

    const disabled = !quantity || (user && 
        buy 
            ? Number(user.cash) <= (price * quantity)
            : disableSell || (position && position.quantity < quantity))

    const message = <>
        <h2 id="transition-modal-title">{`${buy ? 'Purchase' : 'Sale'} Order: ${player.name}`}</h2>
        <p id="transition-modal-description">{`${quantity} Shares`}</p>
        <p id="transition-modal-description">{`Price: $${price.toFixed(2)}`}</p>
        <p id="transition-modal-description">{`Total: $${(price * quantity).toFixed(2)}`}</p>
    </>

    return (
        <>
            <StyledButton
                className={`btn btn${disabled ? " disabled" : "-outline-secondary"} btn-sm m-1 mb-2`}
                onClick={e => setOpen(true)}
                disabled={disabled}>
                {buy ? 'Buy' : 'Sell'}
            </StyledButton>
            <Modal open={open} handleClose={handleClose} message={message} />
        </>
    )
}

const StyledButton = styled.button`
&& {
    width: 55px;
}`
