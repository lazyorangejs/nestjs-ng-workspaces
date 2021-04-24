import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  Length,
} from 'class-validator'

// https://github.com/typestack/class-validator#custom-validation-decorators

export const IsPassword = (validationOptions?: ValidationOptions) =>
  Length(10, 21, validationOptions)

export function IsPassword2(
  validationOptions: ValidationOptions = {
    message: 'Password must be longer than 10 chars and not less of 21 chars',
  }
) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsPassword2',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          return (
            typeof value === 'string' &&
            value.length >= 10 &&
            value.length <= 21
          ) // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    })
  }
}
