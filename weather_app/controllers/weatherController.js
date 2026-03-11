const weatherService = require("../services/weatherService")

exports.getWeather = async(req,res)=>{

try{

const city = req.query.city

const data = await weatherService.getWeather(city)

res.json(data)

}catch(error){

res.status(500).json({
error:"Weather data not found"
})

}

}