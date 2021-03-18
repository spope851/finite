import * as React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import { ChangingChevron } from '../assets/changing-chevron'
import { TradeButton } from './buttons/trade-button'
import { PlayerDetails } from './playerDetails'

export interface IPlayer {
    _id:string
    name:string
    height?:string
    weight?:number
    position?:string
    team:number
    price:{[key:string]: number}
    image?:string
    value?:string
}

interface OwnProps extends IPlayer {
  teamName?:string
}

export const Player:React.FC<OwnProps> = ({ _id, name, height, weight, position, team, teamName, price, image, value }) => {
  
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
  
  const WEEKS =  Object.keys(price)
  const WEEK = WEEKS[WEEKS.length - 1]
  const PREV_WEEK = WEEKS[WEEKS.length - 2]

  const PRICE_CHANGE = Math.abs(price[WEEK] - price[PREV_WEEK]).toFixed(2)
  const DEFAULT_IMAGE = 'https://i.pinimg.com/474x/7e/00/1d/7e001dc786dcb43a48347d35543bbed9.jpg'
  
  return (
    <div  className={`card w-100 my-1
      ${price[WEEK] > price[PREV_WEEK] ? 'border-success' : 
        price[WEEK] < price[PREV_WEEK] ? 'border-danger' : ''}`}>
      <div className={`card-header pb-0`}>
        <p>{value}</p>
        <img id={_id} height="100px" src={image ? image : DEFAULT_IMAGE}
           onError={() => document.getElementById(_id)?.setAttribute('src', DEFAULT_IMAGE) } alt={name} />
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
                onChange={(e: { target: { value: string } }) => setQuantity(e.target.value)}
                placeholder={'How many?'}
                min={1}/>
            </BuySellForm>}
      </div>
      <div className="card-body pt-3 pb-0">
        <Price onClick={() => toggleTrade(price[WEEK.toString()])}>
          <span className={'price'}>{`$${price[WEEK.toString()].toFixed(2)}`}</span>
          <span className={`
            ${price[WEEK] > price[PREV_WEEK] ? 'text-success' : 
              price[WEEK] < price[PREV_WEEK] ? 'text-danger' : ''}`}>
              {` ${price[WEEK] > price[PREV_WEEK] ? `(+$${PRICE_CHANGE})` : 
                   price[WEEK] < price[PREV_WEEK] ? `(-$${PRICE_CHANGE})` : ''}`}
          </span>
        </Price>
        {playerDetails && (
          <PlayerDetails 
            height={height && height}
            position={position && position} 
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
