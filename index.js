const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 8080
const server = http.createServer(app)
const path = require('path')
const {Server} = require('socket.io')
const io = new Server(server)
const moment = require('moment')
console.clear()

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'/views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))

// app.get('/',(req,res)=>{
//     res.render('home')
// })
app.get('/',(req,res)=>{
    res.render('chatu')
})
const userz = []
function getCurrentUser(id) {
    return userz.find(user => user.id === id);
}
function addUser(id,name){
    const user = {id,name}
    userz.push(user)
    return user
}
io.on("connection",(socket) =>{
    // console.log(`user ${socket.id} has conected`)
    socket.on('username',(username)=>{
        socket.username = username;
        addUser(socket.id,socket.username)
        io.emit('username',userz)
        // console.log(userz)
        // io.emit('is_online', `🔵 ${socket.username} has joined the chat`)
    })
    socket.on("disconnect",(username)=>{
        const removeElement = userz.findIndex(i => i.id === socket.id);
        if(removeElement>-1){
            userz.splice(removeElement,1);
        }
        io.emit('disconnectz',userz)
        // console.log(userz)
        // io.emit('is_online', `🔴 ${socket.username} has left the chat`)
    })
    socket.on("message",(data)=>{
        const current = getCurrentUser(socket.id)
        
        io.emit("message",{message:data,name:current.name,time:moment().format('LT')})
        // console.log(`data is ${data} and username is ${username}`)
    })
    
    
})



server.listen(port,()=>[
    console.log(`Running on port ${port}`)
])
