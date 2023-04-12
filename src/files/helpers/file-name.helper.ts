export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void
) => {
  const fileExension = file.originalname.split('.').pop();
  const filename = `${file.fieldname}-${Date.now()}.${fileExension}`;

  callback(null, filename);
};
