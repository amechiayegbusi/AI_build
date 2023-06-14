// eslint-disable-next-line no-unused-vars
import { ObjectSchema, ValidationResult } from 'joi'

function useValidation<T>(
  schema: ObjectSchema<T>,
  value: T | any
): ValidationResult<T> {
  return schema.validate(value)
}

export default useValidation
