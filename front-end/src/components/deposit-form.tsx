import React, { useState } from 'react'
import { Button } from 'reactstrap'
import { Endpoints } from '../variables/api.variables'

let axios = require('axios')

interface OwnProps {
  userId: string
}

export const DepositForm:React.FC<OwnProps> = ({
  userId
}) => {
  const [deposit, setDeposit] = useState<string>('50')
  
  const depositFunds = () => {
    axios.put(Endpoints.USERS, {
      "function":"deposit",
      "_id": userId,
      "deposit": Number(deposit)
    })
    axios.post(Endpoints.LOANS, {
      user_id: userId,
      credit: Number(deposit),
      date: new Date()
    })
    document.location.reload()
  }

  return (
    <>
      <div className="input-group mb-3 mt-auto">
        <div className="input-group-prepend">
          <span className="input-group-text">$</span>
        </div>
        <input
          onChange={(e: { target: { value: string } }) => setDeposit(e.target.value)}
          type="number"
          className="form-control"
          aria-label="Amount (to the nearest dollar)" 
          min={0}
          step={50}
          placeholder="50"
        />
        <div className="input-group-append">
          <span className="input-group-text">.00</span>
        </div>
      </div>
      <Button className="w-100" color="success" outline={true} onClick={depositFunds}>Deposit</Button>
    </>
  )
}