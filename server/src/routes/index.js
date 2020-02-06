import express from 'express';
import * as user from '../controllers/user';
import * as chkinfo from '../controllers/check-information';
import { verifyToken, verifyAdmin } from '../middlewares';

const router = express.Router();

router.post('/signup', user.joinUser);
router.post('/signin', user.loginUser);

// APIs for autorized users
router.use(verifyToken);

// User
router
  .route('/myuser')
  .get(user.getMyUser)
  .delete(user.deleteMyAccount);

router.patch('/myuser/password', user.changePassword);

// CheckInformation
router
  .route('/mychkinfo')
  .get(chkinfo.getMyCheckInformation)
  .post(chkinfo.createMyCheckInformation);

router
  .route('/mychkinfo/:id')
  .put(chkinfo.updateMyCheckInformation)
  .delete(chkinfo.deleteMyCheckInformation);

// APIs for admin
router.use(verifyAdmin);

// User
router
  .route('/admin/user')
  .get(user.getUsers)
  .post(user.createUser);

router
  .route('/admin/user/:id')
  .get(user.getUser)
  .put(user.putUser)
  .delete(user.deleteUser);

// CheckInformation
router
  .route('/admin/chkinfo')
  .get(chkinfo.getCheckInformation)
  .post(chkinfo.createCheckInformation);

router
  .route('/admin/chkinfo/:id')
  .get(chkinfo.getOneCheckInformation)
  .put(chkinfo.putCheckInformation)
  .delete(chkinfo.deleteCheckInformation);

export default router;
