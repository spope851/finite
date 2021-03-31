import React, { BaseSyntheticEvent, FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { onThatTab } from '../functions/on-that-tab'
import { IPlayer } from './player'
import { storeUsage } from '../functions/store-player-usage'

const DropDown = styled.ul`
&& {
  position: absolute;
	box-sizing: border-box;
	top: 100%;
  list-style-type: none;
  width: 280px;
}`

const InputWrapper = styled.div`
&& {
  position: relative;
}`

const NameWrapper = styled.span`
&& {
  align-self: center;
  text-align: left;
  float: left;
  margin-right: auto;
}`

const Player = styled.div`
&& {
  justify-content: flex-end;
  padding: 8px;
  height: 86px;
  display: flex;
  :hover {
    background-color: rgba(170,170,170,0.2);
  }
}`

const FormWrapper = styled.form`
&& {
  input:focus + .dropdown {
    display: block;
  }
}`

export const PlayerSearch: React.FC = () => {
  let history = useHistory()
  const [term, setTerm] = useState<string>()
  const [hideDropdown, setHideDropdown] = useState<boolean>()
  const [players, setPlayers] = useState<IPlayer[]>([])
  
  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`, {
        headers: {term: term || ''}
      })
      
      const jsnData = await data.data
      setPlayers(jsnData)
    }
    fetchPlayers()
  },[term])

  const search = (e: BaseSyntheticEvent) => {
    e.preventDefault()
    history.replace(`/app?term=${e.target[0].value}`)
  }

  const change = (e: FormEvent<HTMLInputElement>) => {
    setHideDropdown(false)
    if (onThatTab('/players', true)) history.push(`?term=${e.currentTarget.value}`)
    else setTerm(e.currentTarget.value)
  }

  const blur = (e: FormEvent<HTMLInputElement>) => {
    console.log(e);
    
    if (onThatTab('/players', true)) history.push(`?term=${e.currentTarget.value}`)
    else setTerm(e.currentTarget.value)
  }

  return (
    <FormWrapper 
      className="form-inline my-2 my-lg-0 mr-2 animate__animated animate__fadeInDownBig" 
      onSubmit={search}>
      <InputWrapper>
        <input 
          className="form-control mr-sm-2" 
          type="search" 
          placeholder="Search" 
          aria-label="Search"
          onChange={change}
          onBlur={blur}/>
      </InputWrapper>
      {!onThatTab('/players', true) && term && !hideDropdown && players &&
        <DropDown className={`p-0 mt-2 bg-white dropdown border rounded animate__animated animate__rotateInUpLeft`}>
          {players.length > 0
          ? players.slice(0,5).map((player: IPlayer) => {
              return (
                <li key={player._id}>
                  <a
                    // style={{ pointerEvents: 'none' }}
                    href={`/players/${player._id}`} 
                    className="text-dark"
                    onClick={() => storeUsage(player._id, player.name)}>
                      <Player className={'animate__animated animate__fadeIn'}>
                        <NameWrapper className="text-muted">{player.name}</NameWrapper>
                        <img alt={player.name} height={70} src={player.image} />
                      </Player>
                  </a>
                </li>
              )
            })
          : <Player className={'animate__animated animate__fadeIn'}>
              <NameWrapper>No matching players :/...</NameWrapper>
            </Player>
          }
        </DropDown>
      }
      <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
    </FormWrapper>
  )
}