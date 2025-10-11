import { Gender } from "@prisma/client"

export interface ICreatePatientInput {
  name: string
  email: string
  password: string
  profilePhoto?: string
  contactNumber?: string
  address?: string
  gender?: Gender
}