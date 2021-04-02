import React, { useEffect, useState } from 'react'
import { useData } from '../services/data.service'
import infinity from '../assets/Infinity.gif'
import { IPlayer, Player } from './player'
let axios = require('axios')

const MONGO_EXPRESS_API = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`

export const Home:React.FC = () => {
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [news, setNews] = useState<any>()
  const [loading, setLoading] = useState(true)
  
  const teams = useData('GET', 'teams').data
  
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await axios.get(MONGO_EXPRESS_API, { headers: { sort: 'volume', limit: 5 } })
        setPlayers(data.data)
        const news = await axios.get("https://newsapi.org/v2/everything?q=nba&from=2021-04-01&sortBy=publishedAt&apiKey=2d8047d572db474c8c4018db768206a1")
        setNews(news.data.articles)
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
              <li data-target="#carouselExampleCaptions" data-slide-to="0"></li>
              <li data-target="#carouselExampleCaptions" data-slide-to="1" className="active"></li>
              <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
            </ol>
            <div className="carousel-inner">
              {news && news.slice(0, 3).map((article:any, idx:number) => {
                return (
                  <div className={`carousel-item ${ idx === 1 && "active"}`}>
                    <img src={article.urlToImage} className="d-block w-100" alt="..." />
                    <div className="carousel-caption d-none d-md-block">
                      <a href={article.url} >
                        <h5>{article.title}</h5>
                        <p>{article.description}</p>
                      </a>
                      <p className="">{article.author && `© ${article.author.split(',')[0]}`}</p>
                    </div>
                  </div>                  
                )
              })}
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
          <h5 className="h5 text-muted pt-2 mb-0">Trending Players</h5>
          <div className="row mx-5 bg-white justify-content-center">
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