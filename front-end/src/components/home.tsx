import React, { useEffect, useState } from 'react'
import { useData } from '../services/data.service'
import infinity from '../assets/Infinity.gif'
import { IPlayer, Player } from './player'
let axios = require('axios')

const MONGO_EXPRESS_API = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`
// const MONGO_EXPRESS_API_TEAMS = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/teams`

export const Home:React.FC = () => {
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [loading, setLoading] = useState(true)
  
  const teams = useData('GET', 'teams').data
  
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await axios.get(MONGO_EXPRESS_API, { headers: { sort: 'volume', limit: 5 } })
        setPlayers(data.data)
      } catch (error) {
        console.warn(error)
      } finally {
        setLoading(false)
      }
      
    }
    fetchPlayers()
  }, [])

  return (
    <>
      {loading
      ? <img
          alt={'loading'}
          src={infinity} />
      : <>
          <div id="carouselExampleCaptions" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
              <li data-target="#carouselExampleCaptions" data-slide-to="0" className="active"></li>
              <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
              <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
            </ol>
            <div className="carousel-inner">
              <div className="carousel-item">
                <img width={300} src={players[0].image} className="d-block w-100" alt="..." />
                <div className="carousel-caption d-none d-md-block">
                  <h5>First slide label</h5>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </div>
              </div>
              <div className="carousel-item active">
                <img width={300} src={players[1].image} className="d-block w-100" alt="..." />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Second slide label</h5>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img width={300} src={players[2].image} className="d-block w-100" alt="..." />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </div>
              </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
          <div className="row mx-5 bg-white justify-content-center border-top">
            {players.map((player:IPlayer) =>
                  <Player
                    key={player._id}
                    _id={player._id} 
                    height={player.height && player.height}
                    weight={player.weight && player.weight}
                    position={player.position && player.position}
                    team={player.team}
                    price={player.price}
                    teamName={(teams && teams[player.team - 1].full_name)}
                    name={player.name} 
                    image={player.image && player.image}
                    volume={player.volume}/>)}
            
          </div>
        </>}
    </>
  )
}