import { validate } from 'class-validator';
import { GraphQLError } from 'graphql';

export class ValidationHelper {
  static async validateInput<T extends object>(input: T): Promise<void> {
    const errors = await validate(input);
    
    if (errors.length > 0) {
      const validationErrors = errors.map(err => ({
        field: err.property,
        message: Object.values(err.constraints || {}).join(', ')
      }));

      throw new GraphQLError('Input tidak valid', {
        extensions: {
          code: 'BAD_USER_INPUT',
          layer: 'VALIDATION',
          validationErrors
        }
      });
    }
  }
}
