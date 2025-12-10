import { Router } from 'express';
import {
    createUserController,
    getAllUsersController,
    getUserController,
    updateUserController,
    deleteUserController
} from '../controllers/user.controller';

const router = Router();

router.post('/', createUserController);
router.get('/', getAllUsersController);
router.get('/:id', getUserController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
