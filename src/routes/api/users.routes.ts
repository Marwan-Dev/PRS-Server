import { Router } from 'express';
import * as controller from '../../controllers/user.controller';

const routes = Router();

routes.route('/').get(controller.getAllUsers).post(controller.create);
routes
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

export default routes;
