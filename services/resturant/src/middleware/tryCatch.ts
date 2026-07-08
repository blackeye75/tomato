import { Response, Request, RequestHandler, NextFunction } from "express";

const TryCatch = (handler: RequestHandler): RequestHandler => {
 return async (req: Request, res: Response, next: NextFunction) => {
  try {
   await handler(req, res, next);
  } catch (error: any) {
    console.log(error+" From asyncHandler");
   res.status(500).json({
    message: error.message+error +" From asyncHandler",
   });
  }
 };
};

export default TryCatch
