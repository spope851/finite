import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { ChangingChevron } from '../assets/changing-chevron';
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
    image?:string
}

interface OwnProps extends IPlayer {
  teamName?:string
}

export const Player:React.FC<OwnProps> = ({ _id, name, height, weight, position, team, teamName, price, last_price, image }) => {
  
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

  const PRICE_CHANGE = last_price ? Math.abs(price - last_price).toFixed(2) : ''
  const DEFAULT_IMAGE = 'https://i.pinimg.com/474x/7e/00/1d/7e001dc786dcb43a48347d35543bbed9.jpg'
  
  return (
    <div  className={`card w-100 my-1
      ${last_price && price > last_price ? 'border-success' : 
        last_price && price < last_price ? 'border-danger' : ''}`}>
      <div className={`card-header pb-0`}>
        <img id={_id} height="100px" src={image ? image : DEFAULT_IMAGE}
           onError={() => document.getElementById(_id)?.setAttribute('src', DEFAULT_IMAGE) }/>
        <p>
          {name} 
          <span>
            <ChangingChevron onClick={() => toggleDetails()}/>
          </span>
        </p>
        {trade && tradePrice &&
            <BuySellForm>
              <TradeButton 
                buy
                price={tradePrice} 
                quantity={Number(quantity)}
                player={player}
              />
              <TradeButton 
                price={tradePrice} 
                quantity={Number(quantity)}
                player={player}
              />
              <br />
              <QuantityInput 
                type={"number"}
                onChange={e => setQuantity(e.target.value)}
                placeholder={'How many?'}
                min={1}/>
            </BuySellForm>}
      </div>
      <div className="card-body pt-3 pb-0">
        <Price onClick={e => toggleTrade(price)}>
          <span className={'price'}>{`$${price.toFixed(2)}`}</span>
          <span className={`
            ${last_price && price > last_price ? 'text-success' : 
              last_price && price < last_price ? 'text-danger' : ''}`}>
              {` ${last_price && price > last_price ? `(+$${PRICE_CHANGE})` : 
                    last_price && price < last_price ? `(-$${PRICE_CHANGE})` : ''}`}
          </span>
        </Price>
        {playerDetails && (
          <PlayerDetails 
            height={height && height}
            position={position && position} 
            weight={weight && weight}
            teamId={team} 
            teamName={teamName || ''}
            price={price}
            last_price={last_price && last_price}/>)}
      </div>
    </div>
  )
}

const QuantityInput = styled.input`
&& {
    width: 110px;
}`

const BuySellForm = styled.div`
&& {
    margin-bottom: 1rem;
}`

const Price = styled.p`
&& {
  :hover {
    cursor: pointer;
    span.price {
      text-shadow: 0 0 5px #00ff00;
    }
  }
}`
