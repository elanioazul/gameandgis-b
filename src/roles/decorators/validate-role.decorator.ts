// validate-role.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { RolesEnum } from '../enums/roles.enum';

@ValidatorConstraint({ async: false })
export class IsValidRoleConstraint implements ValidatorConstraintInterface {
  validate(role: any, args: ValidationArguments) {
    return Object.values(RolesEnum).includes(role);
  }

  defaultMessage(args: ValidationArguments) {
    return `Role must be one of the following: ${Object.values(RolesEnum).join(', ')}`;
  }
}

export function IsValidRole(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidRoleConstraint,
    });
  };
}
