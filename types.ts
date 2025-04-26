import type { Request } from 'express';
import type { Multer } from 'multer';

export interface MulterRequest extends Request {
  file: Express.Multer.File;
}