import { Schema, model } from "mongoose";


export interface User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    dateOfBirth: string;
    isActive: boolean;
    userProfile: UserProfileDetails;
}

export interface UserProfileDetails {
    jobType: string;
    salary: string;
    education: string;
    profession: string;
    profileDesc: string;
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
    },
    isActive: {
        type: Boolean,
        required: true
    },
    userProfile: {
        jobType: String,
        salary: String,
        education: String,
        profession: String,
        profileDesc: String
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