import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void
) => {
  const fileExension = file.originalname.split('.').pop();
  const filename = `${uuid()}.${fileExension}`;

  callback(null, filename);
};
