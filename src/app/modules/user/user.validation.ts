import z from "zod";

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.email(),
    address: z.string().optional(),
  }),
})

export const UserValidation = {
  createPatientValidationSchema,
}