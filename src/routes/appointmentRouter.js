import { Router } from "express";
import appointmentController from "../controllers/appointmentController.js";
import passport from '../config/passportConfig.js'
import { authorizeRole } from "../middleware/authorization.js";


const router = Router();

router.post('/',  passport.authenticate('jwt', { session: false }),
 appointmentController.create
);


router.get("/:id/confirm", appointmentController.confirmarTurno);
router.get("/:id/cancel", appointmentController.cancelarElTurno);


router.get('/',   appointmentController.getAll);

router.get('/admin',
  passport.authenticate('jwt', { session: false }),
  authorizeRole("admin"),
  appointmentController.getAllAdmin
);



router.get('/my/appointment', passport.authenticate('jwt', { session: false }),
  appointmentController.getMyAppointmentByUserId
)


router.get('/admin/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRole("admin"),
  appointmentController.getByIdAdmin
);



router.get('/:id', appointmentController.getById);


router.put('/:id', passport.authenticate('jwt', { session: false }),
 appointmentController.update
);


router.delete('/:id', passport.authenticate('jwt', {session: false}),
appointmentController.delete
);






export default router;
