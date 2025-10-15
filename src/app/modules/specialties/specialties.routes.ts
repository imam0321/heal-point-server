import { SpecialtiesValidation } from './specialties.validation';
import { NextFunction, Request, Response, Router } from 'express';
import { SpecialtiesController } from './specialties.controller';
import { fileUploader } from '../../helpers/fileUploader';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../utils/checkAuth';

const router = Router();

router.get('/', SpecialtiesController.getAllSpecialties);
router.post(
  '/',
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.create.parse(JSON.parse(req.body.data))
    return SpecialtiesController.createSpecialty(req, res, next)
  }
);
router.delete(
  '/:id',
  checkAuth(UserRole.ADMIN, UserRole.ADMIN),
  SpecialtiesController.deleteSpecialty
);

export const SpecialtiesRouters = router;