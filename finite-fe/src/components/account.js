import React from 'react';
import get from '../services/get.service'

let axios = require('axios');

let user
let user_id

const MONGO_EXPRESS_API =  `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

const MONGO_DB = {
  "db":"user_account",
  "table":"users"
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
    axios.delete(MONGO_EXPRESS_API, { "data": {"id":user_id}})
    document.location.reload()
  }
}

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changepw: false,
      disabled: false,
      users: []
    }
  }
  componentDidMount() {
    get('users')
      .then(res => this.setState({ users: res }))
      .catch(err => console.log(err));
  }
    
  changePassword = (e) => {
    e.preventDefault()
    let newPassword = document.getElementById('newP').value
    console.log(newPassword)
    axios.put(MONGO_EXPRESS_API, {
      "function":"changePassword",
      "id": user_id,
      "newPassword": newPassword,
      ...MONGO_DB
    })
    let ans = window.confirm('Password changes successfully!')
    if (ans) {document.location.reload()}
  }

  render() {
    this.state.users.forEach(function(el){
      if (el.signedIn === true){
        user_id = el.id
        user = el.username
      }
    })

    return (
      <div>
        {user ? 
          <>
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <button disabled={this.state.disabled} className="nav-link" onClick={()=>this.setState({changepw: true, disabled: true})}>Change Password</button>
                  </td>
                  <td>
                    <button disabled={this.state.disabled} className="nav-link" onClick={deleteAccount}>Delete Account</button>
                  </td>
                  <td>
                    <button disabled={this.state.disabled} className="nav-link" onClick={logout}>Logout</button>
                  </td>
                </tr>
              </tbody>  
            </table>
            {this.state.changepw ? 
              <form onSubmit={this.changePassword.bind(this)}>
                <input id="newP" type="password" placeholder="New Password" autofocus/>
                <input type="submit" value="Confirm"/>
              </form>
            :
              ''
            }
          </> 
        : 
          <a href={'/login'}>Login</a>
        }
      </div>
    );
  }
}

export default Account;