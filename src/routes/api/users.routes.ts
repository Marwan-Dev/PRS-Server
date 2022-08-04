import { Router } from 'express';
import * as controller from '../../controllers/user.controller';
import authenticationMiddleware from '../../middleware/authenticate.middleware';

const routes = Router();

// api /users
routes
  .route('/')
  .get(authenticationMiddleware, controller.getAllUsers)
  .post(controller.create);
routes
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

// authentication
routes.route('/auth').post(controller.authinticateUser);
export default routes;
