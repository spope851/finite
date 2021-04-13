const Endpoints = {
  USERS: process.env.REACT_APP_MONGO_USERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/users`,
  LOANS: process.env.REACT_APP_MONGO_LOANS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/finance/loans`,
  TRADES: process.env.REACT_APP_MONGO_TRADES || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/trades`,
  POSITIONS: process.env.REACT_APP_MONGO_POSITIONS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/positions`,
  PLAYERS: process.env.REACT_APP_MONGO_PLAYERS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/players`,
  PLAYER: process.env.REACT_APP_MONGO_PLAYER || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/player`,
  TEAMS: process.env.REACT_APP_MONGO_TEAMS || `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/teams`,
  TIME: `http://localhost:${process.env.REACT_APP_SERVER_PORT}/time`
}

export {
  Endpoints
}