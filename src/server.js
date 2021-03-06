import fileUpload from 'express-fileupload'
import { Server } from "socket.io"
import express from "express"
import http from "http"
import path from "path"
import ejs from "ejs"

import JWT from './utils/jwt.js'
import authRouter from './routes/auth.js'

process.backendUrl = 'http://167.71.50.31:4005/'

import comunicatingUsers from './helper/comunicatingUsers.js'
import searchOnlineUsers from './helper/searchOnlineUsers.js'
import userUpdateStatus from './helper/userUpdateStatus.js'
import searchAllUsers from './helper/searchAllUsers.js'
import insertMessage from './helper/insertMessage.js'
import getMessage from './helper/getMessage.js'
import allUsers from './helper/allUsers.js'
import './utils/config.js'
import database from './utils/db.js'


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

        userUpdateStatus(db, userId, true)
        users.push({ userId, socketId})

        socket.emit('communicating Users', await comunicatingUsers(db, userId))

        socket.on('select user', async (user_to) => {
            let user_from = userId
            const messages = await getMessage(db, user_from, user_to)
            socket.emit('messages', messages)
        })

        socket.on('all users', async () => {
            const users = await allUsers(db)
            socket.emit('all users', users)
        })


        socket.on('new message', async (data) => {
            data.userId = userId
            insertMessage(db, data)
            socket.emit('communicating Users', await comunicatingUsers(db, userId))
            const socketId = users.find(user => user.userId == data.userTo)?.socketId
            if (socketId) {
                io.to(socketId).emit('new message', await data)
                io.to(socketId).emit('communicating Users', await comunicatingUsers(db, data.userTo))
            }
        })

        socket.on('search online', async (data) => {
            io.emit('communicating Users', await searchOnlineUsers(db, userId, data))
        })

        socket.on('search all users', async (data) => {
            let users =  await searchAllUsers(db, data)
            socket.emit('all users', users)
        })

        socket.on('disconnect', async () => {
            console.log('Disconect', userId)
            users = users.filter(u => u.userId != userId )

            for await (let u of users) {
                console.log(u.userId);
                io.emit('communicating Users', await comunicatingUsers(db, u.userId))
            }

            await userUpdateStatus(db, userId, false)
        })

    }catch(error) {
        socket.emit('error', error)
    }
})


httpServer.listen(PORT, () => console.log('*4005'))