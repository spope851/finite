import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { TradeButton } from './buttons/trade-button';
import { PlayerDetails } from './playerDetails'

export interface IPlayer {
    _id:string
    name:string
    height:string
    weight:number
    position:string
    team:number
    price:number
}

interface OwnProps extends IPlayer {
  teamName?:string
}

export const Player:React.FC<OwnProps> = (props) => {
  const { _id, name, height, weight, position, team, teamName, price } = props
  
  const [playerDetails, setDetails] = useState<boolean>(false)
  const [trade, setTrade] = useState<boolean>(false)
  const [tradePrice, setTradePrice] = useState<number>()
  const [quantity, setQuantity] = useState<string>('0')

  useEffect(() => {
    setTrade(playerDetails ? trade : false)
  },[playerDetails])

  const toggleDetails = () => {
    setDetails(!playerDetails)
  }

  const toggleTrade = (price:number) => {
    setTrade(!trade)
    setTradePrice(price)
  }

  const player = {
    id: _id,
    name: name
  }

  return (
    <div  className="card col-4">
      <div className="card-header">
        <p onClick={e => toggleDetails()}>{name}</p>
        {trade && tradePrice &&
            <>
              <TradeButton 
                buy
                price={tradePrice} 
                quantity={Number(quantity)}
                player={player}
                // onClick={() => setShowQuantity(true)}
              />
              <TradeButton 
                price={tradePrice} 
                quantity={Number(quantity)}
                player={player}
                // onClick={() => setShowQuantity(true)}
              />
              <br />
              <QuantityInput 
                type={"number"}
                onChange={e => setQuantity(e.target.value)}
                placeholder={'How many?'}
                min={1}/>
            </>}
      </div>
      <div className="card-body">
        {playerDetails && (
          <PlayerDetails 
            trade={toggleTrade} 
            height={height && height}
            position={position} 
            weight={weight && weight}
            teamId={team} 
            teamName={teamName || ''}
            price={price}/>)}
      </div>
    </div>
  )
}

const QuantityInput = styled.input`
&& {
    width: 110px;
}`
