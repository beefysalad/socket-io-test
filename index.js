const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 8080
const server = http.createServer(app)
const path = require('path')
const {Server} = require('socket.io')
const io = new Server(server)
console.clear()


app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'/views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('index')
})


io.on("connection",(socket) =>{
    console.log(`user ${socket.id} has conected`)
    socket.on("disconnect",(socket)=>{
        console.log(`user ${socket.id} has disconnected`)
    })
    socket.on("message",(data)=>{
        io.emit("message",data)
    })
})



server.listen(port,()=>[
    console.log(`Running on port ${port}`)
])