import { Schema, model } from "mongoose";


export interface User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    dateOfBirth: string;
}

const UserSchema = new Schema<User>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

export const UserModel = model<User>('user', UserSchema)