const axios = require("axios")
const config = require("../config/apiConfig")

exports.getWeather = async(city)=>{

const geo = await axios.get(
`${config.geoURL}?name=${city}`
)

const lat = geo.data.results[0].latitude
const lon = geo.data.results[0].longitude

const weather = await axios.get(
`${config.weatherURL}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,windspeed_10m_max&timezone=auto`
)

return weather.data

}