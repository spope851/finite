require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
const app = express()

const port = process.env.PORT || 3001;
const HOST = process.env.MODE === 'dev' ? process.env.HOST_DEV : process.env.HOST_PROD
const MONGO_URL = `mongodb://admin:password@${HOST}:27017`
const MONGO_OPTIONS = { useUnifiedTopology: true, authSource: 'admin' }
const FINITE_DB = 'finite'
const USER_TABLE = 'users'
const TRADE_TABLE = 'trades'
const LEADER_TABLE = 'leaders'
const PLAYER_TABLE = 'players'
const POSITION_TABLE = 'positions'
const USER_ENDPOINT = '/api/users'
const TRADE_ENDPOINT = '/api/trades'
const PLAYER_ENDPOINT = '/api/players'
const POSITION_ENDPOINT = '/api/positions'

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

async function getUsers(response,client) {
  let responses = []
  let cursor = client.db(FINITE_DB).collection(USER_TABLE).find()
  await cursor.forEach( el => {
    responses.push(el)
  })
  response.send(responses)
}

async function getPlayers(response,client,id) {
  let responses = []
  let cursor = client.db(FINITE_DB).collection(PLAYER_TABLE).find(
    id
      ? { _id: id }
      : ''
  )
  await cursor.forEach( el => {
    responses.push(el)
  })
  response.send(responses)
}

async function getPositions(response,client,user_id,player_id) {
  let responses = []
  let cursor = client.db(FINITE_DB).collection(POSITION_TABLE).aggregate(
    player_id
      ? [{$match: { player_id: ObjectId(player_id), user_id: ObjectId(user_id) }}]
      : [
          {$match: { user_id: ObjectId(user_id) }},
          {
            $lookup: {
              from: TRADE_TABLE,
              localField: "player_id",
              foreignField: "player_id",
              as: "all_trades"
            }
          },
          {
            $lookup: {
              from: PLAYER_TABLE,
              localField: "player_id",
              foreignField: "_id",
              as: "player"
            }
          }
        ]
  )
  await cursor.forEach( el => {
    responses.push(el)
  })
  response.send(responses)
}

async function getTrades(response,client,user_id) {
  let responses = []
  let cursor = client.db(FINITE_DB).collection(TRADE_TABLE).aggregate([
    { 
      $match: { 
        user_id: ObjectId(user_id) 
      } 
    }
  ])
  await cursor.forEach( el => {
    responses.push(el)
  })
  response.send(responses)
}

async function getUserValue(response,client,user_id) {
  let responses = []
  let cursor = client.db(FINITE_DB).collection(TRADE_TABLE).aggregate([
    { 
      $match: { 
        user_id: ObjectId(user_id) 
      } 
    },
    { 
      $group: { 
        _id: null, 
        stockValue: { 
          $sum: {
            $multiply: [ 
              "$price", 
              "$quantity" 
            ] 
          } 
        } 
      } 
    }
  ])
  await cursor.forEach( el => {
    responses.push(el)
  })
  response.send(responses)
}

async function populate(client,body) {
  await client.db(FINITE_DB).collection(body.table).insertMany(body.records)
}

async function logout(client) {
  await client.db(FINITE_DB).collection(USER_TABLE).updateOne(
    {signedIn:true},
    { $set: {signedIn:false} }
  )
}
async function login(client,_id) {
  await client.db(FINITE_DB).collection(USER_TABLE).updateOne(
    {_id: new ObjectId(_id)},
    { $set: {signedIn:true} }
  )
}

async function signup(client,body) {
  await client.db(FINITE_DB).collection(USER_TABLE).insertOne(body)
}

async function trade(client,body) {
  await client.db(FINITE_DB).collection(TRADE_TABLE).insertOne({
    "user_id": ObjectId(body.user_id),
    "buy": body.buy,
    "timestamp": body.timestamp,
    "player_id": ObjectId(body.player_id),
    "quantity": body.quantity,
    "price": body.price
  })
}

