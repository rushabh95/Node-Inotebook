require('dotenv')
const express = require('express')
const mongoConnect = require('./config/db')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 7080;
app.use(cors())
app.use(express.json({urlencoded: true}))
app.get('/',(req,res)=>{
    res.send("Hello World")
})
app.use('/api/v1',require('./routes/notes'))
app.use('/api/v1',require('./routes/auth'))
mongoConnect()
app.listen(port,()=>{
    console.log(`INoteBook App is running at port http://localhost:${port}`)
})