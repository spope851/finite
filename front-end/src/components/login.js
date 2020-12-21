import React from 'react';
import get from '../services/get.service'

let axios = require('axios');

const MONGO_EXPRESS_API = process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`

let nextID
let usernames = []
let passwords = []
let IDs = []

const MONGO_DB = {
  "db":"user_account",
  "table":"users"
}

class Login extends React.Component {
  constructor(props) {
    super(props); 
      this.state = {
        notSignedUp: false,
        wrongPassword: false,
        usernameUnavailable: false,
        users: []
    }
  }

  componentDidMount() {
    get('users')
      .then(res => this.setState({ users: res }))
      .catch(err => console.log(err));
  }

  login (e) {
    e.preventDefault()
    let username = document.getElementById('loginU').value
    let password = document.getElementById('loginP').value
    if(usernames.indexOf(username) > -1){
      if(password === passwords[usernames.indexOf(username)]){
        axios.put(MONGO_EXPRESS_API, {
          "function":"login",
          ...MONGO_DB, 
          "id":IDs[usernames.indexOf(username)]
        })
        this.props.history.push('/app')
        document.location.reload()
      }
      else{
        this.setState({wrongPassword: true});
      }
    }
    else{
      this.setState({notSignedUp: true});
    }
  }

  signup (e) {
    e.preventDefault()
    let username = document.getElementById('signupU').value
    let password = document.getElementById('signupP').value
    if(usernames.indexOf(username) === -1){
      axios.post(MONGO_EXPRESS_API,{
        "id": nextID,
        "username": username,
        "password": password,
        "signedIn":true
      })
      this.props.history.push('/app')
      document.location.reload()
    }
    else {
      this.setState({usernameUnavailable: true})
    }
  }

  render() {

    this.state.users.forEach(function(el){
      usernames.push(el.username)
      passwords.push(el.password)
      IDs.push(el.id)
      nextID = el.id + 1
    })

    return (
      <div>
        <h2>Login:</h2>
        <br />
        <form onSubmit={this.login.bind(this)}>
          <input id="loginU" type="text" placeholder="Username" autocomplete="off"/>
          <input id="loginP" type="password" placeholder="Password" />
          <input type="submit" value="Login"/>
        </form>
        {this.state.notSignedUp && <p style={{color:'red'}}>We can't find your account. Sign up below!</p>}
        {this.state.wrongPassword && <p style={{color:'red'}}>Incorrect Password</p>}
        <br />
        <h3>Or sign up for free:</h3>
        <br />
        <form onSubmit={this.signup.bind(this)}>
          <input id="signupU" type="text" placeholder="Username" autocomplete="off"/>
          <input id="signupP" type="password" placeholder="Password" />
          <input type="submit" value="Sign Up"/>
        </form>
        {this.state.usernameUnavailable && <p style={{color:'red'}}>Username unavailable! Try another</p>}
      </div>
    );
  }
}

export default Login;