import express, { Request, Response, NextFunction } from 'express';
import { User, UserModel } from '../models/User.model';
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_OK } from '../constants/http_status';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

const router = express.Router();


router.get('/search', async (req: Request, res: Response) => {
    const { searchTerm, jobTypes } = req.query;

    let query: any = {};

    // Search in profession field using searchTerm
    if (searchTerm) {
        const searchRegex = new RegExp(searchTerm as string, 'i');
        query['userProfile.profession'] = { $regex: searchRegex };
    }

    // Filter by jobTypes
    if (jobTypes) {
        const jobTypesArray = (jobTypes as string).split(',');
        query['userProfile.jobType'] = { $in: jobTypesArray };
    }

    try {
        const users = await UserModel.find(query);
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching users' });
    }
});

router.get('/', async (req:Request, res: Response) => {
    try {
        const users = (await UserModel.find()).filter(user => user.isAdmin !== true )
        if(_.isEmpty(users)) {
            res.status(HTTP_NOT_FOUND).send({
                message: 'No users found'
            })
        }

        res.status(HTTP_OK).send(users);
    } catch (error) {
        console.error('Error! Sommething went wrong on getting users')
    }
})

router.post('/register', async (req: Request, res: Response) => {
    const { fullName, email, password, dateOfBirth, isAdmin } = req.body;

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
            isAdmin: isAdmin,
            isActive: true,
            ...(isAdmin ? {userProfile: {
                jobType: undefined,
                salary: undefined,
                education: undefined,
                position: undefined
            }}: {
                companyProfile: {
                    companyName: undefined,
                    industry: undefined,
                    address: undefined,
                    contactNumber: undefined,
                    profileDesc: undefined,
                }
            })
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

router.put('/:userId', async (req:Request, res: Response) => {
    const {
        fullName,
        dateOfBirth,
        // isActive,
        jobType,
        salary,
        education,
        profession,
        companyName,
        industry,
        address,
        country,
        contactNumber,
        profileDesc
        } = req.body

    const { userId } = req.params
    
        try {
            const user = await UserModel.findById(userId)

            if (!user) {
                res.status(HTTP_NOT_FOUND).send({
                    message: 'No user found'
                })
                return;
            }
            if (user.isAdmin) {
                user.fullName = fullName;
                user.dateOfBirth = dateOfBirth;
                user.companyProfile.profession = profession;
                user.companyProfile.companyName = companyName;
                user.companyProfile.industry = industry;
                user.companyProfile.address = address;
                user.companyProfile.country = country;
                user.companyProfile.contactNumber = contactNumber;
                user.companyProfile.profileDesc = profileDesc;
            } else {
                user.userProfile.jobType = jobType
                user.userProfile.salary = salary
                user.userProfile.education = education
                user.userProfile.profession = profession
                user.userProfile.profileDesc = profileDesc
                user.dateOfBirth = dateOfBirth;
                user.fullName = fullName;
            }

            const updatedProfile = await user.save();
            console.log("Profile updated successfully:", updatedProfile);
            
            res.send(updatedProfile);

        } catch (error) {
            res.status(500).send({
                message: `An error occurred while updating the profile, ${error}`,
              });
        }

})


router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const user = await UserModel.findById(id);
    
        if (!user) {
            res.status(HTTP_NOT_FOUND).send({
                message: 'No user found'
            })
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({
            message: 'Something went wrong on fetching the user'
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