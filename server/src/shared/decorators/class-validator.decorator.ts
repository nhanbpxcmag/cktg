import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as mongoose from 'mongoose';

export function IsObjectID(
  prefixMessage?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isObjectID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return mongoose.Types.ObjectId.isValid(value);
        },
        defaultMessage: (validationArguments?: ValidationArguments) => {
          return `_id ${prefixMessage} không hợp lệ`;
        },
      },
    });
  };
}
