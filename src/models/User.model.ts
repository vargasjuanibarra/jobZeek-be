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
    companyProfile: CompanyProfileDetails;
}

export interface UserProfileDetails {
    jobType: string;
    salary: string;
    education: string;
    profession: string;
    profileDesc: string;
    country: string;
}
export interface CompanyProfileDetails {
    companyName: string,
    industry: string,
    address: string,
    contactNumber: string,
    profileDesc: string,
    country: string,
    profession: string
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
        profileDesc: String,
        country: String
    },
    companyProfile: {
        companyName: String,
        industry: String,
        address: String,
        contactNumber: String,
        profileDesc: String,
        country: String,
        profession: String
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