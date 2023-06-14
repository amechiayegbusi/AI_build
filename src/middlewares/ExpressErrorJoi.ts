import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'joi'

async function ExpressErrorJoi(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ValidationError) {
    console.log('ERROR JOI VALIDATION!!!')
    const error = {
      code: 422,
      message: err.details.join('<br/>') || 'Joi Validation Error !',
      errors:
        err.details.length > 0
          ? err.details.reduce((acc: any, curVal: any) => {
              acc[`${curVal.path}`] = curVal.message || curVal.type
              return acc
            }, {})
          : { [`${err.name}`]: err.message },
    }
    return res.status(422).json(error)
  }

  next(err)
}

export default ExpressErrorJoi
