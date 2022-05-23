import Errors from '../utils/error.js'
import sha256 from 'sha256'
import path from 'path'
import JWT from '../utils/jwt.js'


const REGISTER = async (req, res, next) => {
    const {file} = req.files
    let userName = req.body.userName?.trim()
    let password = req.body.password?.trim()

    if(!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
        return next(
            new Errors.AuthorizationError(400, 'Invalid file mime type!')
        )
    }

    if(file.size > 500000) {
        return next(
            new Errors.AuthorizationError(400, 'File size has exceeds the maximum limit')
        )
    }
    if(!userName || !password) {
        return next(
            new Errors.AuthorizationError(400, 'Invalid input')
        )
    }

    try {
        const agent = req.headers['user-agent']
        const fileName = Date.now() + file.name.replace(/\s/g, '')
        const filePath = path.join(process.cwd(), 'uploads', fileName)
        

        let newUser = await req.models.User.create({
            username: userName,
            password: sha256(password),
            user_img: fileName
        })

        file.mv(filePath)

        const user = {
            user_id: newUser.user_id,
            username: newUser.username,
            user_img: process.backendUrl+ newUser.user_img,
            user_created_at: newUser.user_created_at
        }

        return res.json({
            status: 200,
            message: 'The user created!',
            data: user,
            token: JWT.sign({ userId: newUser.userId, agent})
        })

    } catch (error) {
        return next(
            new Errors.AuthorizationError(400, error.message)
        )
    }


}

const LOGIN = async (req, res) => {

    const [user] = await req.models.User.findAll({
        where: {
            username: req.body.userName,
            password: sha256(req.body.password)
        }
    })

    const agent = req.headers['user-agent']

    if(user) {
        await req.models.User.update({
                logged: true
            },
            {
                where: {
                    user_id: user.user_id}

            }
        )
        return res.json({
            status: 200,
            message: 'The user logged in!',
            data: user,
            token: JWT.sign({ userId: user.user_id, agent})
        })
    }else {
        return res.json({
            status: 400,
            message: 'Wrong username or password!',
            data: user,
        })
    }

}


export default {
    REGISTER,
    LOGIN
}