const mongoose = require('mongoose')
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://Rushabh95:Rushabh95@cluster0.zxfpogs.mongodb.net/inotebook"

const mongoConnect = ()=>{
    mongoose.connect(mongoUrl,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
        console.log("Database connected successfully")
    }).catch((err)=>{
        console.log("Db connection unsuccessful, err: ",err.message)
    })
}
module.exports=mongoConnect