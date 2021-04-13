import React, { useState } from 'react'
import { Table } from 'reactstrap'
import styled from 'styled-components'
import { FOOTHEIGHT } from '../..'
import { Endpoints } from '../../variables/api.variables'
import data from './timesheet.json'
const axios = require('axios')

export interface Clock {
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
  overflow: auto;
}`

export const Timesheet: React.FC = () => {
  const [accomplished, setAccomplished] = useState<string>()
  const [goal, setGoal] = useState<number>(1)

  const HEADHEIGHT = 67

  const clockIn = () => {
    const clock_in = { in: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) }
    axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/time`, {clock_in})
  }
  
  const clockOut = () => {
    const clock_out = {
      out: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
      accomplished: accomplished || ''
    }
    axios.post(Endpoints.TIME, {clock_out})
  }

  const duration = (timeIn: string, timeOut: string) => {
    return ((new Date(timeOut).getTime() - new Date(timeIn).getTime())/1000/60/60).toFixed(2)
  }

  let TIME_THIS_WEEK: number = 0
  let TIME_THIS_WEEK_END: number = 0

  const TODAY = new Date()
  const MONDAY = new Date()
  if(TODAY.getDay() === 0){
    MONDAY.setDate(TODAY.getDate() - 6)
  }
  else{
    MONDAY.setDate(TODAY.getDate() - (TODAY.getDay()-1))
  }

  data.forEach((time: Clock) => {
    const date = new Date(time.out || '')
    const day = date.getDay()
    if (time.out && new Date(time.out) > MONDAY) {
      if (day > 0 && day < 6) {
        TIME_THIS_WEEK += Number(duration(time.in, time.out))
      } else {
        TIME_THIS_WEEK_END += Number(duration(time.in, time.out))
      }
    }
  })

  return (
    <div className="d-flex flex-column" style={{ maxHeight: `calc(100vh - ${HEADHEIGHT + FOOTHEIGHT}px)` }}>
      <div className="d-flex align-items-center justify-content-center p-3">
        <Goal className={`input-group m-3 ${TIME_THIS_WEEK > goal && TIME_THIS_WEEK_END > goal && 'border rounded border-success'}`}>
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
        <GoalTable className={`table table-bordered m-3 ${TIME_THIS_WEEK > goal && TIME_THIS_WEEK_END > goal && 'animate__animated animate__tada animate__delay-2s'}`}>
          <thead className="thead-light">
            <tr>
              <th>This Week</th>
              <th>Weekend</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`table-${TIME_THIS_WEEK > goal ? "success" : "danger"}`}>{TIME_THIS_WEEK.toFixed(2)}</td>
              <td className={`table-${TIME_THIS_WEEK_END > goal ? "success" : "danger"}`}>{TIME_THIS_WEEK_END.toFixed(2)}</td>
            </tr>
          </tbody>
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
      <TimeTable>
        <Table striped className="table animate__animated animate__zoomIn">
          <thead className="thead-light">
            <tr>
              <th>Date</th>
              <th>IN</th>
              <th>OUT</th>
              <th>Duration</th>
              <th>Accomplished</th>
            </tr>
          </thead>
          <tbody>
          {data.map((time: Clock) => {
            return (
              <tr key={time.in}>
                <td>{new Date(time.in).toLocaleDateString()}</td>
                <td>{new Date(time.in).toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric' })}</td>
                <td>{time.out && new Date(time.out).toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric' })}</td>
                <td>{time.out && `${duration(time.in, time.out)}`}</td>
                <td>
                  {time.out 
                   ? time.accomplished 
                   : <textarea
                        tabIndex={5}
                        className='form-control animate__animated animate__lightSpeedInLeft'
                        placeholder='What did we accomplish?'
                        onChange={e => setAccomplished(e.target.value)} />}
                </td>
              </tr>
            )
          })}
          </tbody>
        </Table>
      </TimeTable>
    </div>
  )
}