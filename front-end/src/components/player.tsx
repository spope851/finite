import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { TradeButton } from './buttons/trade-button';
import { PlayerDetails } from './playerDetails'

interface Idetails {
  
}

interface OwnProps {
  id:string
  name:string
  details?:any
}

export const Player:React.FC<OwnProps> = (props) => {
  const { id, name, details } = props
  
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
    id: id,
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
        {playerDetails && <PlayerDetails trade={toggleTrade} data={details}/>}
      </div>
    </div>
  )
}

const QuantityInput = styled.input`
&& {
    width: 110px;
}`
