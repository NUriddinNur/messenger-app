import {Router} from 'express'
import CT from '../controllers/auth.js'
const router = Router()


router.post('/register', CT.REGISTER)
router.post('/login', CT.LOGIN)


export default router