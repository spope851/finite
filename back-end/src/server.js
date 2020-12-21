require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const port = process.env.PORT || 3001;
const HOST = process.env.MODE === 'dev' ? process.env.HOST_DEV : process.env.HOST_PROD
const MONGO_URL = `mongodb://admin:password@${HOST}:27017`
const MONGO_OPTIONS = { useUnifiedTopology: true, authSource: 'admin' }
const USER_DB = 'user_account'
const PLAYER_DB = 'player_account'
const USER_TABLE = 'users'
const PLAYER_TABLE = 'players'
const USER_ENDPOINT = '/api/users'
const PLAYER_ENDPOINT = '/api/players'

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

async function getUsers(response,client) {
  let responses = []
  let cursor = client.db(USER_DB).collection(USER_TABLE).find()
  await cursor.forEach( el => {
    responses.push(el)
  })
  response.send(responses)
}

async function getPlayers(response,client) {
  let responses = []
  let cursor = client.db(PLAYER_DB).collection(PLAYER_TABLE).find()
  await cursor.forEach( el => {
    responses.push(el)
  })
  response.send(responses)
}

async function populate(client,body) {
  await client.db(body.db).collection(body.table).insertMany(body.records)
}

async function logout(client) {
  await client.db(USER_DB).collection(USER_TABLE).updateOne(
    {signedIn:true},
    { $set: {signedIn:false} }
  )
}

async function login(client,id) {
  await client.db(USER_DB).collection(USER_TABLE).updateOne(
    {id:id},
    { $set: {signedIn:true} }
  )
}

async function signup(client,body) {
  await client.db(USER_DB).collection(USER_TABLE).insertOne(body)
}

async function deleteUser(client,id) {
  await client.db(USER_DB).collection(USER_TABLE).deleteOne({id:id})
}

async function changePassword(client,id,newPassword) {
  await client.db(USER_DB).collection(USER_TABLE).updateOne(
    {id:id},
    { $set: {
        password:newPassword,
        signedIn:false
      } 
    }
  )
}

app.get(USER_ENDPOINT, (req, res) => {
  console.log('GET   ',req.body)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    getUsers(res, client)      
  })
});

app.get(PLAYER_ENDPOINT, (req, res) => {
  console.log('GET   ',req.body)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    getPlayers(res, client)      
  })
});

app.put(USER_ENDPOINT, (req, res) => {
  console.log('PUT   ',req.body)  
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err
    if (req.body.function === 'logout'){logout(client)}
    if (req.body.function === 'login'){login(client, req.body.id)}
    if (req.body.function === 'changePassword'){changePassword(client, req.body.id, req.body.newPassword)}
    if (req.body.function === 'populate'){populate(client, req.body)}
  })
})

app.put(PLAYER_ENDPOINT, (req, res) => {
  console.log('PUT   ',req.body)  
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err
    if (req.body.function === 'populate'){populate(client, req.body)}
  })
})

app.post(USER_ENDPOINT, (req, res) => {
  console.log('POST  ',req.body);
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    signup(client, req.body)      
  })
});

app.delete(USER_ENDPOINT, (req, res) => {
  console.log('DELETE',req.body);
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    deleteUser(client, req.body.id)      
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));