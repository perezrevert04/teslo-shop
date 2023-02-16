export const fileFilter = () => {
  return (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error, acceptFile: boolean) => void
  ) => {
    if (file?.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      callback(null, true);
    } else {
      callback(new Error('Only image files are allowed!'), false);
    }
  };
};
