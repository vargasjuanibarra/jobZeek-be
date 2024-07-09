import { Schema, model } from "mongoose";

interface company {
    name: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
}

  export interface Job {
    id: string;
    type: string;
    title: string;
    description: string;
    salary: string;
    location: string;
    company: company
  }

  const JobsSchema = new Schema<Job>({
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    company: {
        name: {
            type:String,
            required:true
        },
        description: {
            type: String,
            required: true
        },
        contactEmail: {
            type: String,
            required: true
        },
        contactPhone: {
            type: String,
            required: true
        }
    },
  },{
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
  })

  export const JobModel = model<Job>('job', JobsSchema)