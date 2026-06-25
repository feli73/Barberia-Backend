import userController from '../controllers/userController.js';
import { Router } from 'express';
import passport from '../config/passportConfig.js';
import { authorizeRole } from '../middleware/authorization.js';


const router = Router();

router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/email', userController.getByEmail);
router.get('/search', userController.searchByName);
router.get('/:id', userController.getById);


router.put('/:id', passport.authenticate('jwt', { session: false }), 
  userController.update);


router.delete('/:id', passport.authenticate('jwt', { session: false }),
  authorizeRole("admin"), userController.delete);

router.put('/:id/promote', passport.authenticate('jwt', { session:false }),
 authorizeRole("admin"),userController.promoteToAdmin)

  export default router;