require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const app = express()
const fs = require('fs')

const port = process.env.PORT || 3001;
const HOST = process.env.MODE === 'dev' ? process.env.HOST_DEV : process.env.HOST_PROD
const MONGO_URL = `mongodb://spope:password@${HOST}:27017`
const MONGO_OPTIONS = { useUnifiedTopology: true, authSource: 'admin' }
const FINITE_DB = 'finite'
const USER_TABLE = 'users'
const TEAMS_TABLE = 'teams'
const TRADE_TABLE = 'trades'
const PLAYER_TABLE = 'players'
const POSITION_TABLE = 'positions'
const TIMESHEET = '/time'
const USER_ENDPOINT = '/api/user'
const USERS_ENDPOINT = '/api/users'
const TEAM_ENDPOINT = '/api/teams'
const TRADE_ENDPOINT = '/api/trades'
const PLAYER_ENDPOINT = '/api/player'
const PLAYERS_ENDPOINT = '/api/players'
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


async function getUser(response,client) {
  let responses = []
  let WEEK
  await client.db(FINITE_DB).collection(PLAYER_TABLE, function(err, collection) {
    collection.aggregate([{ $limit: 1 },{ $project: { priceCount: { $size: { "$objectToArray": "$price" } } } }]).toArray(async function(err, results) {
      WEEK = await results[0].priceCount
      let cursor 
      await client.db(FINITE_DB).collection(USER_TABLE, function(err, collection) {
        collection.aggregate([
          { $match: { signedIn: true } },
          {
            $lookup: {
              from: TRADE_TABLE,
              localField: "_id",
              foreignField: "user_id",
              as: "trades"
            }
          },
          { $unwind: { path: "$trades", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: PLAYER_TABLE,
              localField: "trades.player_id",
              foreignField: "_id",
              as: "player"
            }
          },
          { $unwind: { path: "$player", preserveNullAndEmptyArrays: true } },
          {
            $group: { 
              _id: { username: "$username", _id: "$_id", cash: "$cash" },
              equity: {
                $sum: {
                  $multiply: [ 
                    `$player.price.${WEEK}`,
                    "$trades.quantity",
                    { $cond: [ { $toBool: "$trades.buy" }, 1, -1 ] } 
                  ]
                }
              } 
            } 
          }
        ]).toArray(async function(err, results) {
          cursor = await results
          await cursor.forEach( el => {
            responses.push(el)
          })
          response.send(responses)
        })
      })
    })
  })
}

async function getTeams(response,client,id) {
  let responses = []
  let cursor = client.db(FINITE_DB).collection(TEAMS_TABLE).find(
    id
      ? { id: Number(id) }
      : '')
  await cursor.forEach( el => {
    responses.push(el)
  })
  response.send(responses)
}

async function getPlayers(response,client,sort,team,term,player,limit) {
  let s
  switch(sort) {
    case 'nameaz':
      s = { name: 1 }
      break
    case 'nameza':
      s = { name: -1 }
      break
    case 'priceh':
      s = { latestPrice: -1 }
      break
    case 'pricel':
      s = { latestPrice: 1 }
      break
    case 'volume':
      s = { volume: -1 }
      break
    default:
      s = { name: 1 }
  }
  let responses = []
  let cursor = 
    team
      ? client.db(FINITE_DB).collection(TEAMS_TABLE).aggregate([
        {$match: { id: Number(team) }},
        {
          $lookup: {
            from: PLAYER_TABLE,
            localField: "id",
            foreignField: "team",
            as: "players"
          }
        }
      ])
      : player
        ? client.db(FINITE_DB).collection(PLAYER_TABLE).find({ "_id": { $in: [player] } })
        : client.db(FINITE_DB).collection(PLAYER_TABLE).aggregate([
            { $match: { "name": new RegExp(term, "i") } },
            { $addFields: { latestPrice: { $last: { $objectToArray: "$price" } } } },
            { $sort: s },
            { $limit: Number(limit) || 500 }
          ])
  
  await cursor.forEach( el => {
    responses.push(el)
  })
  response.send(responses)
}

