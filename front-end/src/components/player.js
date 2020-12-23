import * as React from 'react';
import { useEffect } from 'react';
import PlayerDetails from './playerDetails'

class Player extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      details: false,
      trade: false,
      tradePrice: null
    }
  }
  render() {

    // useEffect(() => {
    //   this.setState({trade: this.state.details ? this.state.trade : false})
    // },[this.state.details])

    const toggleDetails = () => {
      this.setState({
        details: !this.state.details
      })
    }

    const toggleTrade = (price) => {
      this.setState({trade: !this.state.trade})
      this.setState({tradePrice: price})
    }

    return (
      <div  className="card col-4">
        <div className="card-header">
          <p onClick={toggleDetails()}>{this.props.name}</p>
          {this.state.trade && <><BuyButton/><SellButton/></>}
        </div>
        <div className="card-body">
          {this.state.details && <PlayerDetails trade={toggleTrade} data={this.props.details}/>}
        </div>
      </div>
    );
  }
}

class BuyButton extends React.Component{
  render() {
    const buy = () => {
      alert('bought')
    }
    return (
      <button
        onClick={e => buy()}
      >
        Buy
      </button>
    )
  }
}

class SellButton extends React.Component{
  render() {
    const sell = () => {
      alert('sold')
    }
    return (
      <button
        onClick={e => sell()}
      >
        Sell
      </button>
    )
  }
}

export default Player;