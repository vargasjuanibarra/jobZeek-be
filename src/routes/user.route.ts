import express, { Request, Response, NextFunction } from 'express';
import { User, UserModel } from '../models/User.model';
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_OK } from '../constants/http_status';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const { id } = req.body
    const user = await UserModel.findById(id);

    if (!user) {
        res.status(HTTP_NOT_FOUND).send({
            message: 'No user found'
        })
        throw new Error('No user found')
    }
    res.send(user);
})

router.post('/register', async (req: Request, res: Response) => {
    const { fullName, email, password, dateOfBirth } = req.body;

    const user = await UserModel.findOne({email})

    try {
        if (user) {
            res.status(HTTP_BAD_REQUEST).send({
                message: 'User already Exists!'
            })
            res.status(HTTP_BAD_REQUEST).send({ message:'Error! User already Exists'});
        }
    
        const encryptPassword = await bcrypt.hash(password, 10)
    
        const newUser = {
            id: '',
            fullName: fullName,
            email: email.toLowerCase(),
            password: encryptPassword,
            dateOfBirth,
            isAdmin: false
        }
    
        const saveUser = await UserModel.create(newUser);
        res.status(HTTP_OK).send(generateUserToken(saveUser));
    } catch (error) {
        console.log('Error on register', error)
    }
    
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(HTTP_OK).send(generateUserToken(user))
    } else {
        res.status(HTTP_BAD_REQUEST).send({
            message: 'Invalid email and passord'
        })
    }
})

const generateUserToken = (user: User) => {
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET!, {
        expiresIn: '30d'
    });

    return {
        id: user.id,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin,
        token: token
    }
}

export { router as UserRoutes};