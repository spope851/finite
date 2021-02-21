import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { UserProps } from '../user'

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

let axios = require('axios');

const USERS_API = process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`
const TRADES_API = process.env.REACT_APP_MONGO_TRADES || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/trades`
const POSITIONS_API = process.env.REACT_APP_MONGO_POSITIONS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/positions`

export const TradeButton:React.FC<OwnProps> = (props) => {
    const { price, quantity, buy, player } = props

    const [user, setActiveUser] = useState<UserProps>()
    const [position, setPosition] = useState<Position>()
    const [disableSell, setDisableSell] = useState<boolean>(true)

    const TRADE = price * quantity
    const UPDATED_QUANTITY = buy
        ? position && position.quantity + quantity
        : position && position.quantity - quantity

    useEffect(() => {
        fetchUser()
    },[])
  
    useEffect(() => {
      user && fetchPositions()
    },[user])
    
    const fetchUser = async () => {
        const data = await fetch(USERS_API)
        const jsnData = await data.json()
        jsnData.forEach((user:UserProps) => {
            if (user.signedIn) {
                setActiveUser(user)
            }
        })
    }
  
    const fetchPositions = async () => {
      const data = await axios.get(POSITIONS_API, {
        headers: {
          "user_id":user && user._id,
          "player_id":player.id
        }
      })
      data.data[0] && 
        setDisableSell(false)
        setPosition(data.data[0])
    }
  
    const storeTrade = () => {
        axios.post(TRADES_API,{
            "user_id": user && user._id,
            "buy": !!buy,
            "timestamp": new Date,
            "player_id": player.id,
            "quantity": quantity,
            "price": buy ? price : price * -1
        })
        axios.put(USERS_API, {
            "function":"updateStockValue",
            "_id": user && user._id,
            "tradeValue": buy ? TRADE : TRADE * -1
        })
        if (position) {
            if ( UPDATED_QUANTITY === 0 ) {
                axios.delete(POSITIONS_API, { "data": {"_id": position._id} })
            } else {
                axios.put(POSITIONS_API, { 
                    quantity: UPDATED_QUANTITY,
                    _id: position._id
                })
            }
        } else {
            axios.post(POSITIONS_API, {
                user_id: user && user._id,
                player_id: player.id,
                quantity: quantity
            })
        }
        document.location.reload()
    }

    const trade = () => {
        // props.onClick(true)
        alert(`${buy ? 'Bought' : 'Sold'} ${quantity} shares of ${player.name} at $${price.toFixed(2)} for $${(price * quantity).toFixed(2)}`)
        storeTrade()
    }
console.log(position);

    return (
        <StyledButton 
            onClick={e => trade()}
            disabled={!quantity || (user && 
                buy 
                    ? Number(user.cash) <= (price * quantity)
                    : disableSell || position && position.quantity < quantity)}>
            {buy ? 'Buy' : 'Sell'}
        </StyledButton>
    )
}

const StyledButton = styled.button`
&& {
    width: 55px;
}`
