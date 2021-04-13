import React from 'react'
import { populateUsers } from '../../functions/populate-users'

export const PopulateUsers:React.FC = () => {

  return (
    <button
      className="btn btn-outline-warning m-2"
      onClick={populateUsers}>
        No users in DB. Click here to add some for testing
    </button>
  )
}