import express, { Request, Response } from 'express';
import { JobModel } from '../models/Jobs.model';
import * as _ from 'lodash'
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND, HTTP_OK } from '../constants/http_status';
import { dataSeedJobs } from '../data/jobs';

const router = express.Router();

router.get('/seed', async(req: Request, res: Response) => {
    try {
        const jobsCount = await JobModel.countDocuments();
    
        if (jobsCount > 0) {
            res.status(HTTP_OK).send({
                message: 'Seed is already done'
            })
            return;
        }
    
        await JobModel.create(dataSeedJobs);
    } catch (error) {
        console.error('Error on seeding job');
    }
})

router.get('/', async(req: Request, res:Response) => {
    try {
        const jobs = await JobModel.find();
    
        if(_.isEmpty(jobs)) {
            res.status(HTTP_NOT_FOUND).send({
                message: 'No jobs found'
            });
            throw new Error('Error! No existing jobs found')
        }
        res.status(HTTP_OK).send(jobs)
    } catch (error) {
        console.error('Error on getting job', error);
    }
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

      try {
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
      } catch (error) {
        console.error('Error on creating job', error);
      }

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

      try {
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
      } catch (error) {
        console.error('Error on updating job', error)
      }

})

router.delete('/:jobId', async(req: Request, res: Response) => {
    const job = await JobModel.findByIdAndDelete(req.params.jobId)
    try {
        
        if (!job) {
            res.status(HTTP_NOT_FOUND).send({
                message: 'No job found'
            })
        }
        res.status(HTTP_OK).send(job)
    } catch (error) {
        console.error('Error on deleting job', error);
    }
    
})

router.get('/search', async (req: Request, res: Response) => {
    const { searchTerm, jobTypes } = req.query;

    let query: any = {};

    if (searchTerm) {
        const searchRegex = new RegExp(searchTerm as string, 'i');
        query.title = { $regex: searchRegex };
    }

    if (jobTypes) {
        const jobTypesArray = (jobTypes as string).split(',');
        query.type = { $in: jobTypesArray };
    }

    try {
        const jobs = await JobModel.find(query);
        res.status(HTTP_OK).send(jobs);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching jobs' });
    }
});

// needs to be defined last so that wont get triggered when calling the /search endpoint
router.get('/:jobId', async(req: Request, res: Response) => {
    const job = await JobModel.findById(req.params.jobId)
    try {
        if (!job) {
            if (!job) {
                res.status(HTTP_BAD_REQUEST).send({
                    message: 'No job found'
                })
            }
        }
        res.status(HTTP_OK).send(job);
    } catch (error) {
        console.error('Error on getting job', error)
    }
})

export {router as JobRoutes};