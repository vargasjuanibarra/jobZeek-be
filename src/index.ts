import express, { Request, Response, NextFunction } from 'express';
import { JobRoutes, UserRoutes } from './routes'
import dotenv from 'dotenv';
import { dbConnect } from './configs/db_config';
import cors from 'cors';

dotenv.config();
dbConnect()

const app = express();
const PORT = 5000

const allowedOrigins = ['https://jobzeeker-fe.onrender.com'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/jobs', JobRoutes)
app.use('/users', UserRoutes)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});