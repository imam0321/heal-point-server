import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let success: boolean = false;
    let message: string = err.message || "Something went wrong!";
    let error = err;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                message = "Duplicate key error: A unique constraint would be violated.";
                error = err.meta;
                statusCode = httpStatus.CONFLICT;
                break;
            case "P2003":
                message = "Foreign key constraint failed.";
                error = err.meta;
                statusCode = httpStatus.BAD_REQUEST;
                break;
            case "P2000":
                message = "Value too long for column.";
                error = err.meta;
                statusCode = httpStatus.BAD_REQUEST;
                break;
            case "P2001":
                message = "Record not found.";
                error = err.meta;
                statusCode = httpStatus.NOT_FOUND;
                break;
            case "P2004":
                message = "A constraint failed on the database.";
                error = err.meta;
                statusCode = httpStatus.BAD_REQUEST;
                break;
            case "P1000":
                message = "Authentication failed against database server.";
                error = err.meta;
                statusCode = httpStatus.UNAUTHORIZED;
                break;
            default:
                message = "Database error occurred.";
                error = err.meta || err;
        }
    }

    // Prisma Validation Error
    if (err instanceof Prisma.PrismaClientValidationError) {
        message = "Validation Error";
        error = err.message;
        statusCode = httpStatus.BAD_REQUEST;
    }

    // Prisma Unknown Request Error
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        message = "Unknown Prisma error occurred";
        error = err.message;
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }

    // Prisma Initialization Error
    if (err instanceof Prisma.PrismaClientInitializationError) {
        message = "Prisma client failed to initialize";
        error = err.message;
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }

    res.status(statusCode).json({
        success,
        message,
        error
    })
};

export default globalErrorHandler;