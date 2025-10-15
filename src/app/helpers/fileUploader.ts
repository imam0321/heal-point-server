import multer from "multer"
import path from "path"
import fs from "fs/promises"
import { v2 as cloudinary } from "cloudinary"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"
import statusCode from "http-status-codes"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
})

const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: Express.Multer.File) => {
  cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_CLOUD_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_CLOUD_API_SECRET
  });

  if (!file?.path) throw new AppError(statusCode.NOT_FOUND, "No file path found for upload");

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "heal-point",
      public_id: file.filename,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new AppError(statusCode.BAD_REQUEST, "Failed to upload file to Cloudinary");
  } finally {
    await fs.unlink(file.path).catch(() => { });
  }
};


export const fileUploader = {
  upload,
  uploadToCloudinary,
}