import express, { Request, Response, NextFunction } from 'express';
import { JobRoutes, UserRoutes } from './routes'
import dotenv from 'dotenv';
import { dbConnect } from './configs/db_config';

dotenv.config();
dbConnect()

const app = express();
const PORT = 5000

app.use(express.json());
app.use(express.urlencoded())

app.use('/api/jobs', JobRoutes)
app.use('/api/user', UserRoutes)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});