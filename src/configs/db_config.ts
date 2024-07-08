import { connect } from 'mongoose';

export const dbConnect = () => {
    connect(process.env.MONGO_URI!)
    .then(() => 
        console.log('Connected to database'),
        (error) => console.log('Error when connecting to DB!', error)
    )
};