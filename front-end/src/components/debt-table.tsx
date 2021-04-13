import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap'
import { Endpoints } from '../variables/api.variables'

let axios = require('axios')

interface OwnProps {
  userId: string
}

export const DebtTable:React.FC<OwnProps> = ({
  userId
}) => {
  const [credit, setCredit] = useState<any>()
  
  
  useEffect(() => {
    const fetchCredit = async () => {
      const credit = await axios.get(Endpoints.LOANS, { headers: { user_id: userId } })
      credit.data[0] && setCredit(credit.data)
    }
    fetchCredit()
  },[userId])

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {credit && credit.slice(0, credit.length - 1).map((loan:any) => {
          return(
            <tr key={loan._id}>
              <td>{new Date(loan.date).toLocaleString()}</td>
              <td>{`$${loan.credit}`}</td>
            </tr>
          )
        })}
      </tbody>
      <tfoot>
        <tr className="font-weight-bold">
          <td>Total Debt</td>
          <td>{credit && `$${credit[credit.length - 1].total}`}</td>
        </tr>
      </tfoot>
    </Table>
  )
}