async function getPositions(response,client,user_id,player_id) {
  let responses = []
  let cursor = client.db(FINITE_DB).collection(POSITION_TABLE).aggregate(
    player_id
      ? [{$match: { player_id: player_id, user_id: ObjectId(user_id) }}]
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
          },
          { $unwind: "$player" },
          {
            $lookup: {
              from: TEAMS_TABLE,
              localField: "player.team",
              foreignField: "id",
              as: "team"
            }
          },
          { $unwind: "$team" }
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

async function populate(client,body) {
  await client.db(FINITE_DB).collection(body.table).insertMany(body.records)
}

async function incPlayerVolume(client,body) {
  await client.db(FINITE_DB).collection(PLAYER_TABLE).updateOne({ _id: body._id }, { $inc: { volume: body.quantity }})
}

async function logout(client) {
  await client.db(FINITE_DB).collection(USER_TABLE).updateOne(
    {signedIn:true},
    { $set: {signedIn:false} }
  )
}
async function login(client,_id) {
  await client.db(FINITE_DB).collection(USER_TABLE).updateOne(
    {_id: ObjectId(_id)},
    { $set: {signedIn:true} }
  )
}

async function signup(client,body) {
  await client.db(FINITE_DB).collection(USER_TABLE).insertOne(body)
}

async function trade(client,body) {
  await client.db(FINITE_DB).collection(TRADE_TABLE).insertOne({
    "user_id": new ObjectId(body.user_id),
    "buy": body.buy,
    "timestamp": body.timestamp,
    "player_id": body.player_id,
    "quantity": body.quantity,
    "price": body.price
  })
}

async function newPosition(client,body) {
  await client.db(FINITE_DB).collection(POSITION_TABLE).insertOne({
    "user_id": new ObjectId(body.user_id),
    "player_id": body.player_id,
    "quantity": body.quantity,
  })
}

async function deleteUser(client,_id) {
  await client.db(FINITE_DB).collection(USER_TABLE).deleteOne({_id: ObjectId(_id)})
}

async function deletePosition(client,_id) {
  await client.db(FINITE_DB).collection(POSITION_TABLE).deleteOne({_id: ObjectId(_id)})
}

async function changePassword(client,_id,newPassword) {
  await client.db(FINITE_DB).collection(USER_TABLE).updateOne(
    {_id: ObjectId(_id)},
    { $set: {
        password:newPassword,
        signedIn:false
      } 
    }
  )
}

async function updatePosition(client,_id,quantity) {
  await client.db(FINITE_DB).collection(POSITION_TABLE).updateOne(
    {_id: ObjectId(_id)},
    { $set: {
        quantity:quantity
      } 
    }
  )
}

async function updateCash(client,_id,tradeValue) {
  await client.db(FINITE_DB).collection(USER_TABLE).updateOne(
    {_id: ObjectId(_id)},
    { $inc: { cash: tradeValue * -1 } }
  )
}

async function deposit(client,_id,deposit) {
  await client.db(FINITE_DB).collection(USER_TABLE).updateOne(
    {_id: ObjectId(_id)},
    { $inc: { cash: deposit } }
  )
}

app.get(USERS_ENDPOINT, (req, res) => {
  console.log('GET user  ',req.body)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    getUsers(res, client)      
  })
})

app.get(USER_ENDPOINT, (req, res) => {
  console.log('GET user  ',req.body)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    getUser(res, client)      
  })
})

app.get(TEAM_ENDPOINT, (req, res) => {
  console.log('GET team  ',req.headers.id)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err
    if (req.headers.id){
      getTeams(res, client, req.headers.id)
    } else {
      getTeams(res, client)      
    }
  })
})

app.get(PLAYERS_ENDPOINT, (req, res) => {
  console.log('GET players  ',`team:${req.headers.team}`,`term:${req.headers.term}`,`sort:${req.headers.sort}`)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    if (req.headers.team) {
      getPlayers(res, client, req.headers.sort, req.headers.team)
    } else if (req.headers.player) {
      getPlayers(res, client, req.headers.sort, undefined, undefined, req.headers.player)
    } else {
      getPlayers(res, client, req.headers.sort, undefined, req.headers.term, undefined, req.headers.limit)
    }
  })
})

app.get(PLAYER_ENDPOINT, (req, res) => {
  console.log('GET player  ')
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    getPlayers(res, client, undefined, undefined, undefined, req.headers.player)
  })
})

app.get(TRADE_ENDPOINT, (req, res) => {
  console.log('GET trades  ',req.headers.function, req.headers.user_id)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    if (!req.headers.function) {getTrades(res, client, req.headers.user_id)}     
  })
})

app.get(POSITION_ENDPOINT, (req, res) => {
  console.log('GET positions  ', req.headers.user_id, req.headers.player_id)
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err  
    if (req.headers.player_id){
      getPositions(res, client, req.headers.user_id, req.headers.player_id)
    } else {
      getPositions(res, client, req.headers.user_id)
    }     
  })
})

app.put(USERS_ENDPOINT, (req, res) => {
  console.log('PUT   ',req.body)  
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err
    if (req.body.function === 'logout'){logout(client)}
    if (req.body.function === 'login'){login(client, req.body._id)}
    if (req.body.function === 'changePassword'){changePassword(client, req.body._id, req.body.newPassword)}
    if (req.body.function === 'populate'){populate(client, req.body)}
    if (req.body.function === 'updateCash'){updateCash(client, req.body._id, req.body.tradeValue)}
    if (req.body.function === 'deposit'){deposit(client, req.body._id, req.body.deposit)}
  })
})

app.put(PLAYERS_ENDPOINT, (req, res) => {
  console.log('PUT   ',req.body)  
  MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (err, client) => {
    if (err) throw err
    if (req.body.function === 'populate'){populate(client, req.body)}
    else incPlayerVolume(client, req.body)
  })
})

app.put(TEAM_ENDPOINT, (req, res) => {
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

app.post(USERS_ENDPOINT, (req, res) => {
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

app.post(TIMESHEET, (req, res) => {
  console.log('POST  ',req.body)

  const file = '../../front-end/src/components/timesheet/timesheet.json'

  if (req.body.clock_in) {
    fs.readFile(file, (err, data) => {
      if (err) throw err
      else res.send('nice')
      let content = data.toString()
      const sub = content.substring(1, content.length)
      const buf = new Buffer.from('[' + JSON.stringify(req.body.clock_in) + ',' + sub)
      const fd = fs.openSync(file,'r+')
      fs.writeSync(fd, buf, 0)
    })
  } else {
    fs.readFile(file, (err, data) => {
      if (err) throw err
      else res.send('nice')
      let content = data.toString()
      const sub = content.substring(2, content.length);
      const buf = new Buffer.from('[{"out":' + JSON.stringify(req.body.clock_out.out) + ',"accomplished":' + JSON.stringify(req.body.clock_out.accomplished) + ',' + sub)
      const fd = fs.openSync(file,'r+')
      fs.writeSync(fd, buf, 0)
    })
  }
})

app.delete(USERS_ENDPOINT, (req, res) => {
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
