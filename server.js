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
    feels_like: Float
    temp_min: Float
    temp_max: Float
    pressure: Float
    humidity: Float
    cod: String!
    message: String
  }

  enum Units {
    standard
    metric
    imperial
  }

  type Query {
    getWeather( zip: Int!, units: Units ): Weather!
  }
`)

// resolver 
const root = {
  getWeather: async ({ zip, units }) => {
                const apikey = process.env.OPENWEATHERMAP_API_KEY
                const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`
                const res = await fetch(url)
                const json = await res.json()
                const temperature = json.main.temp
                const description = json.weather[0].description
                const feels_like = json.main.feels_like
                const temp_min = json.main.temp_min
                const temp_max = json.main.temp_max
                const pressure = json.main.pressure
                const humidity = json.main.humidity
                const cod = json.cod
                const message = json.message
                return { temperature, description, feels_like, temp_min, temp_max, pressure, humidity, cod, message }
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
  console.log('Running on port:' + port)
})