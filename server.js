// import dependancies
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// API key 
const apikey = process.env.OPENWEATHERMAP_API_KEY
// make network calls with node-fetch
const fetch = require('node-fetch')

// schema
const schema = buildSchema(`
  type Weather {
    temperature: Float!
    description: String!
  }

  enum Units {
    standard
    metric
    imperial
  }

  type Query {
    getWeather(zip: Int!): Weather!
  }
`)

// resolver 
const root = {
  getWeather: async ({ zip }) => {
                const apikey = process.env.OPENWEATHERMAP_API_KEY
                const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}`
                const res = await fetch(url)
                const json = await res.json()
                const temperature = json.main.temp
                const description = json.weather[0].description
                return { temperature, description }
  }
}

// create an express app
const app = express()

// define a route for GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

// require dotenv and call cofig
require('dotenv').config()

// start this app
const port = 4000
app.listen(port, () => {
  console.log('Running on port:'+port)
})