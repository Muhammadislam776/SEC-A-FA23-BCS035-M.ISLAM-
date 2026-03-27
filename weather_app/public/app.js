const input = document.getElementById("cityInput")
const suggestions = document.getElementById("suggestions")

let dailyTemps=[]
let hourlyTemps=[]

/* AUTOCOMPLETE */

input.addEventListener("input", async ()=>{

const value=input.value

if(value.length<1) return

const res=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}`)

const data=await res.json()

suggestions.innerHTML=""

data.results?.forEach(city=>{

const div=document.createElement("div")

div.classList.add("suggestion")

div.innerText=city.name + ", " + city.country

div.onclick=()=>{
input.value=city.name
suggestions.innerHTML=""
}

suggestions.appendChild(div)

})

})


async function searchWeather(){

const city=input.value

const res=await fetch(`/api/weather?city=${city}`)

const data=await res.json()

const weather=data.current_weather

dailyTemps=data.daily.temperature_2m_max

hourlyTemps=data.hourly.temperature_2m.slice(0,24)

document.getElementById("weatherCard").innerHTML = `

<div class="col-md-4">

<div class="card weather-card text-center p-4 shadow-lg">

<i class="fa-solid fa-cloud-sun weather-icon"></i>

<h3>${city}</h3>

<h2 class="display-5">${weather.temperature}°C</h2>

<p>

<i class="fa-solid fa-wind"></i>
Wind: ${weather.windspeed} km/h

</p>

</div>

</div>

`

createChart(hourlyTemps)

showForecast(3)

}


function showForecast(days){

let html=""

for(let i=0;i<days;i++){

html+=`

<div class="col-md-2">

<div class="card forecast-card p-3 text-center">

Day ${i+1}

<h5>${dailyTemps[i]}°C</h5>

</div>

</div>

`

}

document.getElementById("forecast").innerHTML=html

}

function forecastType(days){

showForecast(days)

}

function hourlyForecast(){

let html=""

for(let i=0;i<24;i++){

html+=`

<div class="col-md-1">

<div class="card p-2 text-center">

${i}:00
<h6>${hourlyTemps[i]}°C</h6>

</div>

</div>

`

}

document.getElementById("forecast").innerHTML=html

}


/* CHART */

let chart

function createChart(data){

const ctx=document.getElementById("chart")

if(chart) chart.destroy()

chart=new Chart(ctx,{
type:"line",
data:{
labels:Array.from({length:24},(_,i)=>i+":00"),
datasets:[{
label:"Temperature",
data:data
}]
}
})

}


/* DARK MODE */

function toggleMode(){

document.body.classList.toggle("light")

}