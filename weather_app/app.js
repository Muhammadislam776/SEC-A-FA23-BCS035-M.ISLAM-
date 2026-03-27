const express = require("express")
const cors = require("cors")
const path = require("path")

const weatherRoutes = require("./routes/weatherRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static("public"))

app.use("/api/weather", weatherRoutes)

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"views/index.html"))
})

const PORT = 3000

app.listen(PORT,()=>{
console.log(`Server running on http://localhost:${PORT}`)
})