import { NextFunction, Request, Response } from 'express'
import { ObjectSchema, ValidationResult, ValidationError } from 'joi'

const JoiValidatorMiddleware = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const formData = req.getBody()
    const { error }: ValidationResult = schema.validate(formData)

    const valid =
      error == null || (error && error.details && error.details.length === 0)

    if (valid) next()
    else if (error instanceof ValidationError) {
      console.log('ERROR JOI VALIDATION!!!')
      const err = {
        code: 422,
        message: 'Joi Validation Error !',
        errors:
          error.details.length > 0
            ? error.details.reduce((acc: any, curVal: any) => {
                acc[`${curVal.path}`] = curVal.message || curVal.type
                return acc
              }, {})
            : { [`${error.name}`]: error.message },
      }
      return res.status(422).json(err)
    }
  }
}

export default JoiValidatorMiddleware
