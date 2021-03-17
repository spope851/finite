import React, { useState } from 'react'
import styled from 'styled-components'
import data from './timesheet.json'
const axios = require('axios')

export interface clock {
  in:string
  out?:string | null
  accomplished?:string | null
}

const Goal = styled.div`
&& {
  width: 175px;
}`

const GoalTable = styled.table`
&& {
  width: 500px;
}`

const TimeTable = styled.div`
&& {
  display: block;
  position: relative;
  max-height: 650px;
  overflow: auto;
}`

export const Timesheet: React.FC<clock[]> = () => {
  const [accomplished, setAccomplished] = useState<string>()
  const [goal, setGoal] = useState<number>(1)

  const clockIn = () => {
    const clock_in = { in: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) }
    axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/time`, {clock_in})
  }
  
  const clockOut = () => {
    const clock_out = {
      out: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
      accomplished: accomplished || ''
    }
    axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/time`, {clock_out})
  }

  const duration = (timeIn: string, timeOut: string) => {
    return ((new Date(timeOut).getUTCHours() - new Date(timeIn).getUTCHours()) + ((new Date(timeOut).getUTCMinutes() - new Date(timeIn).getUTCMinutes())/60)).toFixed(2)
  }

  let TIME_THIS_WEEK: number = 0
  let TIME_THIS_WEEK_END: number = 0

  const TODAY = new Date()
  const SUNDAY = new Date(new Date().setDate(TODAY.getDate() - TODAY.getDay()))

  data.forEach((time: clock) => {
    const date = new Date(time.out || '')
    const day = date.getDay()
    if (time.out && new Date(time.out) > SUNDAY) {
      if (day > 0 && day < 6) {
        TIME_THIS_WEEK += Number(duration(time.in, time.out))
      } else {
        TIME_THIS_WEEK_END += Number(duration(time.in, time.out))
      }
    }
  })

  return (
    <>
      <div className="d-flex align-items-center justify-content-center p-3">
        <Goal className="input-group m-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Goal (hours)</span>
          </div>
          <input 
            className="form-control"
            type="number"
            defaultValue={1}
            style={{width: "60px"}}
            onChange={(e: { target: { value: string } }) => setGoal(Number(e.target.value))}/>
        </Goal>
        <GoalTable className="table table-bordered m-3">
          <thead className="thead-light">
            <tr>
              <th>This Week</th>
              <th>Weekend</th>
            </tr>
            <tr>
              <td className={`table-${TIME_THIS_WEEK > goal ? "success" : "danger"}`}>{TIME_THIS_WEEK.toFixed(2)}</td>
              <td className={`table-${TIME_THIS_WEEK_END > goal ? "success" : "danger"}`}>{TIME_THIS_WEEK_END.toFixed(2)}</td>
            </tr>
          </thead>
        </GoalTable>
        {data[0].out
          ? <button 
              className="btn btn-outline-primary m-3" 
              type="button"
              onClick={clockIn}>Clock In</button>
          : <button
              tabIndex={6}
              className="btn btn-outline-primary m-3" 
              type="button"
              onClick={clockOut}>Clock Out</button>}
      </div>
      {data[0].out ? '' : <div className="mx-3 mb-4"><textarea tabIndex={5} className='form-control' placeholder='What did we accomplish?' onChange={e => setAccomplished(e.target.value)} /></div> }
      <TimeTable>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Date</th>
              <th>IN</th>
              <th>OUT</th>
              <th>Duration</th>
              <th>Accomplished</th>
            </tr>
          </thead>
          {data.map((time: clock) => {
            return (
              <tr key={time.accomplished}>
                <td>{`${new Date(time.in).getMonth() + 1}/${new Date(time.in).getUTCDate()}/${new Date(time.in).getFullYear()}`}</td>
                <td>{`${new Date(time.in).getHours()}:${new Date(time.in).getUTCMinutes() < 10 ? 0 : ''}${new Date(time.in).getUTCMinutes()}`}</td>
                {time.out && <td>{`${new Date(time.out).getHours()}:${new Date(time.out).getUTCMinutes() < 10 ? 0 : ''}${new Date(time.out).getUTCMinutes()}`}</td>}
                {time.out && <td>{`${duration(time.in, time.out)}`}</td>}
                {time.accomplished && <td>{time.accomplished}</td>}
              </tr>
            )
          })}
        </table>
      </TimeTable>
    </>
  )
}