async function newPosition(client,body) {
  await client.db(FINITE_DB).collection(POSITION_TABLE).insertOne({
    "user_id": ObjectId(body.user_id),
    "player_id": ObjectId(body.player_id),
    "quantity": body.quantity,
  })
}

async function deleteUser(client,_id) {
  await client.db(FINITE_DB).collection(USER_TABLE).deleteOne({_id: new ObjectId(_id)})
}

async function deletePosition(client,_id) {
  await client.db(FINITE_DB).collection(POSITION_TABLE).deleteOne({_id: new ObjectId(_id)})
}

async function changePassword(client,_id,newPassword) {
  await client.db(FINITE_DB).collection(USER_TABLE).updateOne(
    {_id: new ObjectId(_id)},
    { $set: {
        password:newPassword,
        signedIn:false
      } 
    }
  )
}

async function updatePosition(client,_id,quantity) {
  await client.db(FINITE_DB).collection(POSITION_TABLE).updateOne(
    {_id: new ObjectId(_id)},
    { $set: {
        quantity:quantity
      } 
    }
  )
}

async function updateStockValue(client,_id,tradeValue) {
  await client.db(FINITE_DB).collection(USER_TABLE).updateOne(
    {_id: new ObjectId(_id)},
    { 
      $inc: {
        stockValue: tradeValue,
        cash: tradeValue * -1,
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
})

app.get(PLAYER_ENDPOINT, (req, res) => {
  console.log('GET   ',req.headers.id)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    if (req.headers.id){
      getPlayers(res, client, req.headers.id)
    } else {
      getPlayers(res, client)
    }
  })
})

app.get(TRADE_ENDPOINT, (req, res) => {
  console.log('GET   ',req.headers.function, req.headers.user_id)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    if (!req.headers.function) {getTrades(res, client, req.headers.user_id)}          
    if (req.headers.function === 'userValue') {
      getUserValue(res, client, req.headers.user_id)
    }      
  })
})

app.get(POSITION_ENDPOINT, (req, res) => {
  console.log('GET   ', req.headers.user_id, req.headers.player_id)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    if (req.headers.player_id){
      getPositions(res, client, req.headers.user_id, req.headers.player_id)
    } else {
      getPositions(res, client, req.headers.user_id)
    }     
  })
})

app.put(USER_ENDPOINT, (req, res) => {
  console.log('PUT   ',req.body)  
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err
    if (req.body.function === 'logout'){logout(client)}
    if (req.body.function === 'login'){login(client, req.body._id)}
    if (req.body.function === 'changePassword'){changePassword(client, req.body._id, req.body.newPassword)}
    if (req.body.function === 'populate'){populate(client, req.body)}
    if (req.body.function === 'updateStockValue'){updateStockValue(client, req.body._id, req.body.tradeValue)}
  })
})

app.put(PLAYER_ENDPOINT, (req, res) => {
  console.log('PUT   ',req.body)  
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err
    if (req.body.function === 'populate'){populate(client, req.body)}
  })
})

app.put(POSITION_ENDPOINT, (req, res) => {
  console.log('PUT   ',req.body)  
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err
    updatePosition(client, req.body._id, req.body.quantity)
  })
})

app.post(USER_ENDPOINT, (req, res) => {
  console.log('POST  ',req.body);
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    signup(client, req.body)      
  })
})

app.post(TRADE_ENDPOINT, (req, res) => {
  console.log('POST  ',req.body);
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    trade(client, req.body)      
  })
})

app.post(POSITION_ENDPOINT, (req, res) => {
  console.log('POST  ',req.body);
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    newPosition(client, req.body)      
  })
})

app.delete(USER_ENDPOINT, (req, res) => {
  console.log('DELETE',req.body);
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    deleteUser(client, req.body._id)      
  })
})

app.delete(POSITION_ENDPOINT, (req, res) => {
  console.log('DELETE',req.body);
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    deletePosition(client, req.body._id)      
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
