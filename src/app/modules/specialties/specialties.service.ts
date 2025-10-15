import { Request } from "express";
import { Specialties } from "@prisma/client";
import { fileUploader } from "../../helpers/fileUploader";
import { prisma } from "../../config/db";

const createSpecialty = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body
  });

  return result;
};

const getAllSpecialties = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
}

const deleteSpecialty = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesService = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty
}