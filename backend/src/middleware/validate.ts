import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { BadRequestError } from '../utils/errors';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        next(new BadRequestError(messages.join(', ')));
      } else {
        next(error);
      }
    }
  };
};
