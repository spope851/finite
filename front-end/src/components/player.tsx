import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { TradeButton } from './buttons/trade-button';
import { PlayerDetails } from './playerDetails'

export interface IPlayer {
    _id:string
    name:string
    height?:string
    weight?:number
    position?:string
    team:number
    price:number
    last_price?:number
}

interface OwnProps extends IPlayer {
  teamName?:string
}

export const Player:React.FC<OwnProps> = ({ _id, name, height, weight, position, team, teamName, price, last_price }) => {
  
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

  const PRICE_CHANGE = last_price ? (price - last_price).toFixed(2) : ''

  return (
    <div className={'col-sm-4'}>
      <div  className={`card w-100 my-1
        ${last_price && price > last_price ? 'border-success' : 
          last_price && price < last_price ? 'border-danger' : ''}`}>
        <div onClick={() => toggleDetails()}
          className={`card-header`}>
          <p>{name} 
            <span className={`
              ${last_price && price > last_price ? 'text-success' : 
                last_price && price < last_price ? 'text-danger' : ''}`}>
                {` ${last_price && price > last_price ? `(+$${PRICE_CHANGE})` : 
                     last_price && price < last_price ? `(-$${PRICE_CHANGE})` : ''}`}
            </span>
          </p>
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
              position={position && position} 
              weight={weight && weight}
              teamId={team} 
              teamName={teamName || ''}
              price={price}
              last_price={last_price && last_price}/>)}
        </div>
      </div>
    </div>
  )
}

const QuantityInput = styled.input`
&& {
    width: 110px;
}`
