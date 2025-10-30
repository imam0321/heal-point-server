
import { Router } from 'express';
import { PatientController } from './patient.controller';

const router = Router();

router.get('/', PatientController.getAllPatients);
router.get('/:id', PatientController.getByIdPatient);
router.delete('/soft/:id', PatientController.softDeletePatient);

export const PatientRoutes = router;