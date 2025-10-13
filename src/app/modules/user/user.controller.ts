import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import pick from "../../utils/pick";


const createPatient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient Created Successfully",
    data: result
  })
})

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctor(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Created Successfully!",
    data: result
  })
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin Created Successfully!",
    data: result
  })
});

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters = pick(req.query, ["status", "role", "email", "searchTerm"])
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

  const result = await UserService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: 202,
    success: true,
    message: "Users retrieved Successfully",
    data: result.data,
    meta: result.meta
  })
})



export const UserController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
}