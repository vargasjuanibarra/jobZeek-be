import express, { Request, Response } from 'express';
import { JobModel } from '../models/Jobs.model';
import * as _ from 'lodash'
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_OK } from '../constants/http_status';
import { dataSeedJobs } from '../data/jobs';

const router = express.Router();

router.get('/seed', async(req: Request, res: Response) => {
    const jobsCount = await JobModel.countDocuments();

    if (jobsCount > 0) {
        res.status(HTTP_OK).send({
            message: 'Seed is already done'
        })
        return;
    }

    await JobModel.create(dataSeedJobs);
})

router.get('/', async(req: Request, res:Response) => {
    const jobs = await JobModel.find();

    if(_.isEmpty(jobs)) {
        res.status(HTTP_NOT_FOUND).send({
            message: 'No jobs found'
        });
        throw new Error('Error! No existing jobs found')
    }
    res.status(HTTP_OK).send(jobs)
})

router.get('/:jobId', async(req: Request, res: Response) => {
    const job = await JobModel.findById(req.params.jobId)

    if (!job) {
        if (!job) {
            res.status(HTTP_BAD_REQUEST).send({
                message: 'No job found'
            })
            throw new Error('Error! No job found')
        }
    }
    console.log(job);
    res.status(HTTP_OK).send(job);
})

router.post('/', async(req: Request, res: Response) => {
    const { 
        title, 
        type, 
        description, 
        salary, 
        location, 
        company: { 
          name: companyName, 
          description: companyDescription, 
          contactEmail, 
          contactPhone 
        } 
      } = req.body;

      if (
        !title || 
        !type || 
        !description || 
        !salary || 
        !location || 
        !companyName || 
        !companyDescription || 
        !contactEmail || 
        !contactPhone 
      ) {
        res.status(HTTP_BAD_REQUEST).send({
            message: 'Please fill in all fields'
        })
        throw new Error('Error! Please fill in all fields')
      }

      const newJob = { 
        title, 
        type, 
        description, 
        salary, 
        location, 
        company: { 
          name: companyName, 
          description: companyDescription, 
          contactEmail, 
          contactPhone 
        } 
      }

      const saveJob = await JobModel.create(newJob);
      res.status(HTTP_OK).send(saveJob)
      
})

router.put('/:jobId', async(req: Request, res: Response) => {
    const { 
        title, 
        type, 
        description, 
        salary, 
        location, 
        company: { 
          name: companyName, 
          description: companyDescription, 
          contactEmail, 
          contactPhone 
        } 
      } = req.body;

    const job = await JobModel.findById(req.params.jobId)

    if (!job) {
        res.status(HTTP_BAD_REQUEST).send({
            message: 'No job found'
        })
        throw new Error('Error! No job found')
    }

    const updatedJobObj = { 
        title, 
        type, 
        description, 
        salary, 
        location, 
        company: { 
          name: companyName, 
          description: companyDescription, 
          contactEmail, 
          contactPhone 
        } 
      }

      const updatedJob = await JobModel.findByIdAndUpdate(req.params.jobId, updatedJobObj)
      res.status(HTTP_OK).send(updatedJob)
})

router.delete('/:jobId', async(req: Request, res: Response) => {
    const job = await JobModel.findByIdAndDelete(req.params.jobId)
    
    if (!job) {
        console.log('jobToBeDeleted', job);
        res.status(HTTP_NOT_FOUND).send({
            message: 'No job found'
        })
        throw new Error('Error! No job found')
    }
    res.status(HTTP_OK).send(job)
    
})

router.get('/search/:searchTerm', async(req: Request, res: Response) => {
    const searchRegex = new RegExp(req.params.searchTerm, 'i')
    const jobs = await JobModel.find({title: { $regex: searchRegex }});
    res.status(HTTP_OK).send(jobs)
})

export {router as JobRoutes};