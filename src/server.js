import fileUpload from 'express-fileupload'
import { Server } from "socket.io"
import express from "express"
import http from "http"
import path from "path"
import ejs from "ejs"

import JWT from './utils/jwt.js'
import authRouter from './routes/auth.js'
import checkToken from './middlewares/checkToken.js'

process.backendUrl = 'http://167.71.50.31:4005/'

import './utils/config.js'
import database from './utils/db.js'
import getOnlinUsers from './helper/onlineUsers.js'
import allUsers from './helper/allUsers.js'
import getMessage from './helper/getMessage.js'
import insertMessage from './helper/insertMessage.js'
import searchOnlineUsers from './helper/searchOnlineUsers.js'
import searchAllUsers from './helper/searchAllUsers.js'

import logOut from './helper/logOut.js'


const PORT = process.env.PORT || 4005
const app = express()

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(process.cwd(), 'src', 'views'))

app.use(express.static(path.join(process.cwd(), 'src', 'public')))
app.use(express.static(path.join(process.cwd(), 'uploads')))
app.use(fileUpload())

app.get('/', (req, res) => res.render('home'))
app.get('/login', (req, res) => res.render('login'))

const httpServer = http.createServer(app)
const io = new Server(httpServer)

//_________________________________________________________
const db = await database()


// connect to db
app.use((req, res, next) => {
    req.models = db.models
    req.sequalize = db.sequalize
    next()
})



// routers
app.use(authRouter)


app.use((error, req, res, next) => {
    if(error.status === 400) {
        return res.status(error.status).json({
            status: error.status,
            message: error.message,
            data: null
        })
    }
})


let users = []

io.on("connection", async socket => {
    const socketId = socket.id
    console.log("Connected")
    try{
        const token = socket.handshake.headers.token
        const {userId} = JWT.verify(token)

        users.push({ userId, socketId})

        io.emit('online users', await getOnlinUsers(db))

        socket.on('select user', async (user_to) => {
            let user_from = userId
            const messages = await getMessage(db, user_from, user_to)
            socket.emit('messages', messages)
        })

        socket.on('all users', async () => {
            const users = await allUsers(db)
            socket.emit('all users', users)
        })


        socket.on('new message', (data) => {
            data.userId = userId
            insertMessage(db, data)
            const socketId = users.find(user => user.userId == data.userTo)?.socketId
            if (socketId) {
                io.to(socketId).emit('new message', data)
            }
        })

        socket.on('log out', async () => {
            await logOut(db, userId)
            io.emit('online users', await getOnlinUsers(db))
        })

        socket.on('search online', async (data) => {
            io.emit('online users', await searchOnlineUsers(db, userId, data))
        })

        socket.on('search all users', async (data) => {
            let users =  await searchAllUsers(db, data)
            socket.emit('all users', users)
        })

        socket.on('disconnect', async () => {
            console.log('Disconect', userId)
            users = users.filter(u => u.userId != userId )
        })
    }catch(error) {
        socket.emit('error', error)
    }
})


httpServer.listen(PORT, () => console.log('*4005'))