import React, { useEffect, useState } from 'react';
import { userProps } from './user';

let axios = require('axios');

const MONGO_EXPRESS_API =  `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

const MONGO_DB = {
  "db":"user_account",
  "table":"users"
}

export const Account:React.FC = () => {

  const [changepw, setChangepw] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>()
  const [userId, setUserId] = useState<number>()

  useEffect(() => {
    fetchUser()
  },[])
  
  const fetchUser = async () => {
    const data = await fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`)
    const jsnData = await data.json()
    jsnData.forEach((user:userProps) => {
      if (user.signedIn) {
        setUserId(user.id)
      }
    })
  }
  
  const logout = () => {
    axios.put(MONGO_EXPRESS_API, {
      "function":"logout",
      ...MONGO_DB
    })
    document.location.reload()
  }

  const deleteAccount = () => {
    let ans = window.confirm("Are you sure?")
    if(ans){
      axios.delete(MONGO_EXPRESS_API, { "data": {"id":userId}})
      document.location.reload()
    }
  }
      
  const changePassword = () => {
    axios.put(MONGO_EXPRESS_API, {
      "function":"changePassword",
      "id": userId,
      "newPassword": newPassword,
      ...MONGO_DB
    })
    let ans = window.confirm('Password changes successfully!')
    if (ans) {document.location.reload()}
  }

  return (
    <div>
      {userId
        ? <>
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <button 
                      disabled={disabled} 
                      className="nav-link" 
                      onClick={()=> {
                        setChangepw(true)
                        setDisabled(true)
                      }}>Change Password</button>
                  </td>
                  <td>
                    <button disabled={disabled} className="nav-link" onClick={deleteAccount}>Delete Account</button>
                  </td>
                  <td>
                    <button disabled={disabled} className="nav-link" onClick={logout}>Logout</button>
                  </td>
                </tr>
              </tbody>  
            </table>
            {changepw 
              ? <>  
                  <input 
                    type="password" 
                    placeholder="New Password"
                    onChange={e => setNewPassword(e.target.value)}/>
                  <input 
                    type="submit" 
                    value="Confirm"
                    onClick={changePassword}/>
                </>
              : ''}
          </> 
        : <a href={'/login'}>Login</a>
      }
    </div>
  )
}