import React, { Component } from 'react';
import './App.css';
import stats from './scrape/playerStats.json'
import Player from './components/player'
import get from './services/get.service'

let axios = require('axios')

const MONGO_EXPRESS_API = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`

const MONGO_DB = {
  "db":"player_account",
  "table":"players"
}

const populatePlayers = () => {
  axios.put(MONGO_EXPRESS_API, 
  {
    "function":"populate",
    ...MONGO_DB,
    "records":stats
  })
  document.location.reload()
}

class App extends Component {
  
  constructor(props) {
    super(props); 
      this.state = {
      players: []
    };
  }
  
  componentDidMount() {
    get('players')
    .then(res => this.setState({ players: res }))
    .catch(err => console.log(err));
  }
  
  render() {
  console.log(this.state.players);
    return (
      <div className="card col-12">
        <div className="card-header">All Players</div>
          <div className="card-body">
            {this.state.players.length
             ? <div className="row">
                {this.state.players.map((el, i) =>
                <Player details={el.data[0]} name={el.data[0].first_name+' '+el.data[0].last_name} key={i}/>)}
               </div>
             : <button onClick={populatePlayers}>No players in DB. Click here to add some for testing</button>}
        </div>
      </div>
    );
  }
}

export default App;