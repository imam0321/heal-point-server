import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { PatientService } from './patient.service';
import sendResponse from '../../utils/sendResponse';
import { patientFilterableFields } from './patient.constant';
import pick from '../../utils/pick';


const getAllPatients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await PatientService.getAllPatients(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patient retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdPatient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await PatientService.getByIdPatient(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patient retrieval successfully',
    data: result,
  });
});

const softDeletePatient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await PatientService.softDeletePatient(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patient soft deleted successfully',
    data: result,
  });
});


export const PatientController = {
  getAllPatients,
  getByIdPatient,
  softDeletePatient,
};