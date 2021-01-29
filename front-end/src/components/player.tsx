import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { PlayerDetails } from './playerDetails'

interface Idetails {
  
}

interface OwnProps {
  name?:string
  details?:any
}

export const Player:React.FC<OwnProps> = (props) => {
  
  const [details, setDetails] = useState<boolean>(false)
  const [trade, setTrade] = useState<boolean>(false)
  const [tradePrice, setTradePrice] = useState<number>()

  useEffect(() => {
    setTrade(details ? trade : false)
  },[details])

  const toggleDetails = () => {
    setDetails(!details)
  }

  const toggleTrade = (price:number) => {
    setTrade(!trade)
    setTradePrice(price)
  }

  return (
    <div  className="card col-4">
      <div className="card-header">
        <p onClick={e => toggleDetails()}>{props.name}</p>
        {trade && <><BuyButton/><SellButton/></>}
      </div>
      <div className="card-body">
        {details && <PlayerDetails trade={toggleTrade} data={props.details}/>}
      </div>
    </div>
  )
}

class BuyButton extends React.Component{
  render() {
    const buy = () => { alert('bought') }
    return (<button onClick={e => buy()}>Buy</button>)
  }
}

class SellButton extends React.Component{
  render() {
    const sell = () => { alert('sold') }
    return (<button onClick={e => sell()}>Sell</button>)
  }
